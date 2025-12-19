import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ToolSubmission = {
  id: string
  name: string
  tagline: string
  website_url: string
  status: 'pending' | 'approved' | 'rejected'
  reviewer_notes: string | null
  created_at: string
  approved_tool_id: string | null
}

type DealSubmission = {
  id: string
  title: string
  deal_type: string
  deal_url: string
  status: 'pending' | 'approved' | 'rejected'
  reviewer_notes: string | null
  created_at: string
  approved_deal_id: string | null
  tool: { name: string; slug: string } | null
  tool_name: string | null
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return null
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending Review</Badge>
    case 'approved':
      return <Badge variant="outline" className="text-green-500 border-green-500">Approved</Badge>
    case 'rejected':
      return <Badge variant="outline" className="text-red-500 border-red-500">Rejected</Badge>
    default:
      return null
  }
}

export default async function SubmissionsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/profile/submissions')
  }

  // Fetch tool submissions
  const { data: toolSubmissions } = await (supabase
    .from('tool_submissions') as any)
    .select('*')
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false }) as { data: ToolSubmission[] | null }

  // Fetch deal submissions
  const { data: dealSubmissions } = await (supabase
    .from('deal_submissions') as any)
    .select(`
      *,
      tool:tools(name, slug)
    `)
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false }) as { data: DealSubmission[] | null }

  const tools = toolSubmissions || []
  const deals = dealSubmissions || []
  const totalSubmissions = tools.length + deals.length

  return (
    <div className="container max-w-3xl py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <Button asChild>
          <Link href="/submit">
            <Plus className="h-4 w-4 mr-2" />
            New Submission
          </Link>
        </Button>
      </div>

      {totalSubmissions === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No submissions yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help grow the directory by submitting tools and deals.
            </p>
            <Button asChild>
              <Link href="/submit">Submit Now</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="tools">
          <TabsList className="mb-6">
            <TabsTrigger value="tools">
              Tools ({tools.length})
            </TabsTrigger>
            <TabsTrigger value="deals">
              Deals ({deals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle>Tool Submissions</CardTitle>
                <CardDescription>
                  AI tools you&apos;ve submitted for review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tools.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tool submissions yet.{' '}
                    <Link href="/submit/tool" className="text-primary hover:underline">
                      Submit one
                    </Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {tools.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(submission.status)}
                            <span className="font-medium">{submission.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {submission.tagline}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>
                              Submitted {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                            <a
                              href={submission.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-foreground"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </a>
                          </div>
                          {submission.status === 'rejected' && submission.reviewer_notes && (
                            <p className="text-sm text-red-500 mt-2">
                              Note: {submission.reviewer_notes}
                            </p>
                          )}
                          {submission.status === 'approved' && submission.approved_tool_id && (
                            <Link
                              href={`/tools/${submission.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-green-500 hover:underline mt-2 inline-block"
                            >
                              View in directory
                            </Link>
                          )}
                        </div>
                        <div>
                          {getStatusBadge(submission.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <CardTitle>Deal Submissions</CardTitle>
                <CardDescription>
                  Deals and discounts you&apos;ve submitted for review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {deals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No deal submissions yet.{' '}
                    <Link href="/submit/deal" className="text-primary hover:underline">
                      Submit one
                    </Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {deals.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(submission.status)}
                            <span className="font-medium">{submission.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {submission.tool?.name || submission.tool_name || 'Unknown tool'} &middot;{' '}
                            <span className="capitalize">{submission.deal_type?.replace('_', ' ')}</span>
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>
                              Submitted {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                            <a
                              href={submission.deal_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-foreground"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Deal Link
                            </a>
                          </div>
                          {submission.status === 'rejected' && submission.reviewer_notes && (
                            <p className="text-sm text-red-500 mt-2">
                              Note: {submission.reviewer_notes}
                            </p>
                          )}
                        </div>
                        <div>
                          {getStatusBadge(submission.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
