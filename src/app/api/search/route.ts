import { NextRequest, NextResponse } from 'next/server'
import { MeiliSearch } from 'meilisearch'
import { INDEXES } from '@/lib/meilisearch'

// GET /api/search?q=query&type=tools|deals
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'tools'
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query) {
    return NextResponse.json({ hits: [], query: '', processingTimeMs: 0 })
  }

  const host = process.env.NEXT_PUBLIC_MEILISEARCH_HOST
  const searchKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY

  // Fallback to Supabase search if Meilisearch is not configured
  if (!host || !searchKey) {
    return fallbackSearch(query, type, limit)
  }

  try {
    const client = new MeiliSearch({
      host,
      apiKey: searchKey,
    })

    const index = client.index(type === 'deals' ? INDEXES.DEALS : INDEXES.TOOLS)
    const results = await index.search(query, {
      limit,
      attributesToHighlight: ['name', 'tagline'],
    })

    return NextResponse.json({
      hits: results.hits,
      query: results.query,
      processingTimeMs: results.processingTimeMs,
      estimatedTotalHits: results.estimatedTotalHits,
    })
  } catch (error) {
    console.error('Meilisearch search error:', error)
    // Fallback to Supabase search on error
    return fallbackSearch(query, type, limit)
  }
}

// Fallback search using Supabase full-text search
async function fallbackSearch(query: string, type: string, limit: number) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  if (type === 'deals') {
    const { data: deals } = await supabase
      .from('deals')
      .select('id, tool_id, title, deal_type, source, discount_percent')
      .eq('is_active', true)
      .ilike('title', `%${query}%`)
      .limit(limit)

    return NextResponse.json({
      hits: deals || [],
      query,
      processingTimeMs: 0,
      fallback: true,
    })
  }

  // Search tools
  type ToolResult = { id: string; name: string; slug: string; tagline: string; pricing_model: string }
  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, slug, tagline, pricing_model')
    .eq('status', 'active')
    .or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
    .order('upvotes', { ascending: false })
    .limit(limit) as { data: ToolResult[] | null }

  // Get categories for each tool
  const toolIds = (tools || []).map(t => t.id)
  const categoryMap = new Map<string, string[]>()

  if (toolIds.length > 0) {
    const { data: toolCategories } = await supabase
      .from('tool_categories')
      .select('tool_id, categories(name)')
      .in('tool_id', toolIds) as { data: { tool_id: string; categories: { name: string } }[] | null }

    toolCategories?.forEach(tc => {
      const existing = categoryMap.get(tc.tool_id) || []
      existing.push(tc.categories.name)
      categoryMap.set(tc.tool_id, existing)
    })
  }

  const hits = (tools || []).map(tool => ({
    ...tool,
    category_names: categoryMap.get(tool.id) || [],
  }))

  return NextResponse.json({
    hits,
    query,
    processingTimeMs: 0,
    fallback: true,
  })
}
