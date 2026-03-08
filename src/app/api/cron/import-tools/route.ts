import { NextRequest, NextResponse } from 'next/server'
import { importTools } from '@/lib/importers/ai-tool-importer'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await importTools()

    return NextResponse.json({
      success: result.success,
      summary: {
        inserted: result.inserted,
        skipped: result.skipped,
        duration: `${result.duration}ms`,
      },
      errors: result.errors,
    })
  } catch (error) {
    console.error('Import tools cron failed:', error)
    return NextResponse.json(
      { error: 'Import failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { tools, limit } = body || {}

    const result = await importTools(tools, limit)

    return NextResponse.json({
      success: result.success,
      summary: {
        inserted: result.inserted,
        skipped: result.skipped,
        duration: `${result.duration}ms`,
      },
      errors: result.errors,
    })
  } catch (error) {
    console.error('Import tools cron failed:', error)
    return NextResponse.json(
      { error: 'Import failed', details: String(error) },
      { status: 500 }
    )
  }
}
