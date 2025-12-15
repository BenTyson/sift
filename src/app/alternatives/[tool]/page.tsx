import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ExternalLink, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolCard } from '@/components/tools'
import { createClient } from '@/lib/supabase/server'
import type { Tool, Category } from '@/types'

interface AlternativesPageProps {
  params: Promise<{ tool: string }>
}

export async function generateMetadata({ params }: AlternativesPageProps): Promise<Metadata> {
  const { tool: toolSlug } = await params
  const supabase = await createClient()

  const { data: tool } = await supabase
    .from('tools')
    .select('name, tagline')
    .eq('slug', toolSlug)
    .single() as { data: { name: string; tagline: string } | null }

  if (!tool) {
    return { title: 'Tool Not Found' }
  }

  return {
    title: `Best ${tool.name} Alternatives in 2025 - Top Competitors Compared`,
    description: `Looking for ${tool.name} alternatives? Compare the best competitors with features, pricing, and user reviews. Find the perfect replacement.`,
    openGraph: {
      title: `${tool.name} Alternatives & Competitors`,
      description: `Discover the best alternatives to ${tool.name}. Compare features and pricing.`,
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
    ? `From $${details.starting_price}/mo`
    : 'Contact for pricing'
}

export default async function AlternativesPage({ params }: AlternativesPageProps) {
  const { tool: toolSlug } = await params
  const supabase = await createClient()

  // Get the main tool
  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', toolSlug)
    .single() as { data: Tool | null }

  if (!tool) {
    notFound()
  }

  // Get the tool's primary category
  const { data: toolCategory } = await supabase
    .from('tool_categories')
    .select('category_id')
    .eq('tool_id', tool.id)
    .eq('is_primary', true)
    .single() as { data: { category_id: string } | null }

  let categoryInfo: Category | null = null
  let alternatives: Tool[] = []

  if (toolCategory) {
    // Get category details
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('id', toolCategory.category_id)
      .single() as { data: Category | null }

    categoryInfo = category

    // Get other tools in the same category
    const { data: categoryTools } = await supabase
      .from('tool_categories')
      .select('tool_id')
      .eq('category_id', toolCategory.category_id)
      .neq('tool_id', tool.id) as { data: { tool_id: string }[] | null }

    if (categoryTools && categoryTools.length > 0) {
      const toolIds = categoryTools.map(tc => tc.tool_id)

      const { data: altTools } = await supabase
        .from('tools')
        .select('*')
        .in('id', toolIds)
        .eq('status', 'active')
        .order('upvotes', { ascending: false })
        .limit(10)

      alternatives = (altTools || []) as Tool[]
    }
  }

  // If no category alternatives, get tools with similar pricing model
  if (alternatives.length === 0 && tool.pricing_model) {
    const { data: similarTools } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'active')
      .eq('pricing_model', tool.pricing_model)
      .neq('id', tool.id)
      .order('upvotes', { ascending: false })
      .limit(10)

    alternatives = (similarTools || []) as Tool[]
  }

  // Rank alternatives
  const rankedAlternatives = alternatives.map((alt, index) => ({
    ...alt,
    rank: index + 1
  }))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <span>/</span>
            <Link href={`/tools/${tool.slug}`} className="hover:text-foreground">{tool.name}</Link>
            <span>/</span>
            <span>Alternatives</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best {tool.name} Alternatives in 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Looking for alternatives to {tool.name}? We&apos;ve compared the top {alternatives.length} competitors
            based on features, pricing, and user reviews to help you find the perfect fit.
          </p>

          {categoryInfo && (
            <div className="mt-4">
              <Badge variant="secondary">
                Category: {categoryInfo.name}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        {/* Original Tool Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              About {tool.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  {tool.description || tool.tagline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tool.features.slice(0, 4).map((feature) => (
                    <Badge key={feature} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
              <div className="md:w-48 space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Pricing</span>
                  <p className="font-semibold">{formatPrice(tool)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Upvotes</span>
                  <p className="font-semibold">{tool.upvotes}</p>
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link href={`/tools/${tool.slug}`}>
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Alternative Highlight */}
        {rankedAlternatives.length > 0 && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Alternative: {rankedAlternatives[0].name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-muted-foreground mb-4">
                    {rankedAlternatives[0].description || rankedAlternatives[0].tagline}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge>{formatPrice(rankedAlternatives[0])}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {rankedAlternatives[0].upvotes} upvotes
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:w-48">
                  <Button asChild>
                    <a
                      href={rankedAlternatives[0].affiliate_url || rankedAlternatives[0].website_url}
                      target="_blank"
                      rel="noopener sponsored"
                    >
                      Try {rankedAlternatives[0].name}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/vs/${tool.slug}-vs-${rankedAlternatives[0].slug}`}>
                      Compare with {tool.name}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Alternatives */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            All {tool.name} Alternatives ({rankedAlternatives.length})
          </h2>

          {rankedAlternatives.length > 0 ? (
            <div className="space-y-4">
              {rankedAlternatives.map((alt) => (
                <Card key={alt.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Rank */}
                      <div className="md:w-16 bg-secondary/30 flex items-center justify-center p-4 md:p-0">
                        <span className="text-2xl font-bold text-muted-foreground">#{alt.rank}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link href={`/tools/${alt.slug}`} className="text-lg font-semibold hover:text-primary">
                                {alt.name}
                              </Link>
                              <Badge variant="outline" className="text-xs">{alt.pricing_model}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {alt.tagline}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {alt.features.slice(0, 3).map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 md:w-48">
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(alt)}</p>
                              <p className="text-sm text-muted-foreground">{alt.upvotes} upvotes</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/vs/${tool.slug}-vs-${alt.slug}`}>
                                  Compare
                                </Link>
                              </Button>
                              <Button size="sm" asChild>
                                <a
                                  href={alt.affiliate_url || alt.website_url}
                                  target="_blank"
                                  rel="noopener sponsored"
                                >
                                  Visit
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No alternatives found for {tool.name} yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/tools">Browse All Tools</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Links */}
        <Card>
          <CardHeader>
            <CardTitle>Related</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href={`/tools/${tool.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  {tool.name} Review
                </Badge>
              </Link>
              {categoryInfo && (
                <Link href={`/best/${categoryInfo.slug}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                    Best {categoryInfo.name} Tools
                  </Badge>
                </Link>
              )}
              {rankedAlternatives.slice(0, 3).map((alt) => (
                <Link key={alt.id} href={`/vs/${tool.slug}-vs-${alt.slug}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                    {tool.name} vs {alt.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
