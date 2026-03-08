export interface ScrapedDeal {
  source: 'appsumo' | 'stacksocial' | 'pitchground' | 'direct'
  sourceId: string
  sourceUrl: string
  dealType: 'ltd' | 'discount' | 'coupon' | 'trial' | 'free'
  title: string
  description?: string
  originalPrice?: number
  dealPrice: number
  discountPercent?: number
  currency: string
  couponCode?: string
  affiliateUrl?: string
  imageUrl?: string
  expiresAt?: Date
  toolName?: string // For matching to existing tools
  toolUrl?: string // Tool's website URL (distinct from deal marketplace URL)
}

export interface ToolMatchResult {
  tool: { id: string; name: string; slug: string }
  confidence: number
  matchType: 'exact-slug' | 'exact-name' | 'alias' | 'domain' | 'levenshtein' | 'substring'
}

export interface ScraperResult {
  success: boolean
  deals: ScrapedDeal[]
  errors: string[]
  scrapedAt: Date
}

export interface Scraper {
  name: string
  scrape(): Promise<ScraperResult>
}
