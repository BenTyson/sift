import { ToolCard } from './ToolCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { Tool, Category } from '@/types'

interface ToolGridProps {
  tools: Tool[]
  categories?: Record<string, Category[]>
  userVotes?: Record<string, number>
  variant?: 'default' | 'compact' | 'featured'
  loading?: boolean
  emptyMessage?: string
  columns?: 2 | 3 | 4
}

function ToolCardSkeleton({ variant = 'default' }: { variant?: string }) {
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden border-border/50 bg-card/50">
        <CardContent className="p-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border/50 bg-card/50">
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ToolGrid({
  tools,
  categories = {},
  userVotes = {},
  variant = 'default',
  loading = false,
  emptyMessage = 'No tools found',
  columns = 3
}: ToolGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ToolCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          categories={categories[tool.id]}
          variant={variant}
          userVote={userVotes[tool.id] ?? null}
        />
      ))}
    </div>
  )
}
