import { DealCard } from './DealCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { Deal, Tool } from '@/types'

interface DealGridProps {
  deals: Deal[]
  tools?: Record<string, Tool>
  variant?: 'default' | 'compact'
  loading?: boolean
  emptyMessage?: string
  columns?: 1 | 2 | 3
}

function DealCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4 mt-1" />
          </div>
          <Skeleton className="h-14 w-14 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function DealGrid({
  deals,
  tools = {},
  variant = 'default',
  loading = false,
  emptyMessage = 'No deals found',
  columns = 2
}: DealGridProps) {
  const gridCols = {
    1: '',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <DealCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          tool={deal.tool_id ? tools[deal.tool_id] : undefined}
          variant={variant}
        />
      ))}
    </div>
  )
}
