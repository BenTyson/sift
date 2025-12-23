'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from './server'

// Use runtime env var for server actions (not build-time inlined)
function getAppUrl() {
  return process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const redirectTo = formData.get('redirectTo') as string || '/'

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getAppUrl()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email for the magic link!' }
}

export async function signInWithPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string || '/'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getAppUrl()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email to confirm your account!' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email for the password reset link!' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle(redirectTo: string = '/') {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getAppUrl()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    return { url: data.url }
  }

  return { error: 'Failed to get OAuth URL' }
}
