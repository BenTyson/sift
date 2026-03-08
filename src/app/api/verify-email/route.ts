import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?error=invalid-token', request.url))
  }

  const supabase = getSupabaseAdmin()

  const { data: subscriber, error: fetchError } = await supabase
    .from('newsletter_subscribers')
    .select('id, is_verified')
    .eq('verification_token', token)
    .single()

  if (fetchError || !subscriber) {
    return NextResponse.redirect(new URL('/?error=invalid-token', request.url))
  }

  if (subscriber.is_verified) {
    return NextResponse.redirect(new URL('/?verified=already', request.url))
  }

  const { error: updateError } = await supabase
    .from('newsletter_subscribers')
    .update({
      is_verified: true,
      verification_token: null,
    })
    .eq('id', subscriber.id)

  if (updateError) {
    return NextResponse.redirect(new URL('/?error=verification-failed', request.url))
  }

  return NextResponse.redirect(new URL('/?verified=success', request.url))
}
