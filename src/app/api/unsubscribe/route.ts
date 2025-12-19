import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  if (!type || !id) {
    return NextResponse.redirect(new URL('/?error=invalid-unsubscribe', request.url))
  }

  try {
    if (type === 'alert') {
      // Delete the specific deal alert
      const { error } = await supabase
        .from('deal_alerts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting alert:', error)
        return NextResponse.redirect(new URL('/?error=unsubscribe-failed', request.url))
      }

      return NextResponse.redirect(new URL('/?unsubscribed=alert', request.url))
    }

    if (type === 'digest') {
      // Check if it's a newsletter subscriber or a user profile
      const { data: subscriber } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('id', id)
        .single()

      if (subscriber) {
        // Update newsletter subscriber to never receive digest
        await supabase
          .from('newsletter_subscribers')
          .update({ digest_frequency: 'never' })
          .eq('id', id)
      } else {
        // Update user profile preferences
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, alert_preferences')
          .eq('id', id)
          .single()

        if (profile) {
          const currentPrefs = (profile.alert_preferences || {}) as Record<string, unknown>
          await supabase
            .from('profiles')
            .update({
              alert_preferences: { ...currentPrefs, digest: 'never' }
            })
            .eq('id', id)
        }
      }

      return NextResponse.redirect(new URL('/?unsubscribed=digest', request.url))
    }

    return NextResponse.redirect(new URL('/?error=invalid-type', request.url))
  } catch (error) {
    console.error('Error in unsubscribe:', error)
    return NextResponse.redirect(new URL('/?error=unsubscribe-failed', request.url))
  }
}
