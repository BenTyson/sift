import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, Check, ArrowLeft, Share2, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToolCard } from '@/components/tools'
import { DealCard } from '@/components/deals'
import type { Tool, Deal } from '@/types'

// Mock data - will be replaced with Supabase queries
const mockTools: Record<string, Tool> = {
  'jasper': {
    id: '1', slug: 'jasper', name: 'Jasper', tagline: 'AI writing assistant for marketing teams',
    description: `Jasper is the AI Content Platform that helps you and your team break through creative blocks to create amazing, original content 10X faster.

## Features

- **Blog Posts**: Generate long-form blog content with AI assistance
- **Ad Copy**: Create compelling ads for Facebook, Google, and more
- **Social Media**: Write engaging posts for all platforms
- **Email Marketing**: Craft persuasive email campaigns
- **Product Descriptions**: Generate SEO-optimized product copy

## Use Cases

Perfect for marketing teams, content creators, and businesses looking to scale their content production without sacrificing quality.`,
    logo_url: null, screenshot_url: null,
    website_url: 'https://jasper.ai', affiliate_url: 'https://jasper.ai?ref=sift', affiliate_program: 'impact',
    pricing_model: 'paid', pricing_details: { starting_price: 49, currency: 'USD', billing_period: 'monthly' },
    features: ['Blog posts', 'Ad copy', 'Social media', 'Email marketing', 'Product descriptions', 'SEO optimization'],
    use_cases: ['Marketing teams', 'Content creators', 'Agencies', 'E-commerce'],
    integrations: ['Surfer SEO', 'Grammarly', 'Chrome Extension'],
    meta_title: 'Jasper AI Review - Best AI Writing Assistant for Marketing',
    meta_description: 'Jasper AI helps marketing teams create high-quality content 10x faster. Read our review and get exclusive deals.',
    is_featured: true, is_verified: true, status: 'active',
    upvotes: 234, view_count: 5000, click_count: 800, created_at: '', updated_at: ''
  },
  'midjourney': {
    id: '2', slug: 'midjourney', name: 'Midjourney', tagline: 'Create stunning AI-generated images',
    description: `Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.

## What You Can Create

- Stunning artwork and illustrations
- Photorealistic images
- Abstract and surreal compositions
- Character designs
- Product mockups
- Architectural visualizations

## How It Works

Midjourney operates through Discord. Simply join their server, type your prompt with /imagine, and the AI generates four images based on your description.`,
    logo_url: null, screenshot_url: null,
    website_url: 'https://midjourney.com', affiliate_url: null, affiliate_program: null,
    pricing_model: 'paid', pricing_details: { starting_price: 10, currency: 'USD', billing_period: 'monthly' },
    features: ['Image generation', 'Art styles', 'Variations', 'Upscaling', 'Remix mode'],
    use_cases: ['Artists', 'Designers', 'Content creators', 'Game developers'],
    integrations: ['Discord'],
    meta_title: 'Midjourney Review - AI Image Generation Tool',
    meta_description: 'Generate stunning AI images with Midjourney. Learn about features, pricing, and alternatives.',
    is_featured: true, is_verified: true, status: 'active',
    upvotes: 456, view_count: 8000, click_count: 1200, created_at: '', updated_at: ''
  },
  'github-copilot': {
    id: '3', slug: 'github-copilot', name: 'GitHub Copilot', tagline: 'Your AI pair programmer',
    description: `GitHub Copilot is an AI pair programmer that helps you write code faster with less work.

## Key Features

- **Code Completion**: Get AI-powered code suggestions as you type
- **Chat Interface**: Ask questions about your code and get explanations
- **Multi-language Support**: Works with Python, JavaScript, TypeScript, Ruby, Go, and more
- **IDE Integration**: Available in VS Code, JetBrains IDEs, Neovim, and more

## How It Helps

GitHub Copilot can suggest whole functions, help with tests, explain complex code, and even generate documentation.`,
    logo_url: null, screenshot_url: null,
    website_url: 'https://github.com/features/copilot', affiliate_url: null, affiliate_program: null,
    pricing_model: 'freemium', pricing_details: { starting_price: 10, currency: 'USD', billing_period: 'monthly', free_tier: true },
    features: ['Code completion', 'Chat', 'Code explanation', 'Test generation', 'Documentation'],
    use_cases: ['Developers', 'Students', 'Open source contributors'],
    integrations: ['VS Code', 'JetBrains', 'Neovim', 'Visual Studio'],
    meta_title: 'GitHub Copilot Review - AI Pair Programmer',
    meta_description: 'GitHub Copilot helps you write code faster with AI suggestions. Free for students and open source.',
    is_featured: true, is_verified: true, status: 'active',
    upvotes: 567, view_count: 10000, click_count: 2000, created_at: '', updated_at: ''
  },
}

const mockRelatedTools: Tool[] = [
  {
    id: '4', slug: 'copy-ai', name: 'Copy.ai', tagline: 'AI-powered copywriting made simple',
    description: 'Generate marketing copy in seconds.', logo_url: null, screenshot_url: null,
    website_url: 'https://copy.ai', affiliate_url: 'https://copy.ai?ref=sift', affiliate_program: 'partnerstack',
    pricing_model: 'freemium', pricing_details: { starting_price: 49 }, features: ['Copy', 'Blog posts', 'Emails'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: false, is_verified: true,
    status: 'active', upvotes: 189, view_count: 4000, click_count: 600, created_at: '', updated_at: ''
  },
  {
    id: '5', slug: 'notion-ai', name: 'Notion AI', tagline: 'AI writing assistant built into Notion',
    description: 'Write, edit, and brainstorm in Notion.', logo_url: null, screenshot_url: null,
    website_url: 'https://notion.so', affiliate_url: null, affiliate_program: null,
    pricing_model: 'freemium', pricing_details: { starting_price: 10 }, features: ['Writing', 'Summarization'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: false, is_verified: true,
    status: 'active', upvotes: 321, view_count: 6000, click_count: 900, created_at: '', updated_at: ''
  },
]

const mockDeal: Deal = {
  id: '3', tool_id: '1', source: 'direct', source_url: null,
  source_id: 'jasper-black-friday', deal_type: 'discount', title: 'Jasper Black Friday - 50% Off',
  description: 'Get 50% off your first year of Jasper Pro or Business.',
  original_price: 588, deal_price: 294, discount_percent: 50, currency: 'USD', coupon_code: 'BFCM50',
  starts_at: null, expires_at: '2024-12-01T00:00:00Z', is_active: true, affiliate_url: 'https://jasper.ai?ref=sift',
  submitted_by: null, is_verified: true, upvotes: 89, created_at: '', updated_at: ''
}

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
  const tool = mockTools[slug]

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
  const tool = mockTools[slug]

  if (!tool) {
    notFound()
  }

  const hasActiveDeal = tool.slug === 'jasper'
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
              </div>
            </div>

            {/* Active Deal Banner */}
            {hasActiveDeal && (
              <Card className="border-accent/50 bg-accent/5">
                <CardContent className="p-4">
                  <DealCard deal={mockDeal} variant="compact" showTool={false} />
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
                <Link
                  href={`/pricing/${tool.slug}`}
                  className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                >
                  <span>{tool.name} Pricing</span>
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
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRelatedTools.map((relatedTool) => (
              <ToolCard key={relatedTool.id} tool={relatedTool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
