import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Tag, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Submit - SIFT',
  description: 'Submit a new AI tool or deal to SIFT',
}

export default async function SubmitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/submit')
  }

  return (
    <div className="container max-w-2xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit to SIFT</h1>
        <p className="text-muted-foreground">
          Help grow our directory by submitting AI tools and deals.
        </p>
      </div>

      <div className="grid gap-4">
        <Link href="/submit/tool">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    Submit a Tool
                    <ArrowRight className="h-4 w-4" />
                  </CardTitle>
                  <CardDescription>
                    Add a new AI tool to our directory
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Know an AI tool that should be listed? Submit it for review and help others discover great tools.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/submit/deal">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    Submit a Deal
                    <ArrowRight className="h-4 w-4" />
                  </CardTitle>
                  <CardDescription>
                    Share a discount or special offer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Found a great deal on an AI tool? Share it with the community and help others save money.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-secondary/30 border">
        <h3 className="font-medium mb-2">Submission Guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>- Only submit legitimate AI tools and verified deals</li>
          <li>- Provide accurate and complete information</li>
          <li>- Submissions are reviewed before publishing</li>
          <li>- Duplicate or spam submissions will be rejected</li>
        </ul>
      </div>
    </div>
  )
}
