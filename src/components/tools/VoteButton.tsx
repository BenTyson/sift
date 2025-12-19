'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { vote } from '@/lib/actions/votes'
import { useUser } from '@/lib/supabase/hooks'

interface VoteButtonProps {
  toolId: string
  initialVotes: number
  initialUserVote?: number | null
  size?: 'sm' | 'default'
  className?: string
}

export function VoteButton({
  toolId,
  initialVotes,
  initialUserVote = null,
  size = 'default',
  className,
}: VoteButtonProps) {
  const router = useRouter()
  const { user } = useUser()
  const [isPending, startTransition] = useTransition()
  const [optimisticVotes, setOptimisticVotes] = useState(initialVotes)
  const [optimisticUserVote, setOptimisticUserVote] = useState(initialUserVote)

  const hasUpvoted = optimisticUserVote === 1

  async function handleVote() {
    if (!user) {
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Optimistic update
    const previousVotes = optimisticVotes
    const previousUserVote = optimisticUserVote

    if (hasUpvoted) {
      // Removing upvote
      setOptimisticVotes(prev => prev - 1)
      setOptimisticUserVote(null)
    } else {
      // Adding upvote (or changing from downvote)
      const voteChange = optimisticUserVote === -1 ? 2 : 1
      setOptimisticVotes(prev => prev + voteChange)
      setOptimisticUserVote(1)
    }

    startTransition(async () => {
      const result = await vote(toolId, 1)

      if (result.error) {
        // Revert on error
        setOptimisticVotes(previousVotes)
        setOptimisticUserVote(previousUserVote)
      }
    })
  }

  return (
    <Button
      variant={hasUpvoted ? 'default' : 'outline'}
      size={size === 'sm' ? 'sm' : 'default'}
      onClick={handleVote}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1',
        hasUpvoted && 'bg-primary text-primary-foreground',
        className
      )}
    >
      <ChevronUp className={cn('h-4 w-4', size === 'sm' && 'h-3 w-3')} />
      <span className={cn('font-medium', size === 'sm' && 'text-xs')}>
        {optimisticVotes}
      </span>
    </Button>
  )
}
