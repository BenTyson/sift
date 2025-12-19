'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type SubmissionResult = {
  success?: boolean
  id?: string
  error?: string
}

interface ToolSubmissionData {
  name: string
  tagline: string
  description: string
  website_url: string
  logo_url?: string
  pricing_model?: string
  features?: string[]
  category_ids?: string[]
}

interface DealSubmissionData {
  tool_id?: string
  tool_name?: string
  tool_url?: string
  deal_type: string
  title: string
  description?: string
  original_price?: number
  deal_price?: number
  discount_percent?: number
  coupon_code?: string
  deal_url: string
  expires_at?: string
}

export async function submitTool(data: ToolSubmissionData): Promise<SubmissionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to submit a tool' }
  }

  // Validate required fields
  if (!data.name || !data.tagline || !data.description || !data.website_url) {
    return { error: 'Please fill in all required fields' }
  }

  // Check for duplicate URL
  const { data: existing } = await supabase
    .from('tools')
    .select('id')
    .eq('website_url', data.website_url)
    .single()

  if (existing) {
    return { error: 'A tool with this website already exists' }
  }

  // Check for pending submission with same URL
  const { data: pendingSubmission } = await (supabase
    .from('tool_submissions') as any)
    .select('id')
    .eq('website_url', data.website_url)
    .eq('status', 'pending')
    .single() as { data: { id: string } | null }

  if (pendingSubmission) {
    return { error: 'A submission for this website is already pending review' }
  }

  const { data: submission, error } = await (supabase
    .from('tool_submissions') as any)
    .insert({
      submitted_by: user.id,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      website_url: data.website_url,
      logo_url: data.logo_url || null,
      pricing_model: data.pricing_model || null,
      features: data.features || [],
      category_ids: data.category_ids || [],
    })
    .select('id')
    .single() as { data: { id: string } | null; error: Error | null }

  if (error) {
    console.error('Error submitting tool:', error)
    return { error: 'Failed to submit tool. Please try again.' }
  }

  revalidatePath('/profile/submissions')

  return { success: true, id: submission?.id }
}

export async function submitDeal(data: DealSubmissionData): Promise<SubmissionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to submit a deal' }
  }

  // Validate required fields
  if (!data.title || !data.deal_url) {
    return { error: 'Please fill in all required fields' }
  }

  // Must have either tool_id or tool info
  if (!data.tool_id && !data.tool_name) {
    return { error: 'Please select a tool or provide tool information' }
  }

  const { data: submission, error } = await (supabase
    .from('deal_submissions') as any)
    .insert({
      submitted_by: user.id,
      tool_id: data.tool_id || null,
      tool_name: data.tool_name || null,
      tool_url: data.tool_url || null,
      deal_type: data.deal_type,
      title: data.title,
      description: data.description || null,
      original_price: data.original_price || null,
      deal_price: data.deal_price || null,
      discount_percent: data.discount_percent || null,
      coupon_code: data.coupon_code || null,
      deal_url: data.deal_url,
      expires_at: data.expires_at || null,
    })
    .select('id')
    .single() as { data: { id: string } | null; error: Error | null }

  if (error) {
    console.error('Error submitting deal:', error)
    return { error: 'Failed to submit deal. Please try again.' }
  }

  revalidatePath('/profile/submissions')

  return { success: true, id: submission?.id }
}

export async function getUserToolSubmissions() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data } = await (supabase
    .from('tool_submissions') as any)
    .select('*')
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getUserDealSubmissions() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data } = await (supabase
    .from('deal_submissions') as any)
    .select(`
      *,
      tool:tools(name, slug)
    `)
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })

  return data || []
}
