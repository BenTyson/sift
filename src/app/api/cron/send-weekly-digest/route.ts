import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWeeklyDigestEmail } from '@/lib/email/send'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin()
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sift.tools'

    // Get top deals from the past week
    const { data: topDeals } = await supabase
      .from('deals')
      .select(`
        id,
        title,
        discount_percent,
        deal_price,
        original_price,
        affiliate_url,
        source_url,
        tools (id, name, slug)
      `)
      .eq('is_active', true)
      .gte('created_at', oneWeekAgo)
      .order('discount_percent', { ascending: false })
      .limit(5)

    // Get new tools from the past week
    const { data: newTools } = await supabase
      .from('tools')
      .select('id, name, tagline, slug')
      .eq('status', 'active')
      .gte('created_at', oneWeekAgo)
      .order('created_at', { ascending: false })
      .limit(5)

    // Calculate stats
    const { data: allDeals } = await supabase
      .from('deals')
      .select('deal_price, original_price')
      .eq('is_active', true)
      .gte('created_at', oneWeekAgo)

    const totalDeals = allDeals?.length || 0
    const totalSavings = (allDeals || []).reduce((sum, deal) => {
      if (deal.original_price && deal.deal_price) {
        return sum + (deal.original_price - deal.deal_price)
      }
      return sum
    }, 0)

    // Get subscribers who want weekly digest
    const { data: subscribers } = await supabase
      .from('newsletter_subscribers')
      .select('id, email')
      .eq('is_verified', true)
      .eq('digest_frequency', 'weekly')

    // Also get users with weekly digest preference
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, alert_preferences')

    const weeklyUsers = (profiles || []).filter(p => {
      const prefs = p.alert_preferences as { digest?: string } | null
      return prefs?.digest === 'weekly'
    })

    let totalSent = 0

    // Send to newsletter subscribers
    for (const subscriber of subscribers || []) {
      await sendWeeklyDigestEmail({
        to: subscriber.email,
        topDeals: (topDeals || []).map(deal => {
          const tool = deal.tools as unknown as { id: string; name: string; slug: string } | null
          return {
            id: deal.id,
            title: deal.title,
            toolName: tool?.name || 'Unknown Tool',
            discountPercent: deal.discount_percent || undefined,
            dealUrl: deal.affiliate_url || deal.source_url || `${appUrl}/deals`,
          }
        }),
        newTools: (newTools || []).map(tool => ({
          id: tool.id,
          name: tool.name,
          tagline: tool.tagline || '',
          slug: tool.slug,
        })),
        stats: {
          totalDeals,
          totalSavings: Math.round(totalSavings),
        },
        subscriberId: subscriber.id,
      })
      totalSent++
    }

    // Send to registered users with weekly digest enabled
    for (const profile of weeklyUsers) {
      const { data: userData } = await supabase.auth.admin.getUserById(profile.id)
      if (!userData?.user?.email) continue

      await sendWeeklyDigestEmail({
        to: userData.user.email,
        userName: userData.user.user_metadata?.username,
        topDeals: (topDeals || []).map(deal => {
          const tool = deal.tools as unknown as { id: string; name: string; slug: string } | null
          return {
            id: deal.id,
            title: deal.title,
            toolName: tool?.name || 'Unknown Tool',
            discountPercent: deal.discount_percent || undefined,
            dealUrl: deal.affiliate_url || deal.source_url || `${appUrl}/deals`,
          }
        }),
        newTools: (newTools || []).map(tool => ({
          id: tool.id,
          name: tool.name,
          tagline: tool.tagline || '',
          slug: tool.slug,
        })),
        stats: {
          totalDeals,
          totalSavings: Math.round(totalSavings),
        },
        subscriberId: profile.id,
      })
      totalSent++
    }

    return NextResponse.json({
      message: 'Weekly digest sent',
      stats: { totalDeals, totalSavings: Math.round(totalSavings) },
      emailsSent: totalSent,
    })
  } catch (error) {
    console.error('Error in send-weekly-digest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
