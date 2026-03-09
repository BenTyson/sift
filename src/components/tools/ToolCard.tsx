'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
  index?: number
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
  index = 0,
}: ToolCardProps) {
  const pricingStyle = tool.pricing_model
    ? pricingLabels[tool.pricing_model]
    : pricingLabels.paid

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link href={`/tools/${tool.slug}`}>
          <Card className="group overflow-hidden glass hover:glass-hover hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden group-hover:ring-2 group-hover:ring-primary/30 transition-all">
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
      </motion.div>
    )
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.07 }}
      >
        <Link href={`/tools/${tool.slug}`}>
          <Card className="group relative overflow-hidden glass gradient-border glow-primary hover:glass-hover hover:-translate-y-1 transition-all duration-300">
            {/* Featured Badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-primary to-highlight text-white">Featured</Badge>
            </div>

            <CardContent className="p-6">
              <div className="h-16 w-16 rounded-xl bg-secondary flex items-center justify-center mb-4 overflow-hidden group-hover:ring-2 group-hover:ring-primary/30 transition-all">
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

              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {tool.tagline || tool.description?.slice(0, 100)}
              </p>

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
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      <Card className="group h-full overflow-hidden glass hover:glass-hover hover:-translate-y-1 hover:glow-primary transition-all duration-300">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <Link href={`/tools/${tool.slug}`} className="shrink-0">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary/30 transition-all">
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

            <VoteButton
              toolId={tool.id}
              initialVotes={tool.upvotes}
              initialUserVote={userVote}
              size="sm"
            />
          </div>

          <Link href={`/tools/${tool.slug}`}>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {tool.tagline || tool.description?.slice(0, 100) || 'No description available'}
            </p>
          </Link>

          <div className="flex items-center justify-between">
            {showCategory && categories.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {categories[0]?.name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
