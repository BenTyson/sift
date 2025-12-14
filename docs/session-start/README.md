# SIFT - Session Start

> **Read this file first in every session**

## Project Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 1 - Foundation (Complete) |
| **Last Updated** | 2025-12-13 |
| **Next Task** | Connect Supabase, create deals page |
| **Blockers** | Need Supabase credentials in .env.local |

## Quick Links

| Doc | Description |
|-----|-------------|
| [Architecture Overview](../architecture/overview.md) | Tech stack, system design |
| [Database Schema](../architecture/database.md) | Tables, relationships, RLS |
| [Components](../components/README.md) | Component hierarchy |
| [Changelog](../changelog.md) | Session-by-session progress |

## What is SIFT?

AI tools directory with deal aggregation, affiliate monetization, and programmatic SEO.

**Target**: $2-8K/month passive income with ~2-3 hrs/week maintenance

**Core Features**:
1. Tool directory (500+ AI tools, searchable, filterable)
2. Deal feed (scraped from AppSumo, StackSocial, etc.)
3. Comparison engine (side-by-side tool comparisons)
4. Deal alerts (email notifications)
5. Community (upvotes, submissions)
6. Programmatic SEO pages (/vs/, /alternatives/, /pricing/)

## Tech Stack (LOCKED - Do Not Change)

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS + shadcn/ui
- **Search**: Meilisearch Cloud
- **Hosting**: Railway
- **Email**: Resend + React Email
- **Scraping**: Cheerio (light) + Puppeteer (heavy)

## Completed Work

### Phase 1: Foundation (DONE)
- [x] Create documentation structure
- [x] Initialize Next.js 14 project with TypeScript
- [x] Set up database schema (SQL migrations ready)
- [x] Configure design system (dark theme, shadcn/ui)
- [x] Build layout components (Header, Footer)
- [x] Create Homepage with mock data
- [x] Build Tool Directory page with filters
- [x] Build Tool Detail page with affiliate links

### What's Built
- Full project structure with Next.js 14 + Tailwind CSS 4
- Dark theme with purple primary / green accent colors
- Responsive Header and Footer with navigation
- Homepage: hero, search, featured tools, deals, categories, newsletter CTA
- `/tools` directory with category/pricing filters
- `/tools/[slug]` detail page with features, pricing, related tools
- ToolCard, ToolGrid, DealCard, DealGrid components
- Supabase client utilities (server.ts, client.ts, middleware.ts)
- Database migrations with full schema
- TypeScript types for all entities

## Next Steps

### Phase 2: Deals Engine
- [ ] Create `/deals` page
- [ ] Create `/deals/[id]` page
- [ ] Build AppSumo scraper
- [ ] Set up cron jobs
- [ ] Connect to Supabase (need .env.local)

### Phase 3: SEO Pages
- [ ] Create `/vs/[comparison]` pages
- [ ] Create `/alternatives/[tool]` pages
- [ ] Sitemap generation

## To Run Locally

```bash
# Install dependencies (already done)
npm install

# Copy env template
cp .env.example .env.local
# Then add your Supabase credentials

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

## Open Questions

- Exact affiliate programs to prioritize (research needed)
- Whether to include user reviews (vs just votes) - decide in Phase 6
- Discord community (yes/no) - evaluate post-launch

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
│   │   └── tools/               # Tool pages
│   ├── components/
│   │   ├── ui/                  # shadcn
│   │   ├── layout/              # Header, Footer
│   │   ├── tools/               # ToolCard, ToolGrid
│   │   └── deals/               # DealCard, DealGrid
│   ├── lib/
│   │   └── supabase/            # DB clients
│   └── types/                   # TypeScript
├── supabase/
│   └── migrations/              # SQL schemas
└── .env.example                 # Env template
```

## How to Update This Doc

At the end of each session:
1. Update **Current Phase** and **Next Task**
2. Check off completed items
3. Add new decisions to **Decisions Made** if applicable
4. Log changes in [changelog.md](../changelog.md)
