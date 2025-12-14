import { Metadata } from 'next'
import Link from 'next/link'
import { Tag, Percent, Clock, Gift } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DealGrid } from '@/components/deals'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'AI Tool Deals & Discounts',
  description: 'Find the best deals on AI tools. Lifetime deals, discounts, and coupons from AppSumo, StackSocial, and more.',
}

const dealTypeFilters = [
  { value: 'ltd', label: 'Lifetime Deals', icon: Gift },
  { value: 'discount', label: 'Discounts', icon: Percent },
  { value: 'coupon', label: 'Coupons', icon: Tag },
  { value: 'trial', label: 'Free Trials', icon: Clock },
]

const sourceFilters = [
  { value: 'appsumo', label: 'AppSumo' },
  { value: 'stacksocial', label: 'StackSocial' },
  { value: 'pitchground', label: 'PitchGround' },
  { value: 'direct', label: 'Direct' },
]

interface DealsPageProps {
  searchParams: Promise<{ type?: string; source?: string; category?: string }>
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams
  const selectedType = params.type
  const selectedSource = params.source
  const selectedCategory = params.category

  const supabase = await createClient()

  // Build deals query
  let dealsQuery = supabase
    .from('deals')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (selectedType) {
    dealsQuery = dealsQuery.eq('deal_type', selectedType)
  }

  if (selectedSource) {
    dealsQuery = dealsQuery.eq('source', selectedSource)
  }

  const { data: deals } = await dealsQuery

  // Get deal counts by type
  const { data: typeCounts } = await supabase
    .from('deals')
    .select('deal_type')
    .eq('is_active', true)

  const typeCountMap = (typeCounts || []).reduce((acc, deal: { deal_type: string }) => {
    acc[deal.deal_type] = (acc[deal.deal_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get deal counts by source
  const { data: sourceCounts } = await supabase
    .from('deals')
    .select('source')
    .eq('is_active', true)

  const sourceCountMap = (sourceCounts || []).reduce((acc, deal: { source: string }) => {
    acc[deal.source] = (acc[deal.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalDeals = deals?.length || 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">AI Tool Deals</h1>
            {totalDeals > 0 && (
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                {totalDeals} Active
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Lifetime deals, discounts, and coupons on the best AI tools. Updated daily.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Deal Types */}
              <div>
                <label className="text-sm font-medium mb-3 block">Deal Type</label>
                <div className="space-y-1">
                  <Link
                    href="/deals"
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedType
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <span>All Deals</span>
                    <span className="text-xs opacity-70">{totalDeals}</span>
                  </Link>
                  {dealTypeFilters.map((filter) => {
                    const Icon = filter.icon
                    const count = typeCountMap[filter.value] || 0
                    return (
                      <Link
                        key={filter.value}
                        href={`/deals?type=${filter.value}${selectedSource ? `&source=${selectedSource}` : ''}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === filter.value
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {filter.label}
                        </span>
                        <span className="text-xs opacity-70">{count}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Sources */}
              <div>
                <label className="text-sm font-medium mb-3 block">Source</label>
                <div className="flex flex-wrap gap-2">
                  {sourceFilters.map((filter) => {
                    const count = sourceCountMap[filter.value] || 0
                    const isSelected = selectedSource === filter.value
                    return (
                      <Link
                        key={filter.value}
                        href={
                          isSelected
                            ? `/deals${selectedType ? `?type=${selectedType}` : ''}`
                            : `/deals?source=${filter.value}${selectedType ? `&type=${selectedType}` : ''}`
                        }
                      >
                        <Badge
                          variant={isSelected ? 'default' : 'outline'}
                          className="cursor-pointer"
                        >
                          {filter.label} ({count})
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-lg border border-border/50 bg-card/50 p-4">
                <h3 className="font-medium text-sm mb-2">Deal Alerts</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Get notified when new deals match your interests.
                </p>
                <Link
                  href="/signup"
                  className="text-xs text-primary hover:underline"
                >
                  Sign up for alerts →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Active Filters */}
            {(selectedType || selectedSource) && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Filters:</span>
                {selectedType && (
                  <Link href={`/deals${selectedSource ? `?source=${selectedSource}` : ''}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20">
                      {dealTypeFilters.find(f => f.value === selectedType)?.label || selectedType}
                      <span className="ml-1">×</span>
                    </Badge>
                  </Link>
                )}
                {selectedSource && (
                  <Link href={`/deals${selectedType ? `?type=${selectedType}` : ''}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20">
                      {sourceFilters.find(f => f.value === selectedSource)?.label || selectedSource}
                      <span className="ml-1">×</span>
                    </Badge>
                  </Link>
                )}
                <Link
                  href="/deals"
                  className="text-xs text-muted-foreground hover:text-foreground ml-2"
                >
                  Clear all
                </Link>
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {deals?.length || 0} deals
              {selectedType && ` · ${dealTypeFilters.find(f => f.value === selectedType)?.label}`}
              {selectedSource && ` · ${sourceFilters.find(f => f.value === selectedSource)?.label}`}
            </p>

            {/* Deals Grid */}
            {deals && deals.length > 0 ? (
              <DealGrid deals={deals} columns={2} />
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="text-xl font-semibold mb-2">No deals found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedType || selectedSource
                    ? "Try adjusting your filters to find more deals."
                    : "Check back soon! We're always adding new deals."}
                </p>
                {(selectedType || selectedSource) && (
                  <Link
                    href="/deals"
                    className="text-primary hover:underline"
                  >
                    View all deals
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
