# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         RAILWAY                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Next.js 16 App                        │    │
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
| Framework | Next.js 16 (App Router) | SSR for SEO, server components, API routes |
| Database | Supabase | PostgreSQL + Auth + Realtime, generous free tier |
| Styling | Tailwind CSS 4 + shadcn/ui | Rapid development, fully customizable |
| Search | Meilisearch Cloud | Fast, typo-tolerant, easy setup (not yet configured) |
| Hosting | Railway | Docker-based, full Node.js support |
| Email | Resend | Developer-friendly, React Email templates (not yet configured) |
| Scraping | Cheerio | Fast HTML parsing for deal scraping |

## Current Implementation Status

### Implemented
- [x] Next.js 16 with App Router
- [x] Supabase PostgreSQL database
- [x] Supabase client utilities (server, client, middleware)
- [x] Tailwind CSS 4 + shadcn/ui components
- [x] Dark theme with purple/green accent
- [x] Homepage, Tools directory, Tool detail pages
- [x] Deals page with filters
- [x] AppSumo scraper with Cheerio
- [x] Cron endpoints for deal scraping

### Not Yet Implemented
- [ ] Meilisearch search
- [ ] Supabase Auth
- [ ] Resend email
- [ ] SEO pages (/vs/, /alternatives/)
- [ ] Sitemap generation

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

## Cron Jobs

Cron endpoints are available at:

| Endpoint | Purpose | Protection |
|----------|---------|------------|
| `/api/cron/scrape-deals` | Run all deal scrapers | CRON_SECRET header |
| `/api/cron/expire-deals` | Mark expired deals inactive | CRON_SECRET header |

To trigger manually:
```bash
curl -X POST https://your-app.railway.app/api/cron/scrape-deals \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

For automated scheduling, use:
- Railway cron (Pro plan required)
- External service like cron-job.org
- Supabase Edge Functions with pg_cron

## Environment Variables

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional (for full functionality)
```env
SUPABASE_SERVICE_ROLE_KEY=     # Admin operations
CRON_SECRET=                    # Protect cron endpoints
APPSUMO_AFFILIATE_ID=           # AppSumo partner ID

# Future
NEXT_PUBLIC_MEILISEARCH_HOST=
MEILISEARCH_ADMIN_KEY=
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=
RESEND_API_KEY=
```

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── tools/
│   │   ├── page.tsx          # /tools - directory
│   │   └── [slug]/
│   │       └── page.tsx      # /tools/[slug] - detail
│   ├── deals/
│   │   └── page.tsx          # /deals - feed
│   ├── api/
│   │   └── cron/
│   │       ├── scrape-deals/route.ts
│   │       └── expire-deals/route.ts
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
│   │   └── index.ts
│   └── deals/
│       ├── DealCard.tsx
│       ├── DealGrid.tsx
│       └── index.ts
├── lib/
│   ├── supabase/
│   │   ├── server.ts         # Server client
│   │   ├── client.ts         # Browser client
│   │   └── middleware.ts     # Auth middleware
│   ├── scrapers/
│   │   ├── types.ts          # Scraper interfaces
│   │   ├── appsumo.ts        # AppSumo scraper
│   │   ├── orchestrator.ts   # Run & upsert deals
│   │   └── index.ts
│   └── utils.ts
└── types/
    ├── database.ts           # Supabase types
    └── index.ts
```

## Database Schema

See [database.md](./database.md) for full schema.

### Key Tables
- `tools` - 31 AI tools with pricing, features, affiliate links
- `deals` - 14 deals with expiration, discount info
- `categories` - 15 categories (Writing, Image Generation, Coding, etc.)
- `tool_categories` - Many-to-many relationship

### Current Data
| Table | Count |
|-------|-------|
| tools | 31 |
| deals | 14 |
| categories | 15 |
| tool_categories | 31 |
