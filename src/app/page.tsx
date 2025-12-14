import Link from 'next/link'
import { ArrowRight, Search, Sparkles, Zap, TrendingUp, PenTool, Image as ImageIcon, Code, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ToolGrid } from '@/components/tools'
import { DealGrid } from '@/components/deals'
import type { Tool, Deal, Category } from '@/types'

// Mock data for development - will be replaced with Supabase queries
const mockCategories: Category[] = [
  { id: '1', slug: 'writing', name: 'Writing', description: 'AI writing tools', icon: 'pen-tool', parent_id: null, display_order: 1, created_at: '' },
  { id: '2', slug: 'image-generation', name: 'Image Generation', description: 'AI image tools', icon: 'image', parent_id: null, display_order: 2, created_at: '' },
  { id: '3', slug: 'coding', name: 'Coding', description: 'AI coding tools', icon: 'code', parent_id: null, display_order: 3, created_at: '' },
  { id: '4', slug: 'marketing', name: 'Marketing', description: 'AI marketing tools', icon: 'megaphone', parent_id: null, display_order: 4, created_at: '' },
  { id: '5', slug: 'productivity', name: 'Productivity', description: 'AI productivity tools', icon: 'zap', parent_id: null, display_order: 5, created_at: '' },
  { id: '6', slug: 'video', name: 'Video', description: 'AI video tools', icon: 'video', parent_id: null, display_order: 6, created_at: '' },
]

