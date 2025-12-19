import { resend, FROM_EMAIL, isEmailConfigured } from './client'
import { DealAlertEmail } from './templates/DealAlert'
import { WeeklyDigestEmail } from './templates/WeeklyDigest'

interface SendDealAlertParams {
  to: string
  userName?: string
  deals: {
    id: string
    title: string
    toolName: string
    discountPercent?: number
    dealPrice?: number
    originalPrice?: number
    dealUrl: string
  }[]
  alertType: 'tool' | 'category'
  alertTarget: string
  alertId: string
}

interface SendWeeklyDigestParams {
  to: string
  userName?: string
  topDeals: {
    id: string
    title: string
    toolName: string
    discountPercent?: number
    dealUrl: string
  }[]
  newTools: {
    id: string
    name: string
    tagline: string
    slug: string
  }[]
  stats: {
    totalDeals: number
    totalSavings: number
  }
  subscriberId: string
}

export async function sendDealAlertEmail(params: SendDealAlertParams) {
  if (!isEmailConfigured() || !resend) {
    console.log('Email not configured, skipping deal alert email')
    return { success: false, error: 'Email not configured' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sift.tools'
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?type=alert&id=${params.alertId}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `New ${params.alertTarget} deal on SIFT`,
      react: DealAlertEmail({
        userName: params.userName,
        deals: params.deals,
        alertType: params.alertType,
        alertTarget: params.alertTarget,
        unsubscribeUrl,
      }),
    })

    if (error) {
      console.error('Error sending deal alert email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Exception sending deal alert email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendWeeklyDigestEmail(params: SendWeeklyDigestParams) {
  if (!isEmailConfigured() || !resend) {
    console.log('Email not configured, skipping weekly digest email')
    return { success: false, error: 'Email not configured' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sift.tools'
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?type=digest&id=${params.subscriberId}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `SIFT Weekly: ${params.stats.totalDeals} deals this week`,
      react: WeeklyDigestEmail({
        userName: params.userName,
        topDeals: params.topDeals,
        newTools: params.newTools,
        stats: params.stats,
        unsubscribeUrl,
      }),
    })

    if (error) {
      console.error('Error sending weekly digest email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Exception sending weekly digest email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
