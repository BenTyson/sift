# Changelog

All notable changes to SIFT are documented here.

## 2025-12-18 - Session 7: UI Color Refinement

### Changed

**Color Scheme Overhaul**
- Replaced purple/green dual-color scheme with unified aqua monochromatic palette
- Background: softer charcoal with cool tint (easier on eyes)
- Primary: aqua/teal (hue 180°) for all accent colors
- Removed harsh neon saturation, refined to sophisticated tones

**Button Styling**
- Default buttons: outline style (aqua border, aqua text, transparent bg)
- "Get Deal" buttons: white outline for better contrast
- Side nav selected state: solid aqua at 70% opacity

**Badge Styling**
- Pricing badges (Free, Freemium, Paid): outline style with transparent background
- Discount badges (88% OFF): aqua outline instead of solid fill
- Improved contrast and readability across all badges

**Other**
- Dev server now runs on port 4477 by default

### Files Modified
- `src/app/globals.css` - Complete color variable overhaul
- `src/components/ui/button.tsx` - Default variant now outline
- `src/components/deals/DealCard.tsx` - Discount badge and CTA button styling
- `src/components/tools/ToolCard.tsx` - Pricing badge styling
- `src/app/deals/page.tsx` - Side nav selected state opacity
- `package.json` - Dev port set to 4477

---

## 2025-12-17 - Session 6: Deal Alerts & Submissions Complete

### Added

**Deal Alerts System**
- `src/lib/actions/alerts.ts` - Server actions for alert CRUD
  - createToolAlert, createCategoryAlert, deleteAlert
  - getUserAlertForTool, getUserAlertForCategory
- `src/components/alerts/DealAlertButton.tsx` - Subscribe/unsubscribe button
- Added DealAlertButton to tool detail pages (`/tools/[slug]`)
- Added DealAlertButton to category best-of pages (`/best/[category]`)
- Enhanced `/profile/alerts` with delete functionality
- `src/app/profile/alerts/DeleteAlertButton.tsx` - Delete alert button

**Tool/Deal Submission System**
- `supabase/migrations/20241217000000_tool_submissions.sql`
  - tool_submissions table with review workflow
  - deal_submissions table with tool linking
  - RLS policies for user submissions
- `src/lib/actions/submissions.ts` - Server actions
  - submitTool, submitDeal
  - getUserToolSubmissions, getUserDealSubmissions
- `/submit` - Submission hub page (choose tool or deal)
- `/submit/tool` - Tool submission form
  - ToolSubmissionForm component with category selection
  - Feature tags, pricing model, validation
- `/submit/deal` - Deal submission form
  - DealSubmissionForm with existing/new tool toggle
  - Price fields, coupon code, expiration date
- `/profile/submissions` - View user's submissions and status

**New UI Components**
- `src/components/ui/textarea.tsx` - Textarea component
- `src/components/ui/label.tsx` - Label component (radix)
- `src/components/ui/select.tsx` - Select dropdown (radix)
- `src/components/ui/tabs.tsx` - Tabs component (radix)

**Dependencies**
- @radix-ui/react-label
- @radix-ui/react-select
- @radix-ui/react-tabs

**User Menu Updates**
- Added "My Submissions" link to UserMenu dropdown

### Technical Notes
- Used `as any` type assertions for new submission tables (types not regenerated)
- Migration pushed to Supabase Cloud
- All pages use server components with Suspense where needed

### Build Status
- All 24 routes compile successfully
- TypeScript passes

### Next Session
- Phase 6: Email (Resend setup)
- Deal alert email notifications
- Weekly digest newsletter

---

## 2025-12-16 - Session 5: Authentication & Voting Complete

### Added

**Auth Infrastructure**
- `src/lib/supabase/hooks.ts` - useUser and useSession client hooks
- `src/lib/supabase/actions.ts` - Server actions for auth operations
  - signInWithEmail (magic link)
  - signInWithPassword
  - signUp
  - signOut
  - resetPassword
  - updatePassword
  - signInWithGoogle (OAuth)

**Auth Pages**
- `/login` - Magic link and Google sign-in
- `/signup` - Email/password registration with Google option
- `/forgot-password` - Password reset request
- `/auth/reset-password` - Set new password
- `/auth/callback` - OAuth callback handler

**User Menu & Profile**
- `src/components/auth/UserMenu.tsx` - User dropdown in Header
- `/profile` - View/edit profile (username)
- `/profile/alerts` - View deal alerts
- `/profile/settings` - Notification preferences, sign out

