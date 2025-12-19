import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { DealSubmissionForm } from './DealSubmissionForm'
import type { Tool } from '@/types'

export const metadata: Metadata = {
  title: 'Submit a Deal - SIFT',
  description: 'Submit a new deal or discount for an AI tool',
}

export default async function SubmitDealPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/submit/deal')
  }

  // Fetch active tools for the dropdown
  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, slug')
    .eq('status', 'active')
    .order('name') as { data: Pick<Tool, 'id' | 'name' | 'slug'>[] | null }

  return (
    <div className="container max-w-2xl py-8 px-4">
      <Link
        href="/submit"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Submit
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Submit a Deal</CardTitle>
          <CardDescription>
            Share a discount or special offer. All submissions are reviewed before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DealSubmissionForm tools={tools || []} />
        </CardContent>
      </Card>
    </div>
  )
}
