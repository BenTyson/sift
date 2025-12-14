import { NextRequest, NextResponse } from 'next/server'
import { expireDeals } from '@/lib/scrapers'

// Protect cron endpoint with secret
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await expireDeals()

    return NextResponse.json({
      success: !result.error,
      expired: result.expired,
      error: result.error
    })
  } catch (error) {
    console.error('Expire deals cron failed:', error)
    return NextResponse.json(
      { error: 'Expire failed', details: String(error) },
      { status: 500 }
    )
  }
}
