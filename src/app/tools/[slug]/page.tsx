import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, Check, ArrowLeft, Share2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToolCard, VoteButton } from '@/components/tools'
import { DealCard } from '@/components/deals'
import { DealAlertButton } from '@/components/alerts'
import { createClient } from '@/lib/supabase/server'
import { getUserVote } from '@/lib/actions/votes'
import { getUserAlertForTool } from '@/lib/actions/alerts'
import type { Tool, Deal } from '@/types'

const pricingLabels: Record<string, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  enterprise: 'Enterprise',
  open_source: 'Open Source',
}

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: tool } = await supabase
    .from('tools')
    .select('name, tagline, meta_title, meta_description')
    .eq('slug', slug)
    .single() as { data: Pick<Tool, 'name' | 'tagline' | 'meta_title' | 'meta_description'> | null }

  if (!tool) {
    return { title: 'Tool Not Found' }
  }

  return {
    title: tool.meta_title || `${tool.name} - AI Tool Review`,
    description: tool.meta_description || tool.tagline,
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch tool
  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single() as { data: Tool | null }

  if (!tool) {
    notFound()
  }

  // Fetch active deals for this tool
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('tool_id', tool.id)
    .eq('is_active', true)
    .order('discount_percent', { ascending: false })
    .limit(1) as { data: Deal[] | null }

  const activeDeal = deals?.[0] || null

  // Fetch related tools (same category or similar)
  const { data: relatedTools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'active')
    .neq('id', tool.id)
    .order('upvotes', { ascending: false })
    .limit(3) as { data: Tool[] | null }

  // Get user's vote and alert status
  const userVote = await getUserVote(tool.id)
  const existingAlertId = await getUserAlertForTool(tool.id)

  const pricing = tool.pricing_details as { starting_price?: number; currency?: string; free_tier?: boolean }

  return (
    <div className="min-h-screen">
      {/* Back Link */}
      <div className="border-b border-border/40">
        <div className="container px-4 md:px-6 py-4">
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                {/* Logo */}
                <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                  {tool.logo_url ? (
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-muted-foreground">
                      {tool.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold">{tool.name}</h1>
                    {tool.is_verified && (
                      <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mb-3">{tool.tagline}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {tool.upvotes} upvotes
                    </span>
                    <Badge variant="outline">
                      {tool.pricing_model && pricingLabels[tool.pricing_model]}
                    </Badge>
                  </div>
                </div>

                {/* Vote Button */}
                <VoteButton
                  toolId={tool.id}
                  initialVotes={tool.upvotes}
                  initialUserVote={userVote}
                />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <a
                    href={tool.affiliate_url || tool.website_url}
                    target="_blank"
                    rel="noopener sponsored"
                  >
                    Visit {tool.name}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <DealAlertButton
                  type="tool"
                  targetId={tool.id}
                  targetName={tool.name}
                  existingAlertId={existingAlertId}
                  size="lg"
                />
              </div>
            </div>

            {/* Active Deal Banner */}
            {activeDeal && (
              <Card className="border-accent/50 bg-accent/5">
                <CardContent className="p-4">
                  <DealCard deal={activeDeal} variant="compact" showTool={false} />
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {tool.description}
              </div>
            </div>

            {/* Features */}
            {tool.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tool.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-accent shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Use Cases */}
            {tool.use_cases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Best For</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.use_cases.map((useCase, i) => (
                      <Badge key={i} variant="secondary">{useCase}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Integrations */}
            {tool.integrations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.integrations.map((integration, i) => (
                      <Badge key={i} variant="outline">{integration}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricing.free_tier && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Free tier</span>
                      <Badge className="bg-accent text-accent-foreground">Available</Badge>
                    </div>
                  )}
                  {pricing.starting_price && (
                    <div>
                      <div className="text-3xl font-bold">
                        ${pricing.starting_price}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Starting price</p>
                    </div>
                  )}
                  <Separator />
                  <Button className="w-full" asChild>
                    <a
                      href={tool.affiliate_url || tool.website_url}
                      target="_blank"
                      rel="noopener sponsored"
                    >
                      Get Started
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <span>Official Website</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href={`/alternatives/${tool.slug}`}
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <span>{tool.name} Alternatives</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </CardContent>
            </Card>

            {/* Affiliate Disclosure */}
            <p className="text-xs text-muted-foreground">
              Affiliate Disclosure: We may earn a commission when you click links on this page. This helps support our work.
            </p>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools && relatedTools.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.id} tool={relatedTool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
