import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, X, Minus, ExternalLink, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import type { Tool } from '@/types'

interface ComparisonPageProps {
  params: Promise<{ comparison: string }>
}

function parseComparison(comparison: string): { tool1Slug: string; tool2Slug: string } | null {
  // Expected format: "tool1-vs-tool2" or "tool1-vs-tool2-comparison"
  const cleaned = comparison.replace(/-comparison$/, '')
  const parts = cleaned.split('-vs-')

  if (parts.length !== 2) return null

  return {
    tool1Slug: parts[0],
    tool2Slug: parts[1]
  }
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { comparison } = await params
  const parsed = parseComparison(comparison)

  if (!parsed) {
    return { title: 'Comparison Not Found' }
  }

  const supabase = await createClient()

  type ToolMeta = { name: string; tagline: string }
  const [result1, result2] = await Promise.all([
    supabase.from('tools').select('name, tagline').eq('slug', parsed.tool1Slug).single(),
    supabase.from('tools').select('name, tagline').eq('slug', parsed.tool2Slug).single()
  ])
  const tool1 = result1.data as ToolMeta | null
  const tool2 = result2.data as ToolMeta | null

  if (!tool1 || !tool2) {
    return { title: 'Comparison Not Found' }
  }

  return {
    title: `${tool1.name} vs ${tool2.name} - Which is Better? [2025 Comparison]`,
    description: `Compare ${tool1.name} and ${tool2.name} side by side. See pricing, features, pros & cons to decide which AI tool is right for you.`,
    openGraph: {
      title: `${tool1.name} vs ${tool2.name} Comparison`,
      description: `Detailed comparison of ${tool1.name} and ${tool2.name}. Find out which tool is better for your needs.`,
    }
  }
}

// Dynamic rendering - pages generated on-demand
export const dynamic = 'force-dynamic'

function formatPrice(tool: Tool): string {
  if (tool.pricing_model === 'free') return 'Free'
  if (tool.pricing_model === 'open_source') return 'Open Source'

  const details = tool.pricing_details as { starting_price?: number; currency?: string; free_tier?: boolean }

  if (details?.free_tier) {
    return details.starting_price
      ? `Free / $${details.starting_price}/mo`
      : 'Freemium'
  }

  return details?.starting_price
    ? `$${details.starting_price}/mo`
    : 'Contact for pricing'
}

function FeatureCheck({ has }: { has: boolean | null }) {
  if (has === null) return <Minus className="h-5 w-5 text-muted-foreground" />
  if (has) return <Check className="h-5 w-5 text-green-500" />
  return <X className="h-5 w-5 text-red-500" />
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { comparison } = await params
  const parsed = parseComparison(comparison)

  if (!parsed) {
    notFound()
  }

  const supabase = await createClient()

  const [{ data: tool1 }, { data: tool2 }] = await Promise.all([
    supabase.from('tools').select('*').eq('slug', parsed.tool1Slug).single(),
    supabase.from('tools').select('*').eq('slug', parsed.tool2Slug).single()
  ]) as [{ data: Tool | null }, { data: Tool | null }]

  if (!tool1 || !tool2) {
    notFound()
  }

  // Get all unique features from both tools
  const allFeatures = [...new Set([...tool1.features, ...tool2.features])]

  // Determine winner based on upvotes (simple heuristic)
  const winner = tool1.upvotes > tool2.upvotes ? tool1 : tool2
  const loser = winner === tool1 ? tool2 : tool1

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <span>/</span>
            <span>Compare</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {tool1.name} vs {tool2.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Detailed comparison of {tool1.name} and {tool2.name}.
            See how these AI tools stack up in terms of features, pricing, and user satisfaction.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        {/* Quick Verdict */}
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Quick Verdict
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Based on user ratings and features, <strong className="text-foreground">{winner.name}</strong> edges
              out {loser.name} with {winner.upvotes} upvotes vs {loser.upvotes}. However, the best choice depends
              on your specific needs - {tool1.name} excels at {tool1.features[0]?.toLowerCase() || 'various tasks'} while {tool2.name} is
              known for {tool2.features[0]?.toLowerCase() || 'its capabilities'}.
            </p>
          </CardContent>
        </Card>

        {/* Side by Side Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[tool1, tool2].map((tool) => (
            <Card key={tool.id} className={tool === winner ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    {tool === winner && (
                      <Badge className="mb-2 bg-primary">Our Pick</Badge>
                    )}
                    <CardTitle className="text-2xl">{tool.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{tool.tagline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing */}
                <div>
                  <h4 className="font-semibold mb-2">Pricing</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {formatPrice(tool)}
                    </Badge>
                    <Badge variant="secondary">{tool.pricing_model}</Badge>
                  </div>
                </div>

                {/* Upvotes */}
                <div>
                  <h4 className="font-semibold mb-2">User Rating</h4>
                  <p className="text-2xl font-bold">{tool.upvotes} upvotes</p>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="space-y-1">
                    {tool.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="pt-4 space-y-2">
                  <Button asChild className="w-full">
                    <a
                      href={tool.affiliate_url || tool.website_url}
                      target="_blank"
                      rel="noopener sponsored"
                    >
                      Try {tool.name}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/tools/${tool.slug}`}>
                      Full Review
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold">{tool1.name}</th>
                    <th className="text-center py-3 px-4 font-semibold">{tool2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature) => (
                    <tr key={feature} className="border-b border-border/50">
                      <td className="py-3 px-4">{feature}</td>
                      <td className="py-3 px-4 text-center">
                        <FeatureCheck has={tool1.features.includes(feature)} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <FeatureCheck has={tool2.features.includes(feature)} />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-semibold">Pricing</td>
                    <td className="py-3 px-4 text-center">{formatPrice(tool1)}</td>
                    <td className="py-3 px-4 text-center">{formatPrice(tool2)}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 font-semibold">Free Tier</td>
                    <td className="py-3 px-4 text-center">
                      <FeatureCheck has={tool1.pricing_model === 'free' || tool1.pricing_model === 'freemium'} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <FeatureCheck has={tool2.pricing_model === 'free' || tool2.pricing_model === 'freemium'} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Best For Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Choose {tool1.name} if you...</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Need {tool1.features[0]?.toLowerCase() || 'advanced features'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Want {tool1.pricing_model === 'free' ? 'a completely free solution' : tool1.pricing_model === 'freemium' ? 'to start free and upgrade later' : 'professional-grade features'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Prefer {tool1.features[1]?.toLowerCase() || 'a polished experience'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choose {tool2.name} if you...</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Need {tool2.features[0]?.toLowerCase() || 'advanced features'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Want {tool2.pricing_model === 'free' ? 'a completely free solution' : tool2.pricing_model === 'freemium' ? 'to start free and upgrade later' : 'professional-grade features'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Prefer {tool2.features[1]?.toLowerCase() || 'a polished experience'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Related Comparisons */}
        <Card>
          <CardHeader>
            <CardTitle>Related Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href={`/alternatives/${tool1.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  {tool1.name} Alternatives
                </Badge>
              </Link>
              <Link href={`/alternatives/${tool2.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  {tool2.name} Alternatives
                </Badge>
              </Link>
              <Link href={`/tools/${tool1.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  {tool1.name} Review
                </Badge>
              </Link>
              <Link href={`/tools/${tool2.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  {tool2.name} Review
                </Badge>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
