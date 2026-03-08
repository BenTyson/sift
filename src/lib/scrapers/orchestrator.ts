import { createClient } from '@/lib/supabase/server'
import type { Database, DealInsert } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ScrapedDeal, Scraper, ToolMatchResult } from './types'
import { appSumoScraper } from './appsumo'
import { stackSocialScraper } from './stacksocial'
import { pitchGroundScraper } from './pitchground'

type TypedSupabaseClient = SupabaseClient<Database>

// Register all scrapers here
const scrapers: Scraper[] = [
  appSumoScraper,
  stackSocialScraper,
  pitchGroundScraper,
]

interface ToolRow {
  id: string
  name: string
  slug: string
  website_url: string
}

interface AliasRow {
  alias: string
  tool_id: string
  tools: { id: string; name: string; slug: string }
}

function normalizeToolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/(ai|app|tool|software|pro|premium|lifetime|deal|ltd)$/g, '')
}

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  const curr = new Array(n + 1)

  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      )
    }
    // Swap rows
    for (let j = 0; j <= n; j++) {
      prev[j] = curr[j]
    }
  }
  return prev[n]
}

async function findMatchingTool(
  toolName: string,
  sourceUrl?: string
): Promise<ToolMatchResult | null> {
  const supabase = await createClient()
  const normalized = normalizeToolName(toolName)

  // Fetch tools and aliases in parallel
  const [{ data: tools }, { data: aliases }] = await Promise.all([
    supabase
      .from('tools')
      .select('id, name, slug, website_url')
      .eq('status', 'active') as unknown as { data: ToolRow[] | null },
    (supabase
      .from('tool_aliases') as any)
      .select('alias, tool_id, tools:tool_id(id, name, slug)') as unknown as { data: AliasRow[] | null },
  ])

  if (!tools || tools.length === 0) return null

  // 1. Exact slug match (confidence 1.0)
  const slugMatch = tools.find(t => t.slug === normalized)
  if (slugMatch) {
    return {
      tool: { id: slugMatch.id, name: slugMatch.name, slug: slugMatch.slug },
      confidence: 1.0,
      matchType: 'exact-slug',
    }
  }

  // 2. Exact normalized name match (confidence 1.0)
  for (const tool of tools) {
    if (normalizeToolName(tool.name) === normalized) {
      return {
        tool: { id: tool.id, name: tool.name, slug: tool.slug },
        confidence: 1.0,
        matchType: 'exact-name',
      }
    }
  }

  // 3. Alias match (confidence 0.95)
  if (aliases && aliases.length > 0) {
    const normalizedForAlias = toolName.toLowerCase().trim()
    for (const alias of aliases) {
      if (alias.alias.toLowerCase() === normalizedForAlias && alias.tools) {
        return {
          tool: alias.tools,
          confidence: 0.95,
          matchType: 'alias',
        }
      }
    }
    // Also try normalized version against aliases
    for (const alias of aliases) {
      if (normalizeToolName(alias.alias) === normalized && alias.tools) {
        return {
          tool: alias.tools,
          confidence: 0.95,
          matchType: 'alias',
        }
      }
    }
  }

  // 4. Domain match (confidence 0.9)
  if (sourceUrl) {
    const sourceDomain = extractDomain(sourceUrl)
    if (sourceDomain) {
      for (const tool of tools) {
        const toolDomain = extractDomain(tool.website_url)
        if (toolDomain && toolDomain === sourceDomain) {
          return {
            tool: { id: tool.id, name: tool.name, slug: tool.slug },
            confidence: 0.9,
            matchType: 'domain',
          }
        }
      }
    }
  }

  // 5. Levenshtein distance (require name >= 5 chars, min confidence 0.75)
  if (normalized.length >= 5) {
    let bestMatch: ToolRow | null = null
    let bestConfidence = 0

    for (const tool of tools) {
      const toolNormalized = normalizeToolName(tool.name)
      if (toolNormalized.length < 5) continue

      const distance = levenshtein(normalized, toolNormalized)
      const maxLen = Math.max(normalized.length, toolNormalized.length)
      const confidence = 1 - distance / maxLen

      if (confidence >= 0.75 && confidence > bestConfidence) {
        bestConfidence = confidence
        bestMatch = tool
      }
    }

    if (bestMatch) {
      return {
        tool: { id: bestMatch.id, name: bestMatch.name, slug: bestMatch.slug },
        confidence: bestConfidence,
        matchType: 'levenshtein',
      }
    }
  }

  // 6. Substring match (confidence 0.6, require substring >= 4 chars)
  if (normalized.length >= 4) {
    for (const tool of tools) {
      const toolNormalized = normalizeToolName(tool.name)
      if (toolNormalized.length < 4) continue

      if (normalized.includes(toolNormalized) || toolNormalized.includes(normalized)) {
        return {
          tool: { id: tool.id, name: tool.name, slug: tool.slug },
          confidence: 0.6,
          matchType: 'substring',
        }
      }
    }
  }

  return null
}

