# Changelog

All notable changes to SIFT are documented here.

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
- Set up Vercel cron jobs
