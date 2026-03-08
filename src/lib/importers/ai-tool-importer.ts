import { anthropic, isClaudeConfigured } from './claude-client'
import { createClient } from '@supabase/supabase-js'
import { TOOL_LIST, type ToolEntry } from './tool-list'
import { CATEGORY_SLUGS } from '@/lib/constants/categories'

const BATCH_SIZE = 5
const BATCH_DELAY_MS = 1000

const VALID_PRICING_MODELS = ['free', 'freemium', 'paid', 'open_source', 'contact_sales'] as const

interface GeneratedTool {
  name: string
  domain: string
  tagline: string
  description: string
  pricing_model: string
  features: string[]
  categories: string[]
}

export interface ImportResult {
  success: boolean
  inserted: number
  skipped: number
  errors: string[]
  duration: number
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function generateToolMetadata(batch: ToolEntry[]): Promise<GeneratedTool[]> {
  if (!anthropic) throw new Error('Claude API not configured')

  const toolNames = batch.map(t => `- ${t.name} (${t.domain})`).join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an AI tools expert. Generate metadata for these AI tools.

Valid category slugs (use ONLY these): ${CATEGORY_SLUGS.join(', ')}
Valid pricing models: ${VALID_PRICING_MODELS.join(', ')}

Tools to describe:
${toolNames}

Respond with ONLY a JSON array (no markdown fences, no explanation). Each object must have:
- "name": string (the tool's proper name)
- "domain": string (exactly as provided above)
- "tagline": string (under 80 chars, what it does)
- "description": string (2-3 sentences, what it does and who it's for)
- "pricing_model": one of the valid pricing models
- "features": array of 3-5 key features (short strings)
- "categories": array of 1-3 valid category slugs (first is primary)

Be accurate. If unsure about pricing, use "freemium". Focus on what makes each tool distinctive.`
      }
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = JSON.parse(text)

  if (!Array.isArray(parsed)) {
    throw new Error('Claude response is not a JSON array')
  }

  return parsed
}

function validateTool(tool: GeneratedTool): string | null {
  if (!tool.name || typeof tool.name !== 'string') return 'missing name'
  if (!tool.tagline || typeof tool.tagline !== 'string') return 'missing tagline'
  if (!tool.description || typeof tool.description !== 'string') return 'missing description'
  if (!VALID_PRICING_MODELS.includes(tool.pricing_model as typeof VALID_PRICING_MODELS[number])) {
    return `invalid pricing_model: ${tool.pricing_model}`
  }
  if (!Array.isArray(tool.features) || tool.features.length === 0) return 'missing features'
  if (!Array.isArray(tool.categories) || tool.categories.length === 0) return 'missing categories'

  const invalidCats = tool.categories.filter(c => !CATEGORY_SLUGS.includes(c as typeof CATEGORY_SLUGS[number]))
  if (invalidCats.length > 0) return `invalid categories: ${invalidCats.join(', ')}`

  return null
}

export async function importTools(
  entries?: ToolEntry[],
  limit?: number
): Promise<ImportResult> {
  const startTime = Date.now()
  const result: ImportResult = {
    success: true,
    inserted: 0,
    skipped: 0,
    errors: [],
    duration: 0,
  }

  if (!isClaudeConfigured()) {
    result.success = false
    result.errors.push('ANTHROPIC_API_KEY not configured')
    result.duration = Date.now() - startTime
    return result
  }

  const supabase = getSupabaseAdmin()

  // Fetch existing tools for dedup
  const { data: existingTools } = await supabase
    .from('tools')
    .select('slug, website_url')

  const existingSlugs = new Set((existingTools || []).map((t: { slug: string }) => t.slug))
  const existingDomains = new Set(
    (existingTools || [])
      .map((t: { website_url: string | null }) => {
        if (!t.website_url) return null
        try {
          return new URL(t.website_url).hostname.replace('www.', '')
        } catch {
          return null
        }
      })
      .filter(Boolean)
  )

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug')

  const categoryMap = new Map<string, string>()
  for (const cat of categories || []) {
    categoryMap.set(cat.slug, cat.id)
  }

  // Filter tool list
  let toolsToImport = entries || TOOL_LIST
  toolsToImport = toolsToImport.filter(t => {
    const domain = t.domain.split('/')[0]
    if (existingDomains.has(domain)) {
      result.skipped++
      return false
    }
    const slug = generateSlug(t.name)
    if (existingSlugs.has(slug)) {
      result.skipped++
      return false
    }
    return true
  })

  if (limit && limit > 0) {
    toolsToImport = toolsToImport.slice(0, limit)
  }

  // Process in batches
  for (let i = 0; i < toolsToImport.length; i += BATCH_SIZE) {
    const batch = toolsToImport.slice(i, i + BATCH_SIZE)

    try {
      const generated = await generateToolMetadata(batch)

      for (const tool of generated) {
        const validationError = validateTool(tool)
        if (validationError) {
          result.errors.push(`${tool.name || 'unknown'}: ${validationError}`)
          continue
        }

        const slug = generateSlug(tool.name)
        if (existingSlugs.has(slug)) {
          result.skipped++
          continue
        }

        const domain = tool.domain.split('/')[0]
        const logoUrl = `https://logo.clearbit.com/${domain}`

        const { data: inserted, error: insertError } = await (supabase
          .from('tools') as any)
          .insert({
            name: tool.name,
            slug,
            tagline: tool.tagline,
            description: tool.description,
            website_url: `https://${tool.domain}`,
            logo_url: logoUrl,
            pricing_model: tool.pricing_model,
            features: tool.features,
            status: 'pending',
          })
          .select('id')
          .single()

        if (insertError) {
          result.errors.push(`${tool.name}: insert failed - ${insertError.message}`)
          continue
        }

        // Link categories
        const categoryLinks = tool.categories
          .filter(slug => categoryMap.has(slug))
          .map((catSlug, index) => ({
            tool_id: inserted.id,
            category_id: categoryMap.get(catSlug)!,
            is_primary: index === 0,
          }))

        if (categoryLinks.length > 0) {
          await (supabase.from('tool_categories') as any).insert(categoryLinks)
        }

        existingSlugs.add(slug)
        result.inserted++
      }
    } catch (err) {
      result.errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed: ${err}`)
    }

    // Delay between batches (skip after last batch)
    if (i + BATCH_SIZE < toolsToImport.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS))
    }
  }

  result.success = result.errors.length === 0
  result.duration = Date.now() - startTime
  return result
}
