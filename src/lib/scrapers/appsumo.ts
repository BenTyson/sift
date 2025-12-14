import * as cheerio from 'cheerio'
import type { CheerioAPI, Cheerio } from 'cheerio'
import type { AnyNode } from 'domhandler'
import type { ScrapedDeal, ScraperResult, Scraper } from './types'

const APPSUMO_AI_URL = 'https://appsumo.com/collections/ai-tools/'
const APPSUMO_BASE_URL = 'https://appsumo.com'

// AppSumo affiliate link format (replace with your actual partner ID)
const AFFILIATE_ID = process.env.APPSUMO_AFFILIATE_ID || ''

function buildAffiliateUrl(productUrl: string): string {
  if (!AFFILIATE_ID) return productUrl
  const url = new URL(productUrl)
  url.searchParams.set('partner', AFFILIATE_ID)
  return url.toString()
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    next: { revalidate: 3600 } // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return response.text()
}

function parsePrice(priceStr: string | undefined): number | undefined {
  if (!priceStr) return undefined
  const cleaned = priceStr.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? undefined : num
}

function parseProductCard($: CheerioAPI, element: AnyNode): ScrapedDeal | null {
  const $card = $(element)

  // Get product link and title
  const $link = $card.find('a[href*="/products/"]').first()
  const href = $link.attr('href')
  if (!href) return null

  const productUrl = href.startsWith('http') ? href : `${APPSUMO_BASE_URL}${href}`
  const sourceId = href.split('/products/')[1]?.replace(/\//g, '') || ''
  if (!sourceId) return null

  // Get title
  const title = $card.find('[class*="product-name"], [class*="title"], h3, h4').first().text().trim()
  if (!title) return null

  // Get description/tagline
  const description = $card.find('[class*="tagline"], [class*="description"], p').first().text().trim()

  // Get prices
  const priceText = $card.find('[class*="price"]').text()
  const originalPriceMatch = priceText.match(/\$[\d,]+(?:\.\d{2})?/g)

  let dealPrice: number | undefined
  let originalPrice: number | undefined

  if (originalPriceMatch && originalPriceMatch.length >= 1) {
    // First price is usually the deal price on AppSumo
    dealPrice = parsePrice(originalPriceMatch[0])
    if (originalPriceMatch.length >= 2) {
      originalPrice = parsePrice(originalPriceMatch[1])
    }
  }

  // Skip if no price found
  if (!dealPrice) return null

  // Calculate discount
  let discountPercent: number | undefined
  if (originalPrice && dealPrice && originalPrice > dealPrice) {
    discountPercent = Math.round(((originalPrice - dealPrice) / originalPrice) * 100)
  }

  // Get image
  const imageUrl = $card.find('img').first().attr('src') || $card.find('img').first().attr('data-src')

  return {
    source: 'appsumo',
    sourceId,
    sourceUrl: productUrl,
    dealType: 'ltd', // AppSumo is primarily LTDs
    title: `${title} - Lifetime Deal`,
    description: description || undefined,
    originalPrice,
    dealPrice,
    discountPercent,
    currency: 'USD',
    affiliateUrl: buildAffiliateUrl(productUrl),
    imageUrl,
    toolName: title, // Used for matching
  }
}

export async function scrapeAppSumo(): Promise<ScraperResult> {
  const deals: ScrapedDeal[] = []
  const errors: string[] = []

  try {
    const html = await fetchPage(APPSUMO_AI_URL)
    const $ = cheerio.load(html)

    // Find product cards - AppSumo uses various class patterns
    const productSelectors = [
      '[class*="product-card"]',
      '[class*="ProductCard"]',
      '[data-product-id]',
      '.grid-item',
      'article[class*="product"]'
    ]

    let $products: Cheerio<AnyNode> | null = null

    for (const selector of productSelectors) {
      const found = $(selector)
      if (found.length > 0) {
        $products = found
        break
      }
    }

    if (!$products || $products.length === 0) {
      // Try a more generic approach - look for links to products
      const productLinks = $('a[href*="/products/"]')
      const seenIds = new Set<string>()

      productLinks.each((_, link) => {
        const href = $(link).attr('href')
        const sourceId = href?.split('/products/')[1]?.replace(/\//g, '')

        if (sourceId && !seenIds.has(sourceId)) {
          seenIds.add(sourceId)

          // Get parent card-like container
          const $container = $(link).closest('[class*="card"], [class*="product"], article, .grid-item')

          if ($container.length > 0) {
            const deal = parseProductCard($, $container[0])
            if (deal) {
              deals.push(deal)
            }
          }
        }
      })
    } else {
      $products.each((_, element) => {
        try {
          const deal = parseProductCard($, element)
          if (deal) {
            deals.push(deal)
          }
        } catch (err) {
          errors.push(`Failed to parse product card: ${err}`)
        }
      })
    }

    if (deals.length === 0) {
      errors.push('No deals found - page structure may have changed')
    }

  } catch (error) {
    errors.push(`Failed to scrape AppSumo: ${error}`)
  }

  return {
    success: errors.length === 0,
    deals,
    errors,
    scrapedAt: new Date()
  }
}

export const appSumoScraper: Scraper = {
  name: 'AppSumo',
  scrape: scrapeAppSumo
}
