import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { ToolSubmissionForm } from './ToolSubmissionForm'
import type { Category } from '@/types'

export const metadata: Metadata = {
  title: 'Submit a Tool - SIFT',
  description: 'Submit a new AI tool to the SIFT directory',
}

export default async function SubmitToolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/submit/tool')
  }

  // Fetch categories for the form
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name') as { data: Pick<Category, 'id' | 'name' | 'slug'>[] | null }

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
          <CardTitle>Submit a Tool</CardTitle>
          <CardDescription>
            Add a new AI tool to our directory. All submissions are reviewed before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToolSubmissionForm categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
