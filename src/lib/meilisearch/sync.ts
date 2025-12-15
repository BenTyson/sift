import { getAdminClient, INDEXES, ToolDocument, DealDocument } from './client'
import { createClient } from '@/lib/supabase/server'
import type { Tool, Deal, Category } from '@/types'

// Configure index settings for optimal search
export async function configureIndexes() {
  const client = getAdminClient()

  // Configure tools index
  const toolsIndex = client.index(INDEXES.TOOLS)
  await toolsIndex.updateSettings({
    searchableAttributes: [
      'name',
      'tagline',
      'description',
      'features',
      'category_names',
    ],
    filterableAttributes: [
      'pricing_model',
      'category_names',
      'is_featured',
    ],
    sortableAttributes: [
      'upvotes',
      'name',
    ],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'upvotes:desc',
    ],
  })

  // Configure deals index
  const dealsIndex = client.index(INDEXES.DEALS)
  await dealsIndex.updateSettings({
    searchableAttributes: [
      'title',
      'tool_name',
    ],
    filterableAttributes: [
      'deal_type',
      'source',
      'tool_id',
    ],
    sortableAttributes: [
      'discount_percent',
      'expires_at',
    ],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'discount_percent:desc',
    ],
  })

  console.log('Index settings configured')
}

// Sync all tools to Meilisearch
export async function syncTools() {
  const client = getAdminClient()
  const supabase = await createClient()

  // Get all active tools with their categories
  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'active') as { data: Tool[] | null; error: unknown }

  if (toolsError || !tools) {
    console.error('Error fetching tools:', toolsError)
    return { success: false, error: toolsError }
  }

  // Get tool categories
  const { data: toolCategories } = await supabase
    .from('tool_categories')
    .select('tool_id, category_id') as { data: { tool_id: string; category_id: string }[] | null }

  // Get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name') as { data: { id: string; name: string }[] | null }

  // Create a map of category_id -> name
  const categoryMap = new Map<string, string>()
  categories?.forEach(cat => categoryMap.set(cat.id, cat.name))

  // Create a map of tool_id -> category names
  const toolCategoryMap = new Map<string, string[]>()
  toolCategories?.forEach(tc => {
    const categoryName = categoryMap.get(tc.category_id)
    if (categoryName) {
      const existing = toolCategoryMap.get(tc.tool_id) || []
      existing.push(categoryName)
      toolCategoryMap.set(tc.tool_id, existing)
    }
  })

  // Transform tools to Meilisearch documents
  const documents: ToolDocument[] = tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    tagline: tool.tagline,
    description: tool.description,
    features: tool.features,
    pricing_model: tool.pricing_model,
    category_names: toolCategoryMap.get(tool.id) || [],
    upvotes: tool.upvotes,
    is_featured: tool.is_featured,
  }))

  // Index documents
  const toolsIndex = client.index(INDEXES.TOOLS)
  const task = await toolsIndex.addDocuments(documents, { primaryKey: 'id' })

  console.log(`Indexed ${documents.length} tools. Task ID: ${task.taskUid}`)
  return { success: true, count: documents.length, taskUid: task.taskUid }
}

// Sync all active deals to Meilisearch
export async function syncDeals() {
  const client = getAdminClient()
  const supabase = await createClient()

  // Get all active deals
  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('*')
    .eq('is_active', true) as { data: Deal[] | null; error: unknown }

  if (dealsError || !deals) {
    console.error('Error fetching deals:', dealsError)
    return { success: false, error: dealsError }
  }

  // Get tool info for deals
  const toolIds = [...new Set(deals.map(d => d.tool_id).filter(Boolean))]
  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, slug')
    .in('id', toolIds) as { data: { id: string; name: string; slug: string }[] | null }

  // Create tool map
  const toolMap = new Map<string, { name: string; slug: string }>()
  tools?.forEach(t => toolMap.set(t.id, { name: t.name, slug: t.slug }))

  // Transform deals to Meilisearch documents
  const documents: DealDocument[] = deals
    .filter(deal => deal.tool_id && toolMap.has(deal.tool_id))
    .map(deal => {
      const tool = toolMap.get(deal.tool_id!)!
      return {
        id: deal.id,
        tool_id: deal.tool_id!,
        tool_name: tool.name,
        tool_slug: tool.slug,
        title: deal.title,
        deal_type: deal.deal_type,
        source: deal.source,
        discount_percent: deal.discount_percent,
        deal_price: deal.deal_price,
        original_price: deal.original_price,
        expires_at: deal.expires_at,
      }
    })

  // Index documents
  const dealsIndex = client.index(INDEXES.DEALS)
  const task = await dealsIndex.addDocuments(documents, { primaryKey: 'id' })

  console.log(`Indexed ${documents.length} deals. Task ID: ${task.taskUid}`)
  return { success: true, count: documents.length, taskUid: task.taskUid }
}

// Full sync - configure indexes and sync all data
export async function fullSync() {
  console.log('Starting full Meilisearch sync...')

  await configureIndexes()
  const toolsResult = await syncTools()
  const dealsResult = await syncDeals()

  return {
    tools: toolsResult,
    deals: dealsResult,
  }
}
