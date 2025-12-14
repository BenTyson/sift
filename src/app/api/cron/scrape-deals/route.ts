import { NextRequest, NextResponse } from 'next/server'
import { runScrapers } from '@/lib/scrapers'

// Protect cron endpoint with secret
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runScrapers()

    return NextResponse.json({
      success: result.success,
      summary: {
        totalDeals: result.totalDeals,
        inserted: result.upsertResult.inserted,
        updated: result.upsertResult.updated,
        duration: `${result.duration}ms`
      },
      scrapers: result.scraperResults,
      errors: result.upsertResult.errors
    })
  } catch (error) {
    console.error('Scrape deals cron failed:', error)
    return NextResponse.json(
      { error: 'Scrape failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
