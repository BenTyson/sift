# SIFT Launch Roadmap

## Context

SIFT is an AI tools directory with deal aggregation targeting $2-8K/month passive income. It's at Phase 7 (Polish & Launch Prep) with solid foundations: 31 tools, 14 deals, auth, email templates, SEO pages, and an AppSumo scraper. But critical revenue infrastructure is missing (zero click tracking, no affiliate IDs configured, email not sending), the tool catalog is too thin for credibility, and the platform needs to be **self-governing** - running with minimal manual intervention.

**Design principle:** Every feature should either (a) generate revenue automatically or (b) grow the platform without human intervention.

**Timeline:** Methodical, no rush. Many sessions. Get it right.

**Domain:** Custom domain ready to configure.

---

## Phase 0: Documentation Overhaul (DONE)

Restructured docs/ for fast agent onboarding. Created AGENT-START.md, project CLAUDE.md, updated database schema, component docs, deployment docs. Archived stale files.

---

## Phase A: Revenue Pipeline (Fix the Money Plumbing)

*Nothing else matters if clicks don't track and affiliates don't pay.*

### A1. Click Tracking API (DONE)
- `POST /api/track/click` endpoint records to `click_events`, calls `increment_click_count()` RPC
- **Files:** `src/app/api/track/click/route.ts`

### A2. Affiliate Link Wrapper Component (DONE)
- `<AffiliateLink>` component with fire-and-forget tracking, UTM params, `keepalive: true`
- Replaced raw `<a>` tags across DealCard, tool detail, /vs/, /alternatives/, /best/
- **Files:** `src/components/shared/AffiliateLink.tsx`, edited 5 page/component files

### A3. Configure Affiliate IDs
- Set `APPSUMO_AFFILIATE_ID` in Railway env vars
- Research and sign up for affiliate programs: AppSumo, StackSocial, PitchGround, Impact.com, PartnerStack
- Add affiliate URL generation logic per program in scraper config
- **Files:** Railway dashboard, `.env.local`, `src/lib/scrapers/appsumo.ts`

### A4. Configure Resend Email
- Set `RESEND_API_KEY` in Railway
- Configure sender domain (DNS records for custom domain)
- Test deal alert and weekly digest emails end-to-end
- **Files:** Railway dashboard, DNS config

### A5. Email Verification Flow (DONE)
- Double opt-in: subscribers start unverified, get verification email, click to confirm
- `GET /api/verify-email?token=...` verifies and redirects to homepage
- Re-subscribe resends verification email
- **Files:** `src/lib/email/templates/VerifyEmail.tsx`, `src/app/api/verify-email/route.ts`, edited `newsletter.ts` + `send.ts`

---

## Phase B: Content Engine (Self-Governing Tool Catalog)

*31 tools isn't credible. Need 200+ with automated growth.*

### B1. AI-Powered Tool Importer
- Script that takes tool names, uses Claude API to generate descriptions/features/pricing
- Fetches logos from Clearbit/favicon API
- Inserts with `status: 'pending'` for quick review
- Batch import 200+ tools
- **Files:** New `src/lib/importers/ai-tool-importer.ts`

### B2. Auto-Categorization
- Auto-assign categories on import/submission using keyword matching or AI
- Populate `tool_categories` with `is_primary` flag
- **Files:** New `src/lib/utils/categorize.ts`

### B3. Additional Deal Scrapers (DONE - StackSocial + PitchGround)
- StackSocial (`stacksocial.ts`) + PitchGround (`pitchground.ts`) scrapers implemented
- Both registered in orchestrator, exported from barrel index
- Product Hunt deferred (not a deals marketplace — different data model)
- Env vars needed: `STACKSOCIAL_AFFILIATE_ID`, `PITCHGROUND_AFFILIATE_ID`
- **Files:** `src/lib/scrapers/stacksocial.ts`, `src/lib/scrapers/pitchground.ts`, edited `orchestrator.ts`, `index.ts`

### B4. Improved Tool Matching
- Levenshtein distance + domain URL matching + alias table
- Add `tool_aliases` table for alternate names
- **Files:** Edit `src/lib/scrapers/orchestrator.ts`, new migration

