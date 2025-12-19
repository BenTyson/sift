import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { VoteButton } from './VoteButton'
import type { Tool, Category } from '@/types'

interface ToolCardProps {
  tool: Tool
  categories?: Category[]
  variant?: 'default' | 'compact' | 'featured'
  showCategory?: boolean
  userVote?: number | null
}

const pricingLabels: Record<string, { label: string; className: string }> = {
  free: { label: 'Free', className: 'border-primary text-primary bg-transparent' },
  freemium: { label: 'Freemium', className: 'border-primary text-primary bg-transparent' },
  paid: { label: 'Paid', className: 'border-foreground/40 text-foreground/70 bg-transparent' },
  enterprise: { label: 'Enterprise', className: 'border-foreground/40 text-foreground/70 bg-transparent' },
  open_source: { label: 'Open Source', className: 'border-primary text-primary bg-transparent' },
}

export function ToolCard({
  tool,
  categories = [],
  variant = 'default',
  showCategory = true,
  userVote = null,
}: ToolCardProps) {
  const pricingStyle = tool.pricing_model
    ? pricingLabels[tool.pricing_model]
    : pricingLabels.paid

  if (variant === 'compact') {
    return (
      <Link href={`/tools/${tool.slug}`}>
        <Card className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200">
          <CardContent className="p-4 flex items-center gap-3">
            {/* Logo */}
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-muted-foreground">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <Badge variant="outline" className={cn("text-xs mt-1", pricingStyle.className)}>
                {pricingStyle.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/tools/${tool.slug}`}>
        <Card className="group relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Featured Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          </div>

          <CardContent className="p-6">
            {/* Logo */}
            <div className="h-16 w-16 rounded-xl bg-secondary flex items-center justify-center mb-4 overflow-hidden">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {tool.tagline || tool.description?.slice(0, 100)}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn(pricingStyle.className)}>
                {pricingStyle.label}
              </Badge>
              {tool.upvotes > 0 && (
                <span className="text-sm text-muted-foreground">
                  {tool.upvotes} upvotes
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Default variant
  return (
    <Card className="group h-full overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo */}
          <Link href={`/tools/${tool.slug}`} className="shrink-0">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>
          </Link>

          {/* Title & Pricing */}
          <div className="flex-1 min-w-0">
            <Link href={`/tools/${tool.slug}`}>
              <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors truncate">
                {tool.name}
              </h3>
            </Link>
            <Badge variant="outline" className={cn("text-xs", pricingStyle.className)}>
              {pricingStyle.label}
            </Badge>
          </div>

          {/* Vote Button */}
          <VoteButton
            toolId={tool.id}
            initialVotes={tool.upvotes}
            initialUserVote={userVote}
            size="sm"
          />
        </div>

        {/* Tagline */}
        <Link href={`/tools/${tool.slug}`}>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {tool.tagline || tool.description?.slice(0, 100) || 'No description available'}
          </p>
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {showCategory && categories.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {categories[0]?.name}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