interface UpsertResult {
  inserted: number
  updated: number
  skipped: number
  errors: string[]
}

async function upsertDeals(deals: ScrapedDeal[]): Promise<UpsertResult> {
  const supabase = await createClient() as TypedSupabaseClient
  const result: UpsertResult = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: []
  }

  for (const deal of deals) {
    try {
      // Check if deal already exists
      const { data: existing } = await supabase
        .from('deals')
        .select('id')
        .eq('source', deal.source)
        .eq('source_id', deal.sourceId)
        .single() as { data: { id: string } | null }

      // Find matching tool
      const matchResult = deal.toolName
        ? await findMatchingTool(deal.toolName, deal.toolUrl)
        : null

      const dealData: DealInsert = {
        tool_id: matchResult?.tool.id || null,
        source: deal.source,
        source_id: deal.sourceId,
        source_url: deal.sourceUrl,
        deal_type: deal.dealType,
        title: deal.title,
        description: deal.description || null,
        original_price: deal.originalPrice || null,
        deal_price: deal.dealPrice,
        discount_percent: deal.discountPercent || null,
        currency: deal.currency,
        coupon_code: deal.couponCode || null,
        affiliate_url: deal.affiliateUrl || deal.sourceUrl,
        expires_at: deal.expiresAt?.toISOString() || null,
        is_active: true
      }

      // Use type assertion to work around Supabase client type inference issues
      const dealsTable = supabase.from('deals') as unknown as {
        update: (data: DealInsert) => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> }
        insert: (data: DealInsert) => Promise<{ error: { message: string } | null }>
      }

      if (existing) {
        // Update existing deal
        const { error } = await dealsTable.update(dealData).eq('id', existing.id)

        if (error) {
          result.errors.push(`Failed to update deal ${deal.sourceId}: ${error.message}`)
        } else {
          result.updated++
        }
      } else {
        // Insert new deal
        const { error } = await dealsTable.insert(dealData)

        if (error) {
          result.errors.push(`Failed to insert deal ${deal.sourceId}: ${error.message}`)
        } else {
          result.inserted++
        }
      }
    } catch (err) {
      result.errors.push(`Error processing deal ${deal.sourceId}: ${err}`)
      result.skipped++
    }
  }

  return result
}

export interface OrchestratorResult {
  success: boolean
  totalDeals: number
  scraperResults: Array<{
    scraper: string
    deals: number
    errors: string[]
  }>
  upsertResult: UpsertResult
  duration: number
}

export async function runScrapers(): Promise<OrchestratorResult> {
  const startTime = Date.now()
  const allDeals: ScrapedDeal[] = []
  const scraperResults: OrchestratorResult['scraperResults'] = []

  // Run all scrapers
  for (const scraper of scrapers) {
    try {
      const result = await scraper.scrape()
      allDeals.push(...result.deals)
      scraperResults.push({
        scraper: scraper.name,
        deals: result.deals.length,
        errors: result.errors
      })
    } catch (error) {
      scraperResults.push({
        scraper: scraper.name,
        deals: 0,
        errors: [`Scraper crashed: ${error}`]
      })
    }
  }

  // Upsert all deals
  const upsertResult = await upsertDeals(allDeals)

  const duration = Date.now() - startTime

  return {
    success: upsertResult.errors.length === 0 && scraperResults.every(r => r.errors.length === 0),
    totalDeals: allDeals.length,
    scraperResults,
    upsertResult,
    duration
  }
}

// Mark expired deals as inactive
export async function expireDeals(): Promise<{ expired: number; error?: string }> {
  const supabase = await createClient() as TypedSupabaseClient

  // Use type assertion for the deals table
  const dealsTable = supabase.from('deals') as unknown as {
    update: (data: { is_active: boolean }) => {
      lt: (col: string, val: string) => {
        eq: (col: string, val: boolean) => {
          select: (cols: string) => Promise<{ data: { id: string }[] | null; error: { message: string } | null }>
        }
      }
    }
  }

  const { data, error } = await dealsTable
    .update({ is_active: false })
    .lt('expires_at', new Date().toISOString())
    .eq('is_active', true)
    .select('id')

  if (error) {
    return { expired: 0, error: error.message }
  }

  return { expired: data?.length || 0 }
}
