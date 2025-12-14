import { Metadata } from 'next'
import Link from 'next/link'
import { Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ToolGrid } from '@/components/tools'
import type { Tool, Category } from '@/types'

export const metadata: Metadata = {
  title: 'AI Tools Directory',
  description: 'Browse 500+ AI tools across 15 categories. Find the perfect AI tool for writing, image generation, coding, productivity, and more.',
}

// Mock data - will be replaced with Supabase queries
const mockCategories: Category[] = [
  { id: '1', slug: 'writing', name: 'Writing', description: 'AI writing tools', icon: 'pen-tool', parent_id: null, display_order: 1, created_at: '' },
  { id: '2', slug: 'image-generation', name: 'Image Generation', description: 'AI image tools', icon: 'image', parent_id: null, display_order: 2, created_at: '' },
  { id: '3', slug: 'coding', name: 'Coding', description: 'AI coding tools', icon: 'code', parent_id: null, display_order: 3, created_at: '' },
  { id: '4', slug: 'marketing', name: 'Marketing', description: 'AI marketing tools', icon: 'megaphone', parent_id: null, display_order: 4, created_at: '' },
  { id: '5', slug: 'productivity', name: 'Productivity', description: 'AI productivity tools', icon: 'zap', parent_id: null, display_order: 5, created_at: '' },
  { id: '6', slug: 'video', name: 'Video', description: 'AI video tools', icon: 'video', parent_id: null, display_order: 6, created_at: '' },
  { id: '7', slug: 'audio', name: 'Audio', description: 'AI audio tools', icon: 'music', parent_id: null, display_order: 7, created_at: '' },
  { id: '8', slug: 'design', name: 'Design', description: 'AI design tools', icon: 'palette', parent_id: null, display_order: 8, created_at: '' },
]

const mockTools: Tool[] = [
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
  {
    id: '6', slug: 'descript', name: 'Descript', tagline: 'AI-powered video and podcast editing',
    description: 'Edit video like editing a doc.', logo_url: null, screenshot_url: null,
    website_url: 'https://descript.com', affiliate_url: 'https://descript.com?ref=sift', affiliate_program: 'impact',
    pricing_model: 'freemium', pricing_details: { starting_price: 12 }, features: ['Video editing', 'Transcription'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: false, is_verified: true,
    status: 'active', upvotes: 278, view_count: 5500, click_count: 700, created_at: '', updated_at: ''
  },
  {
    id: '7', slug: 'chatgpt', name: 'ChatGPT', tagline: 'Conversational AI by OpenAI',
    description: 'The most popular conversational AI assistant.', logo_url: null, screenshot_url: null,
    website_url: 'https://chat.openai.com', affiliate_url: null, affiliate_program: null,
    pricing_model: 'freemium', pricing_details: { starting_price: 20 }, features: ['Chat', 'Code', 'Analysis'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: false, is_verified: true,
    status: 'active', upvotes: 890, view_count: 50000, click_count: 10000, created_at: '', updated_at: ''
  },
  {
    id: '8', slug: 'claude', name: 'Claude', tagline: 'AI assistant by Anthropic',
    description: 'Helpful, harmless, and honest AI assistant.', logo_url: null, screenshot_url: null,
    website_url: 'https://claude.ai', affiliate_url: null, affiliate_program: null,
    pricing_model: 'freemium', pricing_details: { starting_price: 20 }, features: ['Chat', 'Analysis', 'Coding'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: false, is_verified: true,
    status: 'active', upvotes: 567, view_count: 30000, click_count: 5000, created_at: '', updated_at: ''
  },
  {
    id: '9', slug: 'stable-diffusion', name: 'Stable Diffusion', tagline: 'Open-source image generation',
    description: 'Generate images with open-source AI models.', logo_url: null, screenshot_url: null,
    website_url: 'https://stability.ai', affiliate_url: null, affiliate_program: null,
    pricing_model: 'open_source', pricing_details: {}, features: ['Image generation', 'Open source'],
    use_cases: [], integrations: [], meta_title: null, meta_description: null, is_featured: false, is_verified: true,
    status: 'active', upvotes: 445, view_count: 15000, click_count: 3000, created_at: '', updated_at: ''
  },
]

const pricingFilters = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'open_source', label: 'Open Source' },
]

interface ToolsPageProps {
  searchParams: Promise<{ category?: string; pricing?: string; search?: string }>
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams
  const selectedCategory = params.category
  const selectedPricing = params.pricing
  const searchQuery = params.search

  // Filter tools based on params (mock implementation)
  let filteredTools = mockTools
  if (selectedPricing) {
    filteredTools = filteredTools.filter(t => t.pricing_model === selectedPricing)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container px-4 md:px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">AI Tools Directory</h1>
          <p className="text-muted-foreground">
            Browse {mockTools.length}+ AI tools across {mockCategories.length} categories
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  type="search"
                  placeholder="Search tools..."
                  defaultValue={searchQuery}
                  className="bg-card/50"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-3 block">Categories</label>
                <div className="space-y-1">
                  <Link
                    href="/tools"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    All Categories
                  </Link>
                  {mockCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/tools?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <label className="text-sm font-medium mb-3 block">Pricing</label>
                <div className="flex flex-wrap gap-2">
                  {pricingFilters.map((filter) => (
                    <Link
                      key={filter.value}
                      href={
                        selectedPricing === filter.value
                          ? '/tools'
                          : `/tools?pricing=${filter.value}${selectedCategory ? `&category=${selectedCategory}` : ''}`
                      }
                    >
                      <Badge
                        variant={selectedPricing === filter.value ? 'default' : 'outline'}
                        className="cursor-pointer"
                      >
                        {filter.label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTools.length} tools
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Tools Grid */}
            <ToolGrid tools={filteredTools} columns={3} />

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Load more tools
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
