'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Check, X, Loader2 } from 'lucide-react'
import {
  approveToolSubmission,
  rejectToolSubmission,
  approveDealSubmission,
  rejectDealSubmission,
} from '@/lib/actions/admin'

interface SubmissionActionsProps {
  type: 'tool' | 'deal'
  submissionId: string
}

export function SubmissionActions({ type, submissionId }: SubmissionActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectNotes, setRejectNotes] = useState('')
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null)

  const handleApprove = () => {
    startTransition(async () => {
      const res = type === 'tool'
        ? await approveToolSubmission(submissionId)
        : await approveDealSubmission(submissionId)

      setResult({
        success: res.success,
        message: res.success ? 'Approved!' : res.error,
      })
    })
  }

  const handleReject = () => {
    if (!rejectNotes.trim()) return

    startTransition(async () => {
      const res = type === 'tool'
        ? await rejectToolSubmission(submissionId, rejectNotes)
        : await rejectDealSubmission(submissionId, rejectNotes)

      setResult({
        success: res.success,
        message: res.success ? 'Rejected' : res.error,
      })
      setRejectOpen(false)
    })
  }

  if (result?.success) {
    return (
      <span className={`text-sm ${result.message === 'Approved!' ? 'text-primary' : 'text-muted-foreground'}`}>
        {result.message}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={isPending}
        className="bg-primary hover:bg-primary/90"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" />
            Approve
          </>
        )}
      </Button>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" disabled={isPending}>
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this {type} submission.
              The submitter will be able to see this feedback.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending || !rejectNotes.trim()}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Reject Submission'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
