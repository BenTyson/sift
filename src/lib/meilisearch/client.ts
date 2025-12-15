import { MeiliSearch } from 'meilisearch'

// Meilisearch client for search functionality
// Get your API keys from https://cloud.meilisearch.com

const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || ''
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_ADMIN_KEY || ''
const MEILISEARCH_SEARCH_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || ''

// Admin client (server-side only - for indexing)
export function getAdminClient() {
  if (!MEILISEARCH_HOST || !MEILISEARCH_API_KEY) {
    throw new Error('Meilisearch admin configuration missing. Set NEXT_PUBLIC_MEILISEARCH_HOST and MEILISEARCH_ADMIN_KEY.')
  }

  return new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY,
  })
}

// Search client (can be used client-side - read-only)
export function getSearchClient() {
  if (!MEILISEARCH_HOST || !MEILISEARCH_SEARCH_KEY) {
    throw new Error('Meilisearch search configuration missing. Set NEXT_PUBLIC_MEILISEARCH_HOST and NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY.')
  }

  return new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_SEARCH_KEY,
  })
}

// Index names
export const INDEXES = {
  TOOLS: 'tools',
  DEALS: 'deals',
} as const

// Tool document type for Meilisearch
export interface ToolDocument {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  features: string[]
  pricing_model: string | null
  category_names: string[]
  upvotes: number
  is_featured: boolean
}

// Deal document type for Meilisearch
export interface DealDocument {
  id: string
  tool_id: string
  tool_name: string
  tool_slug: string
  title: string
  deal_type: string | null
  source: string
  discount_percent: number | null
  deal_price: number | null
  original_price: number | null
  expires_at: string | null
}
