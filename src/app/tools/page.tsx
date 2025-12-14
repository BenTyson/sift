import { Metadata } from 'next'
import Link from 'next/link'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ToolGrid } from '@/components/tools'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types'

export const metadata: Metadata = {
  title: 'AI Tools Directory',
  description: 'Browse AI tools across 15 categories. Find the perfect AI tool for writing, image generation, coding, productivity, and more.',
}

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

  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  // Build tools query
  let toolsQuery = supabase
    .from('tools')
    .select('*')
    .eq('status', 'active')
    .order('upvotes', { ascending: false })

  if (selectedPricing) {
    toolsQuery = toolsQuery.eq('pricing_model', selectedPricing)
  }

  // TODO: Filter by category via tool_categories join
  // For now, we'll filter all tools

  const { data: tools, count } = await toolsQuery

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container px-4 md:px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">AI Tools Directory</h1>
          <p className="text-muted-foreground">
            Browse {tools?.length || 0}+ AI tools across {categories?.length || 0} categories
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
                  {(categories || []).map((cat: Category) => (
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
                Showing {tools?.length || 0} tools
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
            <ToolGrid tools={tools || []} columns={3} />

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
