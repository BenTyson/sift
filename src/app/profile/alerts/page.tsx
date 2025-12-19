import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeleteAlertButton } from './DeleteAlertButton'

type AlertWithRelations = {
  id: string
  user_id: string
  tool_id: string | null
  category_id: string | null
  min_discount: number | null
  created_at: string
  tool: { name: string; slug: string } | null
  category: { name: string; slug: string } | null
}

export default async function AlertsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/profile/alerts')
  }

  const { data: alerts } = await supabase
    .from('deal_alerts')
    .select(`
      *,
      tool:tools(name, slug),
      category:categories(name, slug)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: AlertWithRelations[] | null }

  return (
    <div className="container max-w-2xl py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Deal Alerts</h1>
        <Button asChild variant="outline">
          <Link href="/tools">
            <Bell className="h-4 w-4 mr-2" />
            Browse Tools
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Alerts</CardTitle>
          <CardDescription>
            Get notified when new deals match your criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts && alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                  <div className="flex-1">
                    {alert.tool && (
                      <Link
                        href={`/tools/${alert.tool.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {alert.tool.name}
                      </Link>
                    )}
                    {alert.category && (
                      <Link
                        href={`/best/${alert.category.slug}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {alert.category.name} tools
                      </Link>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      {alert.min_discount && (
                        <span className="text-sm text-muted-foreground">
                          Min discount: {alert.min_discount}%
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <DeleteAlertButton alertId={alert.id} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No alerts set up yet</p>
              <p className="text-sm mt-2">
                Visit a tool or category page to set up deal alerts.
              </p>
              <Button asChild className="mt-4">
                <Link href="/tools">Browse Tools</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
