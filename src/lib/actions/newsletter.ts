'use server'

import { createClient } from '@/lib/supabase/server'

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
    .select('id, is_verified')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    if (existing.is_verified) {
      return { success: false, error: 'This email is already subscribed' }
    } else {
      // Resend verification (for now, just mark as verified since we don't have email verification flow)
      await (supabase
        .from('newsletter_subscribers') as any)
        .update({ is_verified: true })
        .eq('id', existing.id)
      return { success: true, message: 'Welcome back! Your subscription is now active.' }
    }
  }

  // Create new subscriber (mark as verified immediately for now)
  const { error } = await (supabase
    .from('newsletter_subscribers') as any)
    .insert({
      email: email.toLowerCase(),
      is_verified: true,
      digest_frequency: 'weekly',
    })

  if (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true, message: 'You\'re subscribed! Watch for weekly deal alerts.' }
}
