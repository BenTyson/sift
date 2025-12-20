import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isCurrentUserAdmin, getAdminStats, getPendingSubmissions } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Tag,
  Users,
  Package,
  ArrowRight,
  Clock
} from 'lucide-react'
import { SubmissionActions } from './SubmissionActions'

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin()

  if (!isAdmin) {
    redirect('/')
  }

  const [stats, pending] = await Promise.all([
    getAdminStats(),
    getPendingSubmissions(),
  ])

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage submissions, review content, and monitor site activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingToolSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDealSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTools}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tool Submissions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pending Tool Submissions
            {pending.toolSubmissions.length > 0 && (
              <Badge variant="secondary">{pending.toolSubmissions.length}</Badge>
            )}
          </h2>
          <Link href="/admin/submissions?type=tools">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {pending.toolSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending tool submissions
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pending.toolSubmissions.slice(0, 5).map((submission: any) => (
              <Card key={submission.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{submission.name}</h3>
                        {submission.pricing_model && (
                          <Badge variant="outline" className="text-xs">
                            {submission.pricing_model}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {submission.tagline}
                      </p>
                      <a
                        href={submission.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {submission.website_url}
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <SubmissionActions
                      type="tool"
                      submissionId={submission.id}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pending Deal Submissions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Pending Deal Submissions
            {pending.dealSubmissions.length > 0 && (
              <Badge variant="secondary">{pending.dealSubmissions.length}</Badge>
            )}
          </h2>
          <Link href="/admin/submissions?type=deals">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {pending.dealSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending deal submissions
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pending.dealSubmissions.slice(0, 5).map((submission: any) => (
              <Card key={submission.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{submission.title}</h3>
                        {submission.deal_type && (
                          <Badge variant="outline" className="text-xs uppercase">
                            {submission.deal_type}
                          </Badge>
                        )}
                        {submission.discount_percent && (
                          <Badge className="text-xs">
                            {submission.discount_percent}% OFF
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {submission.tools?.name || submission.tool_name || 'Unknown tool'}
                      </p>
                      {submission.deal_price && (
                        <p className="text-sm">
                          <span className="text-primary font-medium">${submission.deal_price}</span>
                          {submission.original_price && (
                            <span className="text-muted-foreground line-through ml-2">
                              ${submission.original_price}
                            </span>
                          )}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <SubmissionActions
                      type="deal"
                      submissionId={submission.id}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
