'use client'

import Link from 'next/link'
import { ExternalLink, Clock, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Deal, Tool } from '@/types'

interface DealCardProps {
  deal: Deal
  tool?: Tool | null
  variant?: 'default' | 'compact'
  showTool?: boolean
}

const dealTypeLabels: Record<string, { label: string; className: string }> = {
  ltd: { label: 'Lifetime Deal', className: 'bg-accent text-accent-foreground' },
  discount: { label: 'Discount', className: 'bg-primary text-primary-foreground' },
  coupon: { label: 'Coupon', className: 'bg-secondary text-secondary-foreground' },
  trial: { label: 'Free Trial', className: 'bg-muted text-muted-foreground' },
  free: { label: 'Free', className: 'bg-accent/80 text-accent-foreground' },
}

const sourceLabels: Record<string, string> = {
  appsumo: 'AppSumo',
  stacksocial: 'StackSocial',
  pitchground: 'PitchGround',
  direct: 'Direct',
  user: 'Community',
}

function formatPrice(price: number | null, currency: string = 'USD') {
  if (price === null) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function getTimeRemaining(expiresAt: string | null) {
  if (!expiresAt) return null

  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 7) return null // Don't show if more than a week
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h left`
  return 'Ending soon'
}

export function DealCard({
  deal,
  tool,
  variant = 'default',
  showTool = true
}: DealCardProps) {
  const dealType = deal.deal_type
    ? dealTypeLabels[deal.deal_type]
    : dealTypeLabels.discount

  const timeRemaining = getTimeRemaining(deal.expires_at)
  const isUrgent = timeRemaining && !timeRemaining.includes('d')

  if (variant === 'compact') {
    return (
      <Card className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {deal.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", dealType.className)}>
                  {dealType.label}
                </Badge>
                {deal.discount_percent && (
                  <span className="text-sm font-bold text-accent">
                    {deal.discount_percent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              {deal.deal_price !== null && (
                <span className="font-bold text-lg">
                  {formatPrice(deal.deal_price, deal.currency)}
                </span>
              )}
              {deal.original_price !== null && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  {formatPrice(deal.original_price, deal.currency)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn("text-xs", dealType.className)}>
                {dealType.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {sourceLabels[deal.source] || deal.source}
              </span>
            </div>
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
              {deal.title}
            </h3>
          </div>

          {/* Discount Badge */}
          {deal.discount_percent && deal.discount_percent >= 20 && (
            <div className="shrink-0 flex flex-col items-center justify-center bg-accent text-accent-foreground rounded-lg px-3 py-2">
              <span className="text-xl font-bold leading-none">
                {deal.discount_percent}%
              </span>
              <span className="text-xs">OFF</span>
            </div>
          )}
        </div>

        {/* Description */}
        {deal.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {deal.description}
          </p>
        )}

        {/* Tool Link */}
        {showTool && tool && (
          <Link
            href={`/tools/${tool.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            {tool.logo_url && (
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="h-5 w-5 rounded object-cover"
              />
            )}
            <span>{tool.name}</span>
          </Link>
        )}

        {/* Pricing */}
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            {deal.original_price !== null && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                {formatPrice(deal.original_price, deal.currency)}
              </span>
            )}
            {deal.deal_price !== null && (
              <span className="text-2xl font-bold">
                {formatPrice(deal.deal_price, deal.currency)}
              </span>
            )}
          </div>

          {/* Coupon Code */}
          {deal.coupon_code && (
            <div className="flex items-center gap-1 bg-secondary/50 rounded px-2 py-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <code className="text-xs font-mono">{deal.coupon_code}</code>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4">
          {/* Time Remaining */}
          {timeRemaining && (
            <div className={cn(
              "flex items-center gap-1 text-sm",
              isUrgent ? "text-destructive" : "text-muted-foreground"
            )}>
              <Clock className="h-4 w-4" />
              <span>{timeRemaining}</span>
            </div>
          )}

          {/* CTA */}
          <Button
            asChild
            size="sm"
            className="ml-auto"
          >
            <a
              href={deal.affiliate_url || deal.source_url || '#'}
              target="_blank"
              rel="noopener sponsored"
            >
              Get Deal
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