const mockFeaturedTools: Tool[] = [
  {
    id: '1', slug: 'jasper', name: 'Jasper', tagline: 'AI writing assistant for marketing teams',
    description: 'Create high-quality content 10x faster with AI.', logo_url: null, screenshot_url: null,
    website_url: 'https://jasper.ai', affiliate_url: 'https://jasper.ai?ref=sift', affiliate_program: 'impact',
    pricing_model: 'paid', pricing_details: { starting_price: 49 }, features: ['Blog posts', 'Ads', 'Social media'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: true, is_verified: true,
    status: 'active', upvotes: 234, view_count: 5000, click_count: 800, created_at: '', updated_at: ''
  },
  {
    id: '2', slug: 'midjourney', name: 'Midjourney', tagline: 'Create stunning AI-generated images',
    description: 'Generate beautiful images from text prompts.', logo_url: null, screenshot_url: null,
    website_url: 'https://midjourney.com', affiliate_url: null, affiliate_program: null,
    pricing_model: 'paid', pricing_details: { starting_price: 10 }, features: ['Image generation', 'Art styles'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: true, is_verified: true,
    status: 'active', upvotes: 456, view_count: 8000, click_count: 1200, created_at: '', updated_at: ''
  },
  {
    id: '3', slug: 'github-copilot', name: 'GitHub Copilot', tagline: 'Your AI pair programmer',
    description: 'Code faster with AI-powered suggestions.', logo_url: null, screenshot_url: null,
    website_url: 'https://github.com/features/copilot', affiliate_url: null, affiliate_program: null,
    pricing_model: 'freemium', pricing_details: { starting_price: 10 }, features: ['Code completion', 'Chat'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: true, is_verified: true,
    status: 'active', upvotes: 567, view_count: 10000, click_count: 2000, created_at: '', updated_at: ''
  },
  {
    id: '4', slug: 'copy-ai', name: 'Copy.ai', tagline: 'AI-powered copywriting made simple',
    description: 'Generate marketing copy in seconds.', logo_url: null, screenshot_url: null,
    website_url: 'https://copy.ai', affiliate_url: 'https://copy.ai?ref=sift', affiliate_program: 'partnerstack',
    pricing_model: 'freemium', pricing_details: { starting_price: 49 }, features: ['Copy', 'Blog posts', 'Emails'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: true, is_verified: true,
    status: 'active', upvotes: 189, view_count: 4000, click_count: 600, created_at: '', updated_at: ''
  },
  {
    id: '5', slug: 'notion-ai', name: 'Notion AI', tagline: 'AI writing assistant built into Notion',
    description: 'Write, edit, and brainstorm in Notion.', logo_url: null, screenshot_url: null,
    website_url: 'https://notion.so', affiliate_url: null, affiliate_program: null,
    pricing_model: 'freemium', pricing_details: { starting_price: 10 }, features: ['Writing', 'Summarization'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: true, is_verified: true,
    status: 'active', upvotes: 321, view_count: 6000, click_count: 900, created_at: '', updated_at: ''
  },
  {
    id: '6', slug: 'descript', name: 'Descript', tagline: 'AI-powered video and podcast editing',
    description: 'Edit video like editing a doc.', logo_url: null, screenshot_url: null,
    website_url: 'https://descript.com', affiliate_url: 'https://descript.com?ref=sift', affiliate_program: 'impact',
    pricing_model: 'freemium', pricing_details: { starting_price: 12 }, features: ['Video editing', 'Transcription'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: true, is_verified: true,
    status: 'active', upvotes: 278, view_count: 5500, click_count: 700, created_at: '', updated_at: ''
  },
]

const mockDeals: Deal[] = [
  {
    id: '1', tool_id: null, source: 'appsumo', source_url: 'https://appsumo.com/products/pictory',
    source_id: 'pictory-ltd', deal_type: 'ltd', title: 'Pictory - AI Video Creation',
    description: 'Turn scripts into videos automatically with AI. Lifetime deal!',
    original_price: 948, deal_price: 59, discount_percent: 94, currency: 'USD', coupon_code: null,
    starts_at: null, expires_at: '2024-12-20T00:00:00Z', is_active: true, affiliate_url: 'https://appsumo.com/pictory?ref=sift',
    submitted_by: null, is_verified: true, upvotes: 45, created_at: '', updated_at: ''
  },
  {
    id: '2', tool_id: null, source: 'appsumo', source_url: 'https://appsumo.com/products/writesonic',
    source_id: 'writesonic-ltd', deal_type: 'ltd', title: 'Writesonic - AI Writing Suite',
    description: 'Complete AI writing platform. Blog posts, ads, landing pages.',
    original_price: 588, deal_price: 49, discount_percent: 92, currency: 'USD', coupon_code: null,
    starts_at: null, expires_at: null, is_active: true, affiliate_url: 'https://appsumo.com/writesonic?ref=sift',
    submitted_by: null, is_verified: true, upvotes: 67, created_at: '', updated_at: ''
  },
  {
    id: '3', tool_id: null, source: 'direct', source_url: null,
    source_id: 'jasper-black-friday', deal_type: 'discount', title: 'Jasper Black Friday - 50% Off',
    description: 'Get 50% off your first year of Jasper Pro or Business.',
    original_price: 588, deal_price: 294, discount_percent: 50, currency: 'USD', coupon_code: 'BFCM50',
    starts_at: null, expires_at: '2024-12-01T00:00:00Z', is_active: true, affiliate_url: 'https://jasper.ai?ref=sift',
    submitted_by: null, is_verified: true, upvotes: 89, created_at: '', updated_at: ''
  },
  {
    id: '4', tool_id: null, source: 'stacksocial', source_url: 'https://stacksocial.com/sales/ai-bundle',
    source_id: 'ai-bundle-2024', deal_type: 'ltd', title: 'AI Tools Bundle - 10 Apps',
    description: 'Get 10 AI tools for one price. Writing, images, productivity.',
    original_price: 1200, deal_price: 79, discount_percent: 93, currency: 'USD', coupon_code: null,
    starts_at: null, expires_at: null, is_active: true, affiliate_url: null,
    submitted_by: null, is_verified: false, upvotes: 23, created_at: '', updated_at: ''
  },
]

const categoryIcons: Record<string, React.ReactNode> = {
  'pen-tool': <PenTool className="h-5 w-5" />,
  'image': <ImageIcon className="h-5 w-5" />,
  'code': <Code className="h-5 w-5" />,
  'megaphone': <Megaphone className="h-5 w-5" />,
  'zap': <Zap className="h-5 w-5" />,
}

export default function HomePage() {
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
              500+ AI Tools & Daily Deals
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
                  placeholder="Search 500+ AI tools..."
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
              <div className="text-2xl md:text-3xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">AI Tools</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Active Deals</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">15</div>
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

          <ToolGrid tools={mockFeaturedTools} variant="default" columns={3} />
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

          <DealGrid deals={mockDeals} columns={2} />
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
            {mockCategories.map((category) => (
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
