import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ExternalLink, Trophy, Medal, Award, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import type { Tool, Category } from '@/types'

interface BestCategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: BestCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', categorySlug)
    .single() as { data: { name: string; description: string | null } | null }

  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `Best ${category.name} AI Tools in 2025 - Top ${category.name} Software`,
    description: `Discover the best ${category.name.toLowerCase()} AI tools in 2025. Compare top-rated software with features, pricing, and user reviews.`,
    openGraph: {
      title: `Best ${category.name} AI Tools`,
      description: `Top-rated ${category.name.toLowerCase()} tools compared. Find the perfect AI tool for your needs.`,
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

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }
}

export default async function BestCategoryPage({ params }: BestCategoryPageProps) {
  const { category: categorySlug } = await params
  const supabase = await createClient()

  // Get category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single() as { data: Category | null }

  if (!category) {
    notFound()
  }

  // Get tools in this category
  const { data: toolCategories } = await supabase
    .from('tool_categories')
    .select('tool_id')
    .eq('category_id', category.id) as { data: { tool_id: string }[] | null }

  let tools: Tool[] = []

  if (toolCategories && toolCategories.length > 0) {
    const toolIds = toolCategories.map(tc => tc.tool_id)

    const { data: categoryTools } = await supabase
      .from('tools')
      .select('*')
      .in('id', toolIds)
      .eq('status', 'active')
      .order('upvotes', { ascending: false })
      .limit(15)

    tools = (categoryTools || []) as Tool[]
  }

  // Add rank to each tool
  const rankedTools = tools.map((tool, index) => ({
    ...tool,
    rank: index + 1
  }))

  // Get other categories for related links
  const { data: otherCategories } = await supabase
    .from('categories')
    .select('slug, name')
    .neq('id', category.id)
    .order('display_order')
    .limit(6) as { data: { slug: string; name: string }[] | null }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <span>/</span>
            <span>Best {category.name}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best {category.name} AI Tools in 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category.description || `Discover the top ${category.name.toLowerCase()} AI tools. We've ranked ${rankedTools.length} tools based on features, user ratings, and value for money.`}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <Badge variant="secondary" className="text-sm">
              {rankedTools.length} Tools Ranked
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        {/* Quick Navigation */}
        {rankedTools.length > 5 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {rankedTools.slice(0, 10).map((tool) => (
                  <a
                    key={tool.id}
                    href={`#tool-${tool.rank}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    #{tool.rank} {tool.name}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 3 Showcase */}
        {rankedTools.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {rankedTools.slice(0, 3).map((tool) => (
              <Card
                key={tool.id}
                id={`tool-${tool.rank}`}
                className={tool.rank === 1 ? 'border-yellow-500/50 bg-yellow-500/5' : ''}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {getRankIcon(tool.rank)}
                    <Badge variant={tool.rank === 1 ? 'default' : 'outline'}>
                      {tool.pricing_model}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{tool.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tool.tagline}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{formatPrice(tool)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {tool.upvotes} upvotes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2 space-y-2">
                    <Button asChild className="w-full">
                      <a
                        href={tool.affiliate_url || tool.website_url}
                        target="_blank"
                        rel="noopener sponsored"
                      >
                        Try {tool.name}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/tools/${tool.slug}`}>
                        Full Review
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Full Rankings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Complete Rankings
          </h2>

          {rankedTools.length > 0 ? (
            <div className="space-y-4">
              {rankedTools.map((tool) => (
                <Card key={tool.id} id={`tool-${tool.rank}`} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Rank */}
                      <div className={`md:w-20 flex items-center justify-center p-4 md:p-0 ${
                        tool.rank === 1 ? 'bg-yellow-500/10' :
                        tool.rank === 2 ? 'bg-gray-500/10' :
                        tool.rank === 3 ? 'bg-amber-500/10' :
                        'bg-secondary/30'
                      }`}>
                        {getRankIcon(tool.rank)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link
                                href={`/tools/${tool.slug}`}
                                className="text-lg font-semibold hover:text-primary"
                              >
                                {tool.name}
                              </Link>
                              {tool.is_featured && (
                                <Badge variant="secondary" className="text-xs">Featured</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {tool.tagline}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {tool.features.slice(0, 4).map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {tool.description}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-3 md:w-56">
                            <div className="text-right">
                              <p className="text-lg font-semibold">{formatPrice(tool)}</p>
                              <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                {tool.upvotes} upvotes
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/alternatives/${tool.slug}`}>
                                  Alternatives
                                </Link>
                              </Button>
                              <Button size="sm" asChild>
                                <a
                                  href={tool.affiliate_url || tool.website_url}
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
                  No tools found in the {category.name} category yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/tools">Browse All Tools</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Other Categories */}
        {otherCategories && otherCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Explore Other Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {otherCategories.map((cat) => (
                  <Link key={cat.slug} href={`/best/${cat.slug}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                      Best {cat.name} Tools
                    </Badge>
                  </Link>
                ))}
                <Link href="/tools">
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                    View All Categories →
                  </Badge>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
