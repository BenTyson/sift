'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function vote(toolId: string, value: 1 | -1) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to vote' }
  }

  // Check for existing vote
  const { data: existingVote } = await supabase
    .from('votes')
    .select('value')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .single() as { data: { value: number } | null }

  if (existingVote) {
    if (existingVote.value === value) {
      // Same vote - remove it (toggle off)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('votes')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId)

      if (error) {
        return { error: error.message }
      }

      revalidatePath('/tools')
      revalidatePath(`/tools/[slug]`, 'page')
      return { success: true, action: 'removed' }
    } else {
      // Different vote - update it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('votes')
        .update({ value })
        .eq('user_id', user.id)
        .eq('tool_id', toolId)

      if (error) {
        return { error: error.message }
      }

      revalidatePath('/tools')
      revalidatePath(`/tools/[slug]`, 'page')
      return { success: true, action: 'updated' }
    }
  } else {
    // New vote
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('votes')
      .insert({ user_id: user.id, tool_id: toolId, value })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/tools')
    revalidatePath(`/tools/[slug]`, 'page')
    return { success: true, action: 'created' }
  }
}

export async function getUserVote(toolId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('votes')
    .select('value')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .single() as { data: { value: number } | null }

  return data?.value ?? null
}

export async function getUserVotes(toolIds: string[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || toolIds.length === 0) {
    return {}
  }

  const { data } = await supabase
    .from('votes')
    .select('tool_id, value')
    .eq('user_id', user.id)
    .in('tool_id', toolIds) as { data: { tool_id: string; value: number }[] | null }

  if (!data) return {}

  return data.reduce((acc, vote) => {
    acc[vote.tool_id] = vote.value
    return acc
  }, {} as Record<string, number>)
}
