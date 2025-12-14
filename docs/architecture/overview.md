# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Next.js 14 App                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │    │
│  │  │  Pages   │  │   API    │  │  Crons   │  │  ISR    │ │    │
│  │  │ (SSR/SSG)│  │  Routes  │  │  Jobs    │  │ Regen   │ │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │    │
│  └───────┼─────────────┼─────────────┼─────────────┼──────┘    │
└──────────┼─────────────┼─────────────┼─────────────┼────────────┘
           │             │             │             │
           ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │          │
│  │   Database   │  │  (Magic Link)│  │   (Logos)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MEILISEARCH CLOUD                           │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ Tools Index  │  │ Deals Index  │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         RESEND                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Transactional│  │  Deal Alerts │  │Weekly Digest │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSR for SEO, server components, API routes |
| Database | Supabase | PostgreSQL + Auth + Realtime, generous free tier |
| Styling | Tailwind CSS + shadcn/ui | Rapid development, fully customizable |
| Search | Meilisearch Cloud | Fast, typo-tolerant, easy setup |
| Hosting | Railway | Docker-based, full Node.js support, cron jobs via railway.json |
| Email | Resend | Developer-friendly, React Email templates |
| Scraping | Cheerio + Puppeteer | Cheerio for speed, Puppeteer for JS-heavy sites |

## Key Patterns

### Server vs Client Components

| Use Case | Component Type |
|----------|----------------|
| Data fetching | Server Component |
| SEO pages | Server Component |
| Interactive UI (filters, search) | Client Component |
| Forms | Client Component |
| Static content | Server Component |

### Data Fetching

```typescript
// Server Component - direct Supabase query
export default async function ToolsPage() {
  const supabase = await createClient()
  const { data: tools } = await supabase.from('tools').select('*')
  return <ToolGrid tools={tools} />
}
```

### ISR Strategy

| Page Type | Revalidate | Notes |
|-----------|------------|-------|
| Tool pages | 86400 (24h) | Good SEO, fresh enough |
| Deal pages | 3600 (1h) | Time-sensitive |
| SEO pages | 86400 (24h) | Static with on-demand revalidation |
| Homepage | 3600 (1h) | Shows latest deals |

## Cron Jobs (Railway)

Railway crons are configured in `railway.json`. For more complex scheduling, use a separate worker service or external cron service (e.g., cron-job.org).

| Job | Schedule | Purpose |
|-----|----------|---------|
| `/api/cron/scrape-deals` | 0 6,18 * * * | Scrape deals 2x daily |
| `/api/cron/expire-deals` | 0 0 * * * | Mark expired deals |
| `/api/cron/send-digest` | 0 9 * * 1 | Weekly newsletter (Monday 9am) |

**Note**: Railway's built-in cron requires a Pro plan. Alternative: use Supabase Edge Functions with pg_cron, or an external scheduler hitting your API endpoints.

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Meilisearch
NEXT_PUBLIC_MEILISEARCH_HOST=
MEILISEARCH_ADMIN_KEY=
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
CRON_SECRET=
```

## File Structure

```
src/
├── app/
│   ├── (marketing)/          # Home, about pages
│   ├── tools/
│   │   ├── page.tsx          # /tools - directory
│   │   └── [slug]/
│   │       └── page.tsx      # /tools/[slug] - detail
│   ├── deals/
│   │   ├── page.tsx          # /deals - feed
│   │   └── [id]/
│   │       └── page.tsx      # /deals/[id] - detail
│   ├── vs/
│   │   └── [comparison]/
│   │       └── page.tsx      # /vs/tool1-vs-tool2
│   ├── alternatives/
│   │   └── [tool]/
│   │       └── page.tsx      # /alternatives/tool
│   ├── api/
│   │   ├── click/route.ts    # Affiliate click tracking
│   │   └── cron/
│   │       ├── scrape-deals/route.ts
│   │       ├── expire-deals/route.ts
│   │       └── send-digest/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── tools/
│   │   ├── ToolCard.tsx
│   │   ├── ToolGrid.tsx
│   │   └── ToolDetail.tsx
│   ├── deals/
│   │   ├── DealCard.tsx
│   │   ├── DealFeed.tsx
│   │   └── CountdownTimer.tsx
│   └── search/
│       ├── SearchBox.tsx
│       └── Filters.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts         # Server client
│   │   ├── client.ts         # Browser client
│   │   └── middleware.ts     # Auth middleware
│   ├── meilisearch/
│   │   └── client.ts
│   ├── scrapers/
│   │   ├── types.ts
│   │   ├── appsumo.ts
│   │   ├── stacksocial.ts
│   │   └── orchestrator.ts
│   ├── email/
│   │   └── resend.ts
│   └── utils.ts
└── types/
    ├── database.ts           # Supabase generated types
    └── index.ts
```
