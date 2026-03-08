# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          RAILWAY                                │
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
┌───────────────────┐  ┌───────────────────┐  ┌──────────────────┐
│     SUPABASE      │  │ MEILISEARCH CLOUD │  │      RESEND      │
│ PostgreSQL + Auth │  │ Tools + Deals idx │  │ DealAlert,Digest │
└───────────────────┘  └───────────────────┘  └──────────────────┘
                                               (not yet configured)
External: cron-job.org (scheduling), Plausible (analytics)
```

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | SSR for SEO, server components, API routes |
| Database | Supabase | PostgreSQL + Auth + RLS, generous free tier |
| Styling | Tailwind CSS 4 + shadcn/ui | Rapid dev, fully customizable, not a dependency |
| Search | Meilisearch Cloud | Fast, typo-tolerant (Supabase fallback exists) |
| Hosting | Railway | Docker-based, auto-deploy from GitHub |
| Email | Resend + React Email | Developer-friendly templates |
| Scraping | Cheerio | Lightweight HTML parsing |
| Analytics | Plausible | Privacy-friendly, ~1KB script |

## Key Patterns

### Server vs Client Components

| Pattern | Component Type |
|---------|----------------|
| Data fetching, SEO pages, static content | Server Component |
| Interactive UI (filters, search, forms, votes) | Client Component |

### Data Fetching

```typescript
// Server Component - direct Supabase query
const supabase = await createClient()
const { data } = await supabase.from('tools').select('*')
```

### ISR Strategy

| Page Type | Revalidate | Notes |
|-----------|------------|-------|
| Tool pages | 86400 (24h) | Stable content |
| Deal pages | 3600 (1h) | Time-sensitive |
| SEO pages | 86400 (24h) | Static with on-demand revalidation |
| Homepage | 3600 (1h) | Shows latest deals |

### Cron Jobs

| Endpoint | Purpose |
|----------|---------|
| `/api/cron/scrape-deals` | Run AppSumo scraper |
| `/api/cron/expire-deals` | Deactivate expired deals |
| `/api/cron/send-deal-alerts` | Email alerts for new deals |
| `/api/cron/send-weekly-digest` | Weekly newsletter |

All protected by `Authorization: Bearer CRON_SECRET`.

## Project Structure

```
src/
├── app/                          # Pages & routes
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout (Plausible, fonts)
│   ├── globals.css               # OKLch color system
│   ├── tools/                    # /tools, /tools/[slug]
│   ├── deals/                    # /deals
│   ├── vs/                       # /vs/[comparison]
│   ├── alternatives/             # /alternatives/[tool]
│   ├── best/                     # /best/[category]
│   ├── admin/                    # Admin dashboard
│   ├── profile/                  # User profile pages
│   ├── submit/                   # Tool/deal submission
│   ├── login/, signup/           # Auth pages
│   ├── about/, contact/,         # Legal/info
│   │   privacy/, terms/
│   ├── api/cron/                 # Cron endpoints
│   ├── auth/callback/            # OAuth callback
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Header, Footer
│   ├── tools/                    # ToolCard, ToolGrid, VoteButton
│   ├── deals/                    # DealCard, DealGrid
│   ├── alerts/                   # DealAlertButton
│   ├── auth/                     # UserMenu
│   ├── newsletter/               # NewsletterForm
│   └── search/                   # SearchBox
├── lib/
│   ├── supabase/                 # Server/client/middleware/actions
│   ├── actions/                  # Server actions (admin, alerts, newsletter, submissions, votes)
│   ├── scrapers/                 # AppSumo scraper, orchestrator, types
│   ├── email/                    # Resend client, send helper, templates
│   ├── meilisearch/              # Client, sync utility
│   └── utils.ts                  # cn() helper
└── types/
    ├── database.ts               # Supabase generated types
    └── index.ts                  # App-level type definitions
```

## Database

See [database.md](database.md) for full schema. Key tables: tools (31), deals (14), categories (15), profiles, votes, deal_alerts, click_events, newsletter_subscribers, tool_submissions, deal_submissions.
