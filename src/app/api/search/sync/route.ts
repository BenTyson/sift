import { NextRequest, NextResponse } from 'next/server'
import { fullSync } from '@/lib/meilisearch'

// POST /api/search/sync - Sync all data to Meilisearch
// Protected by CRON_SECRET or admin auth
export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await fullSync()

    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      result,
    })
  } catch (error) {
    console.error('Meilisearch sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
