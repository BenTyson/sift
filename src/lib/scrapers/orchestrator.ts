import { createClient } from '@/lib/supabase/server'
import type { Database, DealInsert } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ScrapedDeal, ScraperResult, Scraper } from './types'
import { appSumoScraper } from './appsumo'

type TypedSupabaseClient = SupabaseClient<Database>

// Register all scrapers here
const scrapers: Scraper[] = [
  appSumoScraper,
  // Add more scrapers: stackSocialScraper, pitchGroundScraper, etc.
]

interface ToolMatch {
  id: string
  name: string
  slug: string
}

// Simple fuzzy matching for tool names
function normalizeToolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/(ai|app|tool|software|pro|premium|lifetime|deal|ltd)$/g, '')
}

async function findMatchingTool(toolName: string): Promise<ToolMatch | null> {
  const supabase = await createClient()

  // First try exact match on name or slug
  const normalized = normalizeToolName(toolName)

  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, slug')
    .eq('status', 'active')

  if (!tools || tools.length === 0) return null

  // Try exact slug match
  const exactSlug = tools.find((t: ToolMatch) => t.slug === normalized)
  if (exactSlug) return exactSlug

  // Try fuzzy name match
  for (const tool of tools as ToolMatch[]) {
    const toolNormalized = normalizeToolName(tool.name)
    if (toolNormalized === normalized) {
      return tool
    }
    // Partial match (tool name contains or is contained in deal name)
    if (normalized.includes(toolNormalized) || toolNormalized.includes(normalized)) {
      return tool
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
      const matchedTool = deal.toolName
        ? await findMatchingTool(deal.toolName)
        : null

      const dealData: DealInsert = {
        tool_id: matchedTool?.id || null,
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
