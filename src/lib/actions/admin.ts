'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to check if current user is admin
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Note: is_admin column added in migration, may not be in types
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single() as { data: { is_admin: boolean } | null }

  return profile?.is_admin === true
}

// Get all pending submissions
export async function getPendingSubmissions() {
  const supabase = await createClient()

  const [toolSubmissions, dealSubmissions] = await Promise.all([
    (supabase.from('tool_submissions') as any)
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    (supabase.from('deal_submissions') as any)
      .select('*, tools(name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
  ])

  return {
    toolSubmissions: toolSubmissions.data || [],
    dealSubmissions: dealSubmissions.data || [],
  }
}

// Get all submissions with filters
export async function getSubmissions(status?: string) {
  const supabase = await createClient()

  let toolQuery = (supabase.from('tool_submissions') as any)
    .select('*')
    .order('created_at', { ascending: false })

  let dealQuery = (supabase.from('deal_submissions') as any)
    .select('*, tools(name)')
    .order('created_at', { ascending: false })

  if (status) {
    toolQuery = toolQuery.eq('status', status)
    dealQuery = dealQuery.eq('status', status)
  }

  const [toolSubmissions, dealSubmissions] = await Promise.all([
    toolQuery,
    dealQuery,
  ])

  return {
    toolSubmissions: toolSubmissions.data || [],
    dealSubmissions: dealSubmissions.data || [],
  }
}

// Approve a tool submission
export async function approveToolSubmission(submissionId: string, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Get the submission
  const { data: submission } = await (supabase.from('tool_submissions') as any)
    .select('*')
    .eq('id', submissionId)
    .single()

  if (!submission) {
    return { success: false, error: 'Submission not found' }
  }

  // Create the tool
  const slug = submission.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const { data: tool, error: toolError } = await (supabase
    .from('tools') as any)
    .insert({
      name: submission.name,
      slug,
      tagline: submission.tagline,
      description: submission.description,
      website_url: submission.website_url,
      logo_url: submission.logo_url,
      pricing_model: submission.pricing_model,
      features: submission.features,
      status: 'active',
    })
    .select('id')
    .single()

  if (toolError) {
    console.error('Error creating tool:', toolError)
    return { success: false, error: 'Failed to create tool' }
  }

  // Link to categories
  if (submission.category_ids && submission.category_ids.length > 0) {
    const categoryLinks = submission.category_ids.map((catId: string, index: number) => ({
      tool_id: tool.id,
      category_id: catId,
      is_primary: index === 0,
    }))

    await (supabase.from('tool_categories') as any).insert(categoryLinks)
  }

  // Update submission status
  await (supabase.from('tool_submissions') as any)
    .update({
      status: 'approved',
      reviewer_notes: notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      approved_tool_id: tool.id,
    })
    .eq('id', submissionId)

  revalidatePath('/admin')
  revalidatePath('/tools')

  return { success: true, toolId: tool.id }
}

// Reject a tool submission
export async function rejectToolSubmission(submissionId: string, notes: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  await (supabase.from('tool_submissions') as any)
    .update({
      status: 'rejected',
      reviewer_notes: notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq('id', submissionId)

  revalidatePath('/admin')

  return { success: true }
}

// Approve a deal submission
export async function approveDealSubmission(submissionId: string, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Get the submission
  const { data: submission } = await (supabase.from('deal_submissions') as any)
    .select('*')
    .eq('id', submissionId)
    .single()

  if (!submission) {
    return { success: false, error: 'Submission not found' }
  }

  // Create the deal
  const { data: deal, error: dealError } = await (supabase
    .from('deals') as any)
    .insert({
      tool_id: submission.tool_id,
      source: 'user',
      source_url: submission.deal_url,
      deal_type: submission.deal_type,
      title: submission.title,
      description: submission.description,
      original_price: submission.original_price,
      deal_price: submission.deal_price,
      discount_percent: submission.discount_percent,
      coupon_code: submission.coupon_code,
      expires_at: submission.expires_at,
      affiliate_url: submission.deal_url,
      submitted_by: submission.submitted_by,
      is_verified: true,
      is_active: true,
    })
    .select('id')
    .single()

  if (dealError) {
    console.error('Error creating deal:', dealError)
    return { success: false, error: 'Failed to create deal' }
  }

  // Update submission status
  await (supabase.from('deal_submissions') as any)
    .update({
      status: 'approved',
      reviewer_notes: notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      approved_deal_id: deal.id,
    })
    .eq('id', submissionId)

  revalidatePath('/admin')
  revalidatePath('/deals')

  return { success: true, dealId: deal.id }
}

// Reject a deal submission
export async function rejectDealSubmission(submissionId: string, notes: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  await (supabase.from('deal_submissions') as any)
    .update({
      status: 'rejected',
      reviewer_notes: notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq('id', submissionId)

  revalidatePath('/admin')

  return { success: true }
}

// Get admin stats
export async function getAdminStats() {
  const supabase = await createClient()

  const [
    pendingTools,
    pendingDeals,
    totalTools,
    totalDeals,
    subscribers,
  ] = await Promise.all([
    (supabase.from('tool_submissions') as any).select('id', { count: 'exact' }).eq('status', 'pending'),
    (supabase.from('deal_submissions') as any).select('id', { count: 'exact' }).eq('status', 'pending'),
    supabase.from('tools').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('deals').select('id', { count: 'exact' }).eq('is_active', true),
    (supabase.from('newsletter_subscribers') as any).select('id', { count: 'exact' }).eq('is_verified', true),
  ])

  return {
    pendingToolSubmissions: pendingTools.count || 0,
    pendingDealSubmissions: pendingDeals.count || 0,
    totalTools: totalTools.count || 0,
    totalDeals: totalDeals.count || 0,
    totalSubscribers: subscribers.count || 0,
  }
}
