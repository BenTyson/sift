# SIFT - Agent Start

> Read this file first. ~60 seconds to full context.

## What Is SIFT

AI tools directory with deal aggregation. Passive monetization via affiliate links. Target: $2-8K/month with 2-3 hrs/week maintenance.

## Current Status

| Field | Value |
|-------|-------|
| **Phase** | Phase 7 - Polish & Launch Prep (paused) |
| **Production** | https://sift-production.up.railway.app |
| **Data** | 31 tools, 14 deals, 15 categories |
| **Active Roadmap** | See [roadmap.md](roadmap.md) |

### What Works
- Tool directory with search (Meilisearch), filters, voting
- Deal feed with AppSumo scraper + expiration cron
- Auth: magic link + Google OAuth + password
- SEO pages: /vs/, /alternatives/, /best/ with dynamic sitemap
- Deal alerts (subscribe to tools/categories)
- Tool/deal submission system with admin review
- Email templates built (DealAlert, WeeklyDigest)
- Plausible analytics integrated

### What Doesn't Work (Critical Gaps)
- **No affiliate IDs** - `APPSUMO_AFFILIATE_ID` env var not set, making $0 (Ben action item)
- **Email not sending** - Resend not configured in production (Ben action item)
- **Only 31 tools** - need 200+ for credibility
- **3 scrapers untested in prod** - AppSumo, StackSocial, PitchGround built but need env vars + live test

### Recently Completed
- **Auto-categorization** - Keyword categorizer auto-assigns categories on tool approval (B2)
- **Improved tool matching** - 6-tier pipeline with aliases, domain, Levenshtein; `tool_aliases` table with 27 seeds (B4)
- **AI tool importer** - Claude-powered batch import with metadata generation (B1)
- **StackSocial + PitchGround scrapers** - Both implemented, registered in orchestrator (B3)
- **Click tracking** - `POST /api/track/click` + `<AffiliateLink>` component across all pages (A1, A2)
- **Email verification** - Double opt-in flow with `GET /api/verify-email?token=...` (A5)

## Tech Stack (Locked - Do Not Change)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL + Auth) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Search | Meilisearch Cloud (Supabase fallback) |
| Hosting | Railway |
| Email | Resend + React Email |
| Scraping | Cheerio |
| Analytics | Plausible |

## Key File Paths

| Area | Path |
|------|------|
| Pages | `src/app/` (tools, deals, vs, alternatives, best, admin, profile, submit, about, contact, privacy, terms) |
| Components | `src/components/` (alerts, auth, deals, layout, newsletter, search, shared, tools, ui) |
| Server actions | `src/lib/actions/` (admin, alerts, newsletter, submissions, votes) |
| Supabase clients | `src/lib/supabase/` (server.ts, client.ts, actions.ts, middleware.ts, hooks.ts) |
| Scrapers | `src/lib/scrapers/` (appsumo.ts, stacksocial.ts, pitchground.ts, orchestrator.ts, types.ts) |
| Email | `src/lib/email/` (client.ts, send.ts, templates/) |
| Search | `src/lib/meilisearch/` (client.ts, sync.ts) |
| Types | `src/types/` (database.ts, index.ts) |
| Styles | `src/app/globals.css` (OKLch aqua palette, dark default) |
| Migrations | `supabase/migrations/` (9 files) |
| API endpoints | `src/app/api/` (track/click, verify-email, unsubscribe, search, cron/*) |

## Key Patterns

- Server components for data fetching, client components for interactivity
- `createClient()` for cookie-based Supabase access, `createAdminClient()` for service role
- ISR: tools 24h, deals 1h, SEO pages 24h
- Crons protected by `CRON_SECRET` bearer token
- Scrapers implement `DealScraper` interface in `src/lib/scrapers/types.ts`
- Admin check via `is_admin` column on `profiles` table + `is_admin()` SQL function

## Decisions Made (Do Not Re-debate)

1. Next.js App Router over Pages Router
2. Supabase over Prisma+Postgres
3. shadcn/ui (customizable, not a dependency)
4. Dark mode default with aqua OKLch palette
5. Affiliate-first monetization
6. Cheerio over Puppeteer (faster, cheaper)
7. Railway over Vercel
8. Plausible over PostHog
9. No error monitoring yet (use Railway logs)

## Deeper Docs

- [Architecture Overview](architecture/overview.md)
- [Database Schema](architecture/database.md)
- [Components](components/README.md)
- [Deployment](operations/deployment.md)
- [Launch Roadmap](roadmap.md)
- [Changelog](archive/changelog.md) (historical reference)
