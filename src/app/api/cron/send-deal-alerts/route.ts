import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendDealAlertEmail } from '@/lib/email/send'

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
    // Get deals created in the last hour that haven't been notified
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data: newDeals, error: dealsError } = await supabase
      .from('deals')
      .select(`
        id,
        title,
        description,
        discount_percent,
        deal_price,
        original_price,
        affiliate_url,
        source_url,
        tool_id,
        tools (id, name, slug)
      `)
      .eq('is_active', true)
      .gte('created_at', oneHourAgo)

    if (dealsError) {
      console.error('Error fetching new deals:', dealsError)
      return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
    }

    if (!newDeals || newDeals.length === 0) {
      return NextResponse.json({ message: 'No new deals to notify', sent: 0 })
    }

    let totalSent = 0
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sift.tools'

    // Process tool-specific alerts
    for (const deal of newDeals) {
      if (!deal.tool_id) continue

      // Find users with alerts for this tool
      const { data: alerts } = await supabase
        .from('deal_alerts')
        .select(`
          id,
          user_id,
          min_discount,
          profiles (id)
        `)
        .eq('tool_id', deal.tool_id)

      if (!alerts || alerts.length === 0) continue

      // Check discount threshold and send emails
      for (const alert of alerts) {
        // Skip if deal doesn't meet minimum discount
        if (alert.min_discount && deal.discount_percent && deal.discount_percent < alert.min_discount) {
          continue
        }

        // Get user email
        const { data: userData } = await supabase.auth.admin.getUserById(alert.user_id)
        if (!userData?.user?.email) continue

        const tool = deal.tools as unknown as { id: string; name: string; slug: string } | null

        await sendDealAlertEmail({
          to: userData.user.email,
          userName: userData.user.user_metadata?.username,
          deals: [{
            id: deal.id,
            title: deal.title,
            toolName: tool?.name || 'Unknown Tool',
            discountPercent: deal.discount_percent || undefined,
            dealPrice: deal.deal_price || undefined,
            originalPrice: deal.original_price || undefined,
            dealUrl: deal.affiliate_url || deal.source_url || `${appUrl}/deals`,
          }],
          alertType: 'tool',
          alertTarget: tool?.name || 'this tool',
          alertId: alert.id,
        })

        totalSent++
      }
    }

    // Process category alerts
    // Get tool categories for the new deals
    const toolIds = newDeals.filter(d => d.tool_id).map(d => d.tool_id)

    if (toolIds.length > 0) {
      const { data: toolCategories } = await supabase
        .from('tool_categories')
        .select('tool_id, category_id, categories (id, name, slug)')
        .in('tool_id', toolIds)

      if (toolCategories) {
        const categoryIds = [...new Set(toolCategories.map(tc => tc.category_id))]

        for (const categoryId of categoryIds) {
          // Find users with alerts for this category
          const { data: categoryAlerts } = await supabase
            .from('deal_alerts')
            .select('id, user_id, min_discount')
            .eq('category_id', categoryId)

          if (!categoryAlerts || categoryAlerts.length === 0) continue

          // Get deals in this category
          const categoryToolIds = toolCategories
            .filter(tc => tc.category_id === categoryId)
            .map(tc => tc.tool_id)

          const categoryDeals = newDeals.filter(d => categoryToolIds.includes(d.tool_id))
          if (categoryDeals.length === 0) continue

          const category = toolCategories.find(tc => tc.category_id === categoryId)?.categories as unknown as { id: string; name: string; slug: string } | null

          for (const alert of categoryAlerts) {
            // Get user email
            const { data: userData } = await supabase.auth.admin.getUserById(alert.user_id)
            if (!userData?.user?.email) continue

            // Filter deals by minimum discount
            const eligibleDeals = categoryDeals.filter(d => {
              if (!alert.min_discount) return true
              return d.discount_percent && d.discount_percent >= alert.min_discount
            })

            if (eligibleDeals.length === 0) continue

            await sendDealAlertEmail({
              to: userData.user.email,
              userName: userData.user.user_metadata?.username,
              deals: eligibleDeals.map(deal => {
                const tool = deal.tools as unknown as { id: string; name: string; slug: string } | null
                return {
                  id: deal.id,
                  title: deal.title,
                  toolName: tool?.name || 'Unknown Tool',
                  discountPercent: deal.discount_percent || undefined,
                  dealPrice: deal.deal_price || undefined,
                  originalPrice: deal.original_price || undefined,
                  dealUrl: deal.affiliate_url || deal.source_url || `${appUrl}/deals`,
                }
              }),
              alertType: 'category',
              alertTarget: category?.name || 'this category',
              alertId: alert.id,
            })

            totalSent++
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Deal alerts sent',
      deals: newDeals.length,
      emailsSent: totalSent
    })
  } catch (error) {
    console.error('Error in send-deal-alerts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
