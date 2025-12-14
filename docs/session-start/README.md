# SIFT - Session Start

> **Read this file first in every session**

## Project Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 2 - Deals Engine (Complete) |
| **Last Updated** | 2025-12-14 |
| **Next Task** | Build SEO pages (/vs/, /alternatives/) |
| **Blockers** | None - Site is live with real data |

## Quick Links

| Doc | Description |
|-----|-------------|
| [Architecture Overview](../architecture/overview.md) | Tech stack, system design |
| [Database Schema](../architecture/database.md) | Tables, relationships, RLS |
| [Components](../components/README.md) | Component hierarchy |
| [Deployment](../operations/deployment.md) | Railway deployment guide |
| [Changelog](../changelog.md) | Session-by-session progress |

## What is SIFT?

AI tools directory with deal aggregation, affiliate monetization, and programmatic SEO.

**Target**: $2-8K/month passive income with ~2-3 hrs/week maintenance

**Core Features**:
1. Tool directory (31 AI tools seeded, searchable, filterable)
2. Deal feed (14 deals seeded, scraper infrastructure ready)
3. Comparison engine (side-by-side tool comparisons) - TODO
4. Deal alerts (email notifications) - TODO
5. Community (upvotes, submissions) - TODO
6. Programmatic SEO pages (/vs/, /alternatives/, /pricing/) - TODO

## Tech Stack (LOCKED - Do Not Change)

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Search**: Meilisearch Cloud (not yet configured)
- **Hosting**: Railway
- **Email**: Resend + React Email (not yet configured)
- **Scraping**: Cheerio (AppSumo scraper built)

## Completed Work

### Phase 1: Foundation (DONE)
- [x] Create documentation structure
- [x] Initialize Next.js 14 project with TypeScript
- [x] Set up database schema (SQL migrations)
- [x] Configure design system (dark theme, shadcn/ui)
- [x] Build layout components (Header, Footer)
- [x] Create Homepage with real Supabase data
- [x] Build Tool Directory page with filters
- [x] Build Tool Detail page with affiliate links

### Phase 2: Deals Engine (DONE)
- [x] Connect to Supabase (real data flowing)
- [x] Seed 31 AI tools across 15 categories
- [x] Create `/deals` page with type/source filters
- [x] Seed 14 sample deals (LTDs, discounts, coupons, trials)
- [x] Build AppSumo scraper (`src/lib/scrapers/appsumo.ts`)
- [x] Create scraper orchestrator with tool matching
- [x] Add cron endpoints (`/api/cron/scrape-deals`, `/api/cron/expire-deals`)

### What's Built
- Full project structure with Next.js 16 + Tailwind CSS 4
- Dark theme with purple primary / green accent colors
- Responsive Header and Footer with navigation
- Homepage: hero, search, featured tools, deals, categories, newsletter CTA
- `/tools` directory with category/pricing filters (31 tools)
- `/tools/[slug]` detail page with features, pricing, related tools
- `/deals` directory with type/source filters (14 deals)
- ToolCard, ToolGrid, DealCard, DealGrid components
- Supabase client utilities (server.ts, client.ts, middleware.ts)
- Database with seeded data (31 tools, 14 deals, 15 categories)
- AppSumo scraper with Cheerio
- Cron API routes for automated scraping

## Database Stats

| Table | Count |
|-------|-------|
| tools | 31 |
| deals | 14 |
| categories | 15 |
| tool_categories | 31 |

## Next Steps

### Phase 3: SEO Pages
- [ ] Create `/vs/[comparison]` pages (tool vs tool)
- [ ] Create `/alternatives/[tool]` pages
- [ ] Create `/best/[category]` pages
- [ ] Dynamic sitemap generation
- [ ] Submit to Google Search Console

### Phase 4: Search
- [ ] Set up Meilisearch Cloud
- [ ] Index tools and deals
- [ ] Build SearchBox component with instant results

### Phase 5: User Features
- [ ] Supabase Auth (magic link + Google)
- [ ] Voting system
- [ ] Deal alerts
- [ ] Tool/deal submission

### Phase 6: Email
- [ ] Set up Resend
- [ ] Deal alert emails
- [ ] Weekly digest newsletter

## Environment Variables

Currently configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jnbgkxhmpvryywftzmep.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Needed for production:
```env
SUPABASE_SERVICE_ROLE_KEY=     # For admin operations
CRON_SECRET=                    # Protect cron endpoints
APPSUMO_AFFILIATE_ID=           # AppSumo partner ID
```

## To Run Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
```

## Decisions Made (Do Not Re-debate)

1. **Next.js App Router** over Pages Router - better for SEO, server components
2. **Supabase** over Prisma+Postgres - auth included, realtime, generous free tier
3. **shadcn/ui** over other component libraries - customizable, not a dependency
4. **Dark mode default** - modern, reduces eye strain, differentiates from competitors
5. **Affiliate-first monetization** - immediate revenue, no need for paid features initially
6. **Cheerio over Puppeteer** where possible - faster, cheaper, less resource-intensive
7. **Railway over Vercel** - user preference, Docker-based deployments

## Open Questions

- Exact affiliate programs to prioritize (research needed)
- Whether to include user reviews (vs just votes) - decide in Phase 5
- Discord community (yes/no) - evaluate post-launch
- Meilisearch vs Supabase full-text search - evaluate in Phase 4

## Project Structure

```
sift/
├── docs/                        # Documentation
│   ├── session-start/           # Start here
│   ├── architecture/            # Tech docs
│   └── components/              # UI docs
├── src/
│   ├── app/                     # Pages
│   │   ├── page.tsx             # Homepage
│   │   ├── tools/               # Tool pages
│   │   ├── deals/               # Deal pages
│   │   └── api/cron/            # Cron endpoints
│   ├── components/
│   │   ├── ui/                  # shadcn
│   │   ├── layout/              # Header, Footer
│   │   ├── tools/               # ToolCard, ToolGrid
│   │   └── deals/               # DealCard, DealGrid
│   ├── lib/
│   │   ├── supabase/            # DB clients
│   │   └── scrapers/            # Deal scrapers
│   └── types/                   # TypeScript
├── supabase/
│   └── migrations/              # SQL schemas + seeds
└── .env.local                   # Environment vars
```

## How to Update This Doc

At the end of each session:
1. Update **Current Phase** and **Next Task**
2. Check off completed items
3. Add new decisions to **Decisions Made** if applicable
4. Log changes in [changelog.md](../changelog.md)
