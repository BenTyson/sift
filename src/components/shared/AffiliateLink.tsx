'use client'

import { type AnchorHTMLAttributes } from 'react'

interface AffiliateLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  toolId?: string
  dealId?: string
}

function addUtmParams(url: string, type: 'tool' | 'deal'): string {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('utm_source', 'sift')
    parsed.searchParams.set('utm_medium', 'directory')
    parsed.searchParams.set('utm_campaign', type)
    return parsed.toString()
  } catch {
    return url
  }
}

export function AffiliateLink({
  href,
  toolId,
  dealId,
  onClick,
  children,
  ...props
}: AffiliateLinkProps) {
  const trackedHref = addUtmParams(href, dealId ? 'deal' : 'tool')

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    fetch('/api/track/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool_id: toolId,
        deal_id: dealId,
        destination_url: href,
        page_url: window.location.href,
      }),
      keepalive: true,
    })

    onClick?.(e)
  }

  return (
    <a
      href={trackedHref}
      target="_blank"
      rel="noopener sponsored"
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}
