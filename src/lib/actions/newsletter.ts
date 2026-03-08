'use server'

import { createClient } from '@/lib/supabase/server'
import { sendVerificationEmail } from '@/lib/email/send'

interface SubscribeResult {
  success: boolean
  error?: string
  message?: string
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address' }
  }

  const supabase = await createClient()

  // Check if already subscribed
  // Note: newsletter_subscribers not in generated types, using any
  const { data: existing } = await (supabase
    .from('newsletter_subscribers') as any)
    .select('id, is_verified, verification_token')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    if (existing.is_verified) {
      return { success: false, error: 'This email is already subscribed' }
    } else {
      // Resend verification email with existing or new token
      const token = existing.verification_token || crypto.randomUUID()
      if (!existing.verification_token) {
        await (supabase
          .from('newsletter_subscribers') as any)
          .update({ verification_token: token })
          .eq('id', existing.id)
      }
      await sendVerificationEmail(email.toLowerCase(), token)
      return { success: true, message: 'Check your email to confirm your subscription.' }
    }
  }

  const verificationToken = crypto.randomUUID()

  const { error } = await (supabase
    .from('newsletter_subscribers') as any)
    .insert({
      email: email.toLowerCase(),
      is_verified: false,
      verification_token: verificationToken,
      digest_frequency: 'weekly',
    })

  if (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  await sendVerificationEmail(email.toLowerCase(), verificationToken)

  return { success: true, message: 'Check your email to confirm your subscription.' }
}