### B5. Community Submission Auto-Processing
- On tool approval, auto-generate SEO pages (/alternatives/, /vs/ combinations)
- Auto-generate /best/ page when category has enough tools
- **Files:** Edit admin approval logic

### B6. Stale Data Detection
- Cron to HEAD-check tool websites
- Flag dead URLs, auto-archive after 30 days
- **Files:** New `src/app/api/cron/health-check/route.ts`

---

## Phase C: UI/UX Overhaul

*Make it feel crafted, not templated.*

### C1. Design System Refinement
- About/Contact pages need visual interest
- Micro-interactions, empty states, toast notifications (sonner)

### C2. Homepage Redesign
- Trending tools, real-time deal count, social proof
- Category browser with preview on hover

### C3. Tool Detail Page Enhancement
- Pricing comparison, similar tools carousel, JSON-LD structured data, pros/cons

### C4. Deal Card Improvements
- Countdown timers, popularity indicators, verified badges

### C5. Mobile Experience Polish
- Touch targets (44px min), bottom nav, swipeable cards

### C6. Loading & Error States
- Suspense boundaries, skeleton loaders, 404 page, error boundaries, toast

### C7. Dark/Light Mode Toggle
- Light theme CSS already exists, add toggle + localStorage persistence

---

## Phase D: SEO & Organic Growth

### D1. Custom Domain Configuration
- Configure domain on Railway, update all env vars and auth redirects

### D2. Google Search Console
- Submit sitemap, request indexing, monitor crawl errors

### D3. Structured Data (JSON-LD)
- SoftwareApplication on tools, Product on deals, BreadcrumbList, FAQPage

### D4. Internal Linking Strategy
- Related comparisons, cross-links, breadcrumbs, /categories/ index

### D5. Content Enrichment for SEO Pages
- AI-generated comparison paragraphs, buying guides, migration guides

### D6. Programmatic Page Expansion
- Auto-generate /vs/ for all tool pairs in category, /alternatives/ for every tool

---

## Phase E: Automation & Self-Governance

### E1. Cron Job Hardening
- Verify all crons configured, add error reporting (email admin on failure)

### E2. Admin Dashboard Overhaul
- Monetization metrics (clicks, affiliates), content metrics, system health, quick actions

### E3. Auto-Moderation for Submissions
- Spam detection, auto-approve trusted users, auto-reject spam

### E4. Automated Content Refresh
- Monthly pricing checks, deal expiration updates, ISR revalidation on data change

### E5. Analytics & Reporting
- Revenue attribution, email performance, SEO metrics, weekly admin report

---

## Phase F: Advanced Monetization

### F1. Sponsored Listings (Stripe integration)
### F2. Newsletter Monetization (ad slots in digest)
### F3. API Access (future - tool/deal data for developers)
### F4. Comparison Widget (future - embeddable for bloggers)

---

## Execution Order

| Session | Tasks | Phase |
|---------|-------|-------|
| 0 | Documentation overhaul | 0 (DONE) |
| 1-2 | Click tracking + AffiliateLink component | A1, A2 (DONE) |
| 3 | Affiliate IDs + Resend config | A3, A4 (Ben action items) |
| 4 | Email verification flow | A5 (DONE) |
| 5-6 | AI tool importer + first batch | B1 |
| 7 | Additional scrapers | B3 (DONE) |
| 8 | Tool matching + auto-categorization | B2, B4 |
| 9 | Custom domain + Search Console | D1, D2 |
| 10 | Structured data (JSON-LD) | D3 |
| 11 | Internal linking + page expansion | D4, D6 |
| 12-13 | Homepage + toast notifications | C1, C2, C6 |
| 14 | Tool detail + deal cards | C3, C4 |
| 15 | Mobile + dark/light toggle | C5, C7 |
| 16 | Cron hardening + error notifications | E1 |
| 17 | Admin dashboard overhaul | E2 |
| 18 | Auto-moderation + content refresh | E3, E4 |
| 19 | SEO content enrichment | D5 |
| 20 | Community auto-processing + stale detection | B5, B6 |
| 21 | Analytics + weekly admin report | E5 |
| 22+ | Sponsored listings (F1), newsletter ads (F2) | F |
