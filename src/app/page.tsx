import Link from 'next/link'
import { ArrowRight, Search, Sparkles, Zap, TrendingUp, PenTool, Image as ImageIcon, Code, Megaphone, Video, Music, Palette, Share2, Globe, Settings, BarChart, Headphones, TrendingUp as Sales } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ToolGrid } from '@/components/tools'
import { DealGrid } from '@/components/deals'
import { createClient } from '@/lib/supabase/server'
import type { Tool, Deal, Category } from '@/types'

const categoryIcons: Record<string, React.ReactNode> = {
  'pen-tool': <PenTool className="h-5 w-5" />,
  'image': <ImageIcon className="h-5 w-5" />,
  'code': <Code className="h-5 w-5" />,
  'megaphone': <Megaphone className="h-5 w-5" />,
  'zap': <Zap className="h-5 w-5" />,
  'video': <Video className="h-5 w-5" />,
  'music': <Music className="h-5 w-5" />,
  'palette': <Palette className="h-5 w-5" />,
  'share-2': <Share2 className="h-5 w-5" />,
  'globe': <Globe className="h-5 w-5" />,
  'settings': <Settings className="h-5 w-5" />,
  'bar-chart': <BarChart className="h-5 w-5" />,
  'headphones': <Headphones className="h-5 w-5" />,
  'trending-up': <Sales className="h-5 w-5" />,
  'search': <Search className="h-5 w-5" />,
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
    .limit(6)

  // Fetch featured tools
  const { data: featuredTools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('upvotes', { ascending: false })
    .limit(6)

  // Fetch latest deals
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  // Get counts for stats
  const { count: toolCount } = await supabase
    .from('tools')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: dealCount } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-20" />

        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              {toolCount || 0}+ AI Tools & Daily Deals
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Sift through the noise.
              <span className="block text-primary">Find the best AI tools.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Discover, compare, and save on AI tools. We track deals from AppSumo, StackSocial, and more so you never miss a bargain.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${toolCount || 0}+ AI tools...`}
                  className="h-14 pl-12 pr-4 text-lg bg-card border-border/50 focus-visible:ring-2"
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <span>Popular:</span>
                <Link href="/tools?category=writing" className="hover:text-foreground transition-colors">Writing</Link>
                <span>·</span>
                <Link href="/tools?category=image-generation" className="hover:text-foreground transition-colors">Image Generation</Link>
                <span>·</span>
                <Link href="/tools?category=coding" className="hover:text-foreground transition-colors">Coding</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-card/50">
        <div className="container px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold">{toolCount || 0}+</div>
              <div className="text-sm text-muted-foreground">AI Tools</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">{dealCount || 0}+</div>
              <div className="text-sm text-muted-foreground">Active Deals</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">{categoryCount || 0}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">Daily</div>
              <div className="text-sm text-muted-foreground">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Tools</h2>
              <p className="text-muted-foreground">Handpicked AI tools trusted by thousands</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/tools">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <ToolGrid tools={featuredTools || []} variant="default" columns={3} />
        </div>
      </section>

      {/* Latest Deals */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold">Latest Deals</h2>
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              </div>
              <p className="text-muted-foreground">Don&apos;t miss these limited-time offers</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/deals">
                View all deals
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <DealGrid deals={deals || []} columns={2} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">Find the perfect tool for your needs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories || []).map((category: Category) => (
              <Link key={category.id} href={`/tools?category=${category.slug}`}>
                <Card className="group h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {category.icon && categoryIcons[category.icon]}
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/tools">
                View all categories
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Never miss a deal
            </h2>
            <p className="text-muted-foreground mb-8">
              Get weekly alerts for the best AI tool deals. Lifetime deals, discounts, and exclusive offers delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="you@example.com"
                className="flex-1 h-12 bg-card"
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
