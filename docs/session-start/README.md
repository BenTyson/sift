# SIFT - Session Start

> **Read this file first in every session**

## Project Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 6 - Email (Complete) |
| **Last Updated** | 2025-12-19 |
| **Next Task** | Phase 7 - Polish & Launch Prep |
| **Blockers** | None |

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
3. Comparison engine (side-by-side tool comparisons) - DONE
4. Deal alerts (subscribe to tools/categories) - DONE
5. Community (upvotes, tool/deal submissions) - DONE
6. Programmatic SEO pages (/vs/, /alternatives/, /best/) - DONE

## Tech Stack (LOCKED - Do Not Change)

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Search**: Meilisearch Cloud (with Supabase fallback)
- **Hosting**: Railway
- **Email**: Resend + React Email
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

### Phase 3: Programmatic SEO (DONE)
- [x] Create `/vs/[comparison]` pages (tool vs tool comparisons)
- [x] Create `/alternatives/[tool]` pages (ranked alternatives)
- [x] Create `/best/[category]` pages (top tools per category)
- [x] Dynamic sitemap generation (`sitemap.ts`)
- [x] Robots.txt configuration (`robots.ts`)
- [ ] Submit to Google Search Console (manual step)

### Phase 4: Search (DONE)
- [x] Install Meilisearch client library
- [x] Create Meilisearch client utilities (admin & search)
- [x] Build sync utility to index tools/deals
- [x] Create `/api/search` endpoint with Supabase fallback
- [x] Create `/api/search/sync` endpoint for data sync
- [x] Build SearchBox component with instant results
- [x] Integrate SearchBox into Header

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
- `/vs/[comparison]` pages for tool-vs-tool comparisons
- `/alternatives/[tool]` pages showing ranked alternatives
- `/best/[category]` pages ranking top tools per category
- Dynamic sitemap.xml with all tools, categories, comparisons
- Robots.txt configuration
- SearchBox component with instant results dropdown
- Meilisearch integration (with Supabase fallback)
- /api/search endpoint for search queries
- /api/search/sync endpoint to sync data to Meilisearch
- Authentication (magic link + Google OAuth)
- Auth pages: /login, /signup, /forgot-password, /auth/reset-password
- UserMenu component with dropdown in Header
- Profile pages: /profile, /profile/alerts, /profile/settings, /profile/submissions
- RLS policies for database security
- Voting system with optimistic UI updates
- Deal alerts system (subscribe to tools or categories)
- DealAlertButton component on tool/category pages
- Tool/deal submission system with review workflow
- /submit, /submit/tool, /submit/deal pages
- tool_submissions and deal_submissions tables
- Refined UI color scheme (aqua monochromatic, outline buttons)

## Database Stats

| Table | Count |
|-------|-------|
| tools | 31 |
| deals | 14 |
| categories | 15 |
| tool_categories | 31 |

## Next Steps

### Phase 5: User Features (COMPLETE)
- [x] Supabase Auth (magic link + Google)
- [x] Voting system
- [x] Deal alerts (subscribe to tools/categories)
- [x] Tool/deal submission forms

### Phase 6: Email (COMPLETE)
- [x] Set up Resend client with graceful degradation
- [x] React Email templates (DealAlert, WeeklyDigest)
- [x] Cron endpoints for sending alerts and digests
- [x] One-click unsubscribe handler

### Phase 7: Polish & Launch Prep (TODO)
- [ ] Admin dashboard for reviewing submissions
- [ ] Newsletter signup integration (store subscribers)
- [ ] Additional scrapers (StackSocial, PitchGround, etc.)
- [ ] Analytics integration (Plausible or PostHog)
- [ ] Error monitoring (Sentry)
- [ ] Performance optimization (image CDN, caching)
- [ ] SEO audit and meta tag refinement
- [ ] Submit sitemap to Google Search Console
- [ ] Production environment variables audit

## Environment Variables

Currently configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jnbgkxhmpvryywftzmep.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_ACCESS_TOKEN=sbp_...   # CLI access token
```

Needed for production:
```env
SUPABASE_SERVICE_ROLE_KEY=     # For admin operations
CRON_SECRET=                    # Protect cron endpoints
APPSUMO_AFFILIATE_ID=           # AppSumo partner ID
NEXT_PUBLIC_MEILISEARCH_HOST=   # Meilisearch Cloud host
MEILISEARCH_ADMIN_KEY=          # Meilisearch admin key (server-side)
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=  # Meilisearch search key (client-safe)
RESEND_API_KEY=                 # Resend API key for emails
FROM_EMAIL=                     # Sender address (default: SIFT <noreply@sift.tools>)
```

## Supabase CLI

The project is linked to Supabase Cloud. Common commands:

```bash
# Push new migrations to remote
supabase db push

# View migration status
supabase migration list

# Generate migration from schema changes
supabase db diff -f migration_name

# Regenerate TypeScript types
supabase gen types typescript --linked > src/types/database.ts
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
│   │   ├── vs/                  # Comparison pages
│   │   ├── alternatives/        # Alternatives pages
│   │   ├── best/                # Best-of pages
│   │   ├── sitemap.ts           # Dynamic sitemap
│   │   ├── robots.ts            # Robots.txt
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
