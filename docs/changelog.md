# Changelog

All notable changes to SIFT are documented here.

## 2025-12-14 - Session 2: Deals Engine Complete

### Added

**Supabase Integration**
- Connected homepage to real Supabase data
- Connected tools directory to real Supabase queries
- Added pricing filter functionality

**Seed Data**
- 31 AI tools across all categories (Jasper, Midjourney, ChatGPT, Cursor, etc.)
- 14 sample deals (lifetime deals, discounts, coupons, free trials)
- Tool-category associations in tool_categories table

**Deals Page**
- `/deals` page with full filtering UI
- Filter by deal type (LTD, discount, coupon, trial)
- Filter by source (AppSumo, StackSocial, PitchGround, Direct)
- Active filter badges with clear options
- Empty state handling

**Scraper Infrastructure**
- `src/lib/scrapers/types.ts` - Scraper type definitions
- `src/lib/scrapers/appsumo.ts` - Cheerio-based AppSumo scraper
- `src/lib/scrapers/orchestrator.ts` - Runs scrapers, matches tools, upserts deals
- `src/lib/scrapers/index.ts` - Exports

**Cron Endpoints**
- `/api/cron/scrape-deals` - Trigger deal scraping (protected by CRON_SECRET)
- `/api/cron/expire-deals` - Mark expired deals as inactive

**Dependencies**
- Added `cheerio` for HTML parsing
- Installed Supabase CLI via Homebrew

### Fixed
- TypeScript errors with Supabase client type inference (used type assertions)
- Node.js version compatibility (set engines to >=20.9.0)
- Middleware gracefully handles missing Supabase env vars

### Database
- Seeded 31 tools via psql
- Seeded 14 deals via psql
- Total: 31 tools, 14 deals, 15 categories, 31 tool_categories

### Documentation
- Updated `/docs/session-start/README.md` with current status
- Updated `/docs/changelog.md` (this file)

### Build Status
- All routes compile successfully
- TypeScript passes
- Ready for Railway deployment

### Next Session
- Build SEO pages (/vs/, /alternatives/, /best/)
- Dynamic sitemap generation
- Set up Meilisearch for search

---

## 2025-12-13 - Session 1: Foundation Complete

### Added

**Documentation**
- `/docs/session-start/README.md` - Agent entry point
- `/docs/architecture/overview.md` - System architecture
- `/docs/architecture/database.md` - Full database schema
- `/docs/components/README.md` - Component hierarchy
- `/docs/changelog.md` - This file

**Project Setup**
- Next.js 14 with TypeScript, Tailwind CSS 4, App Router
- shadcn/ui components (button, card, badge, input, skeleton, dialog, sheet, etc.)
- Custom dark theme with purple primary / green accent
- Supabase client utilities (server.ts, client.ts, middleware.ts)

**Database**
- Full schema in `/supabase/migrations/`
- Tables: categories, tools, tool_categories, deals, profiles, votes, deal_alerts, newsletter_subscribers, click_events
- Functions: update_tool_upvotes, increment_click_count, update_updated_at
- Seed data for 15 categories

**Components**
- `Header` - Navigation with search, mobile menu
- `Footer` - Links, newsletter signup, affiliate disclosure
- `ToolCard` - 3 variants: default, compact, featured
- `ToolGrid` - Responsive grid with loading skeletons
- `DealCard` - Discount badges, countdown timers, price comparison
- `DealGrid` - Responsive deal feed

**Pages**
- `/` - Homepage with hero, search, featured tools, deals, categories, newsletter CTA
- `/tools` - Directory with category/pricing filters
- `/tools/[slug]` - Tool detail with features, pricing, related tools

**Types**
- Full TypeScript types in `/src/types/database.ts`
- Convenience types: Tool, Deal, Category, Profile, etc.

### Build Status
- Compiles successfully
- All routes functional with mock data

### Next Session
- Connect to Supabase (add .env.local)
- Create `/deals` page
- Build AppSumo scraper
- Set up cron jobs
