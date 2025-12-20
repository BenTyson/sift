'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Check, AlertCircle } from 'lucide-react'
import { subscribeToNewsletter } from '@/lib/actions/newsletter'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    startTransition(async () => {
      const res = await subscribeToNewsletter(email)
      setResult({
        success: res.success,
        message: res.message || res.error || '',
      })
      if (res.success) {
        setEmail('')
      }
    })
  }

  if (result?.success) {
    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <Check className="h-4 w-4" />
        <span>{result.message}</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Get weekly deal alerts</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-[240px] bg-secondary/50 border-0"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !email}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Subscribe'
          )}
        </Button>
      </form>
      {result && !result.success && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {result.message}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  )
}
