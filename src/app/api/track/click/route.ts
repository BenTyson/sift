import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tool_id, deal_id, destination_url, page_url } = body

    if (!destination_url || typeof destination_url !== 'string') {
      return NextResponse.json(
        { error: 'destination_url is required' },
        { status: 400 }
      )
    }

    try {
      new URL(destination_url)
    } catch {
      return NextResponse.json(
        { error: 'destination_url must be a valid URL' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    const referrer = request.headers.get('referer') || null
    const session_id = crypto.randomUUID()

    await supabase.from('click_events').insert({
      tool_id: tool_id || null,
      deal_id: deal_id || null,
      destination_url,
      page_url: page_url || null,
      referrer,
      session_id,
    })

    if (tool_id) {
      await supabase.rpc('increment_click_count', { tool_uuid: tool_id })
    }

    return NextResponse.json({ success: true, redirect_url: destination_url })
  } catch {
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    )
  }
}
