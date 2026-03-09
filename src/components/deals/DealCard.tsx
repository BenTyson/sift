'use client'

import Link from 'next/link'
import { ExternalLink, Clock, Tag, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AffiliateLink } from '@/components/shared/AffiliateLink'
import { cn } from '@/lib/utils'
import type { Deal, Tool } from '@/types'

interface DealCardProps {
  deal: Deal
  tool?: Tool | null
  variant?: 'default' | 'compact'
  showTool?: boolean
  index?: number
}

const dealTypeStyles: Record<string, { label: string; className: string }> = {
  ltd: { label: 'Lifetime Deal', className: 'bg-highlight/15 text-highlight border-highlight/30' },
  discount: { label: 'Discount', className: 'bg-primary/15 text-primary border-primary/30' },
  coupon: { label: 'Coupon', className: 'bg-savings/15 text-savings border-savings/30' },
  trial: { label: 'Free Trial', className: 'bg-muted text-muted-foreground border-border' },
  free: { label: 'Free', className: 'bg-primary/15 text-primary border-primary/30' },
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

  if (days > 7) return null
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h left`
  return 'Ending soon'
}

function getDiscountBadgeStyle(percent: number) {
  if (percent >= 70) return 'bg-gradient-to-br from-urgency to-urgency/80 text-white w-18 h-18 text-2xl'
  if (percent >= 40) return 'bg-gradient-to-br from-savings to-savings/80 text-white w-16 h-16 text-xl'
  return 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-16 h-16 text-xl'
}

export function DealCard({
  deal,
  tool,
  variant = 'default',
  showTool = true,
  index = 0,
}: DealCardProps) {
  const dealType = deal.deal_type
    ? dealTypeStyles[deal.deal_type]
    : dealTypeStyles.discount

  const timeRemaining = getTimeRemaining(deal.expires_at)
  const isExpired = timeRemaining === 'Expired'
  const isUrgent = timeRemaining && !timeRemaining.includes('d') && !isExpired

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className={cn(
          "group overflow-hidden glass hover:glass-hover hover:-translate-y-0.5 transition-all duration-300",
          isExpired && "opacity-50"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {deal.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={cn("text-xs", dealType.className)}>
                    {dealType.label}
                  </Badge>
                  {deal.discount_percent && (
                    <span className="text-sm font-bold text-savings">
                      {deal.discount_percent}% OFF
                    </span>
                  )}
                </div>
              </div>
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
      <Card className={cn(
        "group overflow-hidden glass hover:glass-hover hover:-translate-y-1 hover:glow-primary transition-all duration-300",
        isExpired && "opacity-50"
      )}>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={cn("text-xs", dealType.className)}>
                  {dealType.label}
                </Badge>
                <span className="bg-surface-2 rounded-full px-2 py-0.5 text-xs text-muted-foreground">
                  {sourceLabels[deal.source] || deal.source}
                </span>
              </div>
              <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                {deal.title}
              </h3>
            </div>

            {/* Discount Badge - tiered gradient circle */}
            {deal.discount_percent && deal.discount_percent >= 20 && (
              <div className={cn(
                "shrink-0 flex flex-col items-center justify-center rounded-full",
                getDiscountBadgeStyle(deal.discount_percent)
              )}>
                <span className="font-bold leading-none">
                  {deal.discount_percent}%
                </span>
                <span className="text-[10px] uppercase tracking-wide">OFF</span>
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
              <div className="flex items-center gap-1 bg-surface-2/50 rounded px-2 py-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <code className="text-xs font-mono">{deal.coupon_code}</code>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4">
            {/* Time Remaining */}
            {timeRemaining && !isExpired && (
              <div className={cn(
                "flex items-center gap-1.5 text-sm",
                isUrgent ? "text-urgency font-medium" : "text-muted-foreground"
              )}>
                {isUrgent && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-urgency opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-urgency" />
                  </span>
                )}
                <Clock className="h-4 w-4" />
                <span>{timeRemaining}</span>
              </div>
            )}

            {/* Expired badge */}
            {isExpired && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4" />
                <span>Expired</span>
              </div>
            )}

            {/* CTA */}
            {!isExpired && (
              <Button
                asChild
                variant={isUrgent ? 'cta' : 'cta'}
                size="sm"
                className={cn(
                  "ml-auto",
                  isUrgent && "bg-gradient-to-r from-urgency to-urgency/80 shadow-urgency/20"
                )}
              >
                <AffiliateLink
                  href={deal.affiliate_url || deal.source_url || '#'}
                  dealId={deal.id}
                  toolId={deal.tool_id || undefined}
                >
                  Get Deal
                  <ExternalLink className="h-3 w-3 ml-1" />
                </AffiliateLink>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
