'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/supabase/hooks'
import { createToolAlert, createCategoryAlert, deleteAlert } from '@/lib/actions/alerts'

interface DealAlertButtonProps {
  type: 'tool' | 'category'
  targetId: string
  targetName: string
  existingAlertId?: string | null
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function DealAlertButton({
  type,
  targetId,
  targetName,
  existingAlertId = null,
  variant = 'outline',
  size = 'default',
  className,
}: DealAlertButtonProps) {
  const router = useRouter()
  const { user } = useUser()
  const [isPending, startTransition] = useTransition()
  const [alertId, setAlertId] = useState(existingAlertId)
  const [error, setError] = useState<string | null>(null)

  const hasAlert = !!alertId

  async function handleClick() {
    if (!user) {
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setError(null)

    startTransition(async () => {
      if (hasAlert) {
        // Remove alert
        const result = await deleteAlert(alertId!)
        if (result.error) {
          setError(result.error)
        } else {
          setAlertId(null)
        }
      } else {
        // Create alert
        const result = type === 'tool'
          ? await createToolAlert(targetId)
          : await createCategoryAlert(targetId)

        if (result.error) {
          setError(result.error)
        } else {
          // Fetch the new alert ID by refreshing
          router.refresh()
        }
      }
    })
  }

  return (
    <div className={className}>
      <Button
        variant={hasAlert ? 'default' : variant}
        size={size}
        onClick={handleClick}
        disabled={isPending}
        className="gap-2"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : hasAlert ? (
          <BellOff className="h-4 w-4" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {hasAlert ? 'Remove Alert' : `Alert me on ${targetName} deals`}
      </Button>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}