**Database Security**
- `supabase/migrations/20241215000000_auth_rls_policies.sql`
  - Auto-create profile on signup trigger
  - RLS policies for all user tables
  - Public read access for tools, deals, categories
  - User-owned data protection (profiles, votes, alerts)

### Technical Notes
- Used Suspense boundaries for pages with useSearchParams
- Type assertions needed for Supabase query results
- Google OAuth requires Supabase dashboard configuration
- Magic link is the primary auth method

### Environment Variables (required for Google OAuth)
```env
# Configure in Supabase Dashboard > Authentication > Providers
# Google Client ID and Secret
```

**Supabase CLI Setup**
- Linked project to Supabase Cloud (ref: jnbgkxhmpvryywftzmep)
- Access token stored in .env.local
- All migrations synced (5 total)
- Can now use `supabase db push` for future migrations

**Voting System**
- `src/lib/actions/votes.ts` - Server actions (vote, getUserVote, getUserVotes)
- `src/components/tools/VoteButton.tsx` - Upvote button with optimistic UI
- Updated ToolCard to include VoteButton
- Updated ToolGrid to pass user votes
- Vote toggle behavior (click again to remove vote)
- Redirects to login if not authenticated

### Build Status
- All routes compile successfully
- TypeScript passes

### Next Session
- Deal alerts CRUD
- Tool/deal submission forms

---

## 2025-12-15 - Session 4: Search Implementation Complete

### Added

**Meilisearch Integration**
- Installed `meilisearch` npm package
- `src/lib/meilisearch/client.ts` - Admin and search client factories
- `src/lib/meilisearch/sync.ts` - Tools and deals sync utilities
- `src/lib/meilisearch/index.ts` - Exports

**Search API**
- `/api/search` - Search endpoint with Meilisearch integration
- `/api/search/sync` - Trigger full data sync to Meilisearch
- Supabase full-text search fallback when Meilisearch not configured

**Search UI**
- `SearchBox` component with instant results dropdown
- Keyboard navigation (arrow keys, Enter, Escape)
- Results show tool name, tagline, pricing, categories
- Debounced search (200ms)
- Integrated into Header (desktop and mobile)

### Technical Notes
- Search works immediately using Supabase fallback
- Meilisearch optional - set env vars to enable
- Type assertions added for Supabase query results

### Environment Variables (new)
```env
NEXT_PUBLIC_MEILISEARCH_HOST=   # Optional
MEILISEARCH_ADMIN_KEY=          # Optional
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=  # Optional
```

### Build Status
- All routes compile successfully
- TypeScript passes

### Next Session
- Supabase Auth (magic link + Google)
- Voting system
- Deal alerts

---

## 2025-12-14 - Session 3: Programmatic SEO Complete

### Added

**Comparison Pages (`/vs/[comparison]`)**
- Tool-vs-tool comparison pages (e.g., `/vs/jasper-vs-copy-ai`)
- Side-by-side feature comparison table
- Pricing comparison
- "Best for" recommendations
- Quick verdict section
- Related comparisons links

**Alternatives Pages (`/alternatives/[tool]`)**
- Ranked alternatives for each tool (e.g., `/alternatives/jasper`)
- Top alternative highlight with trophy badge
- Full alternatives list with rankings
- Compare buttons linking to /vs/ pages
- Related links section

**Best-of Pages (`/best/[category]`)**
- Category ranking pages (e.g., `/best/writing`)
- Top 3 showcase with trophy, medal, award icons
- Quick navigation for large lists
- Full rankings with pricing and features
- Explore other categories section

**SEO Infrastructure**
- `sitemap.ts` - Dynamic sitemap generation
  - All tool pages
  - All alternatives pages
  - All best-of category pages
  - Top 15 tool comparison combinations
- `robots.ts` - Robots.txt configuration
  - Allow all paths except /api/ and /admin/
  - Sitemap reference

### Technical Notes
- Used `export const dynamic = 'force-dynamic'` for all SEO pages
- Avoided `generateStaticParams` due to cookies/auth context limitation
- Added explicit type assertions for Supabase queries to fix TypeScript inference

### Build Status
- All routes compile successfully
- TypeScript passes
- Ready for production

### Next Session
- Set up Meilisearch Cloud for search
- Index tools and deals
- Build SearchBox component with instant results

---

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
