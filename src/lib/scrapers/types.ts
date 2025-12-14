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
