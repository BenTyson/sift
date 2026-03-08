import * as cheerio from 'cheerio'
import type { CheerioAPI, Cheerio } from 'cheerio'
import type { AnyNode } from 'domhandler'
import type { ScrapedDeal, ScraperResult, Scraper } from './types'

const PITCHGROUND_URL = 'https://pitchground.com/deals'
const PITCHGROUND_BASE_URL = 'https://pitchground.com'

const AFFILIATE_ID = process.env.PITCHGROUND_AFFILIATE_ID || ''

function buildAffiliateUrl(productUrl: string): string {
  if (!AFFILIATE_ID) return productUrl
  const url = new URL(productUrl)
  url.searchParams.set('ref', AFFILIATE_ID)
  return url.toString()
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    next: { revalidate: 3600 }
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

function parseDealCard($: CheerioAPI, element: AnyNode): ScrapedDeal | null {
  const $card = $(element)

  // Get deal link
  const $link = $card.find('a[href*="/deals/"]').first()
  const href = $link.attr('href')
  if (!href) return null

  const dealUrl = href.startsWith('http') ? href : `${PITCHGROUND_BASE_URL}${href}`
  const sourceId = href.split('/deals/')[1]?.replace(/\//g, '') || ''
  if (!sourceId) return null

  // Get title
  const title = $card.find('[class*="deal-title"], [class*="title"], h3, h4').first().text().trim()
  if (!title) return null

  // Get description
  const description = $card.find('[class*="tagline"], [class*="description"], p').first().text().trim()

  // Get prices
  const priceText = $card.find('[class*="price"]').text()
  const priceMatches = priceText.match(/\$[\d,]+(?:\.\d{2})?/g)

  let dealPrice: number | undefined
  let originalPrice: number | undefined

  if (priceMatches && priceMatches.length >= 1) {
    dealPrice = parsePrice(priceMatches[0])
    if (priceMatches.length >= 2) {
      originalPrice = parsePrice(priceMatches[1])
    }
  }

  if (!dealPrice) return null

  // Calculate discount
  let discountPercent: number | undefined
  if (originalPrice && dealPrice && originalPrice > dealPrice) {
    discountPercent = Math.round(((originalPrice - dealPrice) / originalPrice) * 100)
  }

  // Get image
  const imageUrl = $card.find('img').first().attr('src') || $card.find('img').first().attr('data-src')

  return {
    source: 'pitchground',
    sourceId,
    sourceUrl: dealUrl,
    dealType: 'ltd',
    title: `${title} - Lifetime Deal`,
    description: description || undefined,
    originalPrice,
    dealPrice,
    discountPercent,
    currency: 'USD',
    affiliateUrl: buildAffiliateUrl(dealUrl),
    imageUrl,
    toolName: title,
  }
}

export async function scrapePitchGround(): Promise<ScraperResult> {
  const deals: ScrapedDeal[] = []
  const errors: string[] = []

  try {
    const html = await fetchPage(PITCHGROUND_URL)
    const $ = cheerio.load(html)

    const dealSelectors = [
      '[class*="deal-card"]',
      '.deal-item',
      '[class*="product-card"]',
      'article',
    ]

    let $deals: Cheerio<AnyNode> | null = null

    for (const selector of dealSelectors) {
      const found = $(selector)
      if (found.length > 0) {
        $deals = found
        break
      }
    }

    if (!$deals || $deals.length === 0) {
      const dealLinks = $('a[href*="/deals/"]')
      const seenIds = new Set<string>()

      dealLinks.each((_, link) => {
        const href = $(link).attr('href')
        const sourceId = href?.split('/deals/')[1]?.replace(/\//g, '')

        if (sourceId && !seenIds.has(sourceId)) {
          seenIds.add(sourceId)

          const $container = $(link).closest('[class*="card"], [class*="deal"], [class*="product"], article, .grid-item')

          if ($container.length > 0) {
            const deal = parseDealCard($, $container[0])
            if (deal) {
              deals.push(deal)
            }
          }
        }
      })
    } else {
      $deals.each((_, element) => {
        try {
          const deal = parseDealCard($, element)
          if (deal) {
            deals.push(deal)
          }
        } catch (err) {
          errors.push(`Failed to parse deal card: ${err}`)
        }
      })
    }

    if (deals.length === 0) {
      errors.push('No deals found - page structure may have changed')
    }

  } catch (error) {
    errors.push(`Failed to scrape PitchGround: ${error}`)
  }

  return {
    success: errors.length === 0,
    deals,
    errors,
    scrapedAt: new Date()
  }
}

export const pitchGroundScraper: Scraper = {
  name: 'PitchGround',
  scrape: scrapePitchGround
}
