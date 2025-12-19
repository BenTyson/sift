'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createToolAlert(toolId: string, minDiscount?: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create alerts' }
  }

  // Check if alert already exists
  const { data: existing } = await supabase
    .from('deal_alerts')
    .select('id')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .single()

  if (existing) {
    return { error: 'You already have an alert for this tool' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('deal_alerts')
    .insert({
      user_id: user.id,
      tool_id: toolId,
      min_discount: minDiscount || null,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile/alerts')
  return { success: true }
}

export async function createCategoryAlert(categoryId: string, minDiscount?: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create alerts' }
  }

  // Check if alert already exists
  const { data: existing } = await supabase
    .from('deal_alerts')
    .select('id')
    .eq('user_id', user.id)
    .eq('category_id', categoryId)
    .single()

  if (existing) {
    return { error: 'You already have an alert for this category' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('deal_alerts')
    .insert({
      user_id: user.id,
      category_id: categoryId,
      min_discount: minDiscount || null,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile/alerts')
  return { success: true }
}

export async function deleteAlert(alertId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('deal_alerts')
    .delete()
    .eq('id', alertId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile/alerts')
  return { success: true }
}

export async function getUserAlertForTool(toolId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('deal_alerts')
    .select('id')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .single() as { data: { id: string } | null }

  return data?.id ?? null
}

export async function getUserAlertForCategory(categoryId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('deal_alerts')
    .select('id')
    .eq('user_id', user.id)
    .eq('category_id', categoryId)
    .single() as { data: { id: string } | null }

  return data?.id ?? null
}
