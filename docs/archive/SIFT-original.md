# SIFT - Session Start Document

> **Last Updated**: 2025-12-13
> **Current Phase**: Queued (After Calcverse)
> **Project Repo**: Not yet created
> **Project Name**: Sift

---

## 1. Quick Context

**What**: "Sift through the noise" - A directory tracking 500+ AI tools with real-time deal aggregation, pricing comparisons, and affiliate monetization.

**Revenue Model**: Affiliate commissions (60%) + featured listings (25%) + newsletter sponsorships (15%)

**Why This Will Work**: AI tool landscape is overwhelming; deal hunters are passionate; affiliate programs are generous (20-50% recurring).

**Target Revenue**: $2-8K/month within 6-12 months

**Passivity Score**: 9/10 - Mostly automated with ~2-3 hrs/week maintenance

---

## 2. Full Project Vision

### What We're Building

The definitive destination for AI tool discovery and deals:

1. **Tool Directory**: 500+ AI tools categorized, searchable, comparable
2. **Deal Feed**: Real-time aggregation from AppSumo, StackSocial, direct promotions
3. **Comparison Engine**: Side-by-side tool comparisons
4. **Deal Alerts**: Email notifications when tools go on sale
5. **Community**: Upvotes, user reviews, deal submissions

### Why It Will Succeed

1. **Perfect Timing**: AI tools exploding; users overwhelmed by choices
2. **Passionate Community**: LTD (Lifetime Deal) hunters are vocal, engaged
3. **Strong Economics**: AI tool affiliates pay 20-50% recurring commissions
4. **Network Effects**: More users = more submissions = more value
5. **First Mover**: No dominant "deals aggregator" for AI tools exists

### Target Users

**Primary:**
- Solopreneurs and indie hackers
- Marketing professionals
- Content creators
- Small business owners
- LTD (Lifetime Deal) collectors

**Secondary:**
- Enterprise buyers researching options
- AI tool makers (listing their products)
- Tech journalists (researching stories)

### Key Differentiators

| Existing Sites | Our Approach |
|----------------|--------------|
| ProductHunt - launch-focused | Deal-focused, ongoing value |
| G2/Capterra - enterprise heavy | Prosumer focused, deal-first |
| FutureTools - good directory, no deals | Deals are primary value prop |
| AppSumo - curated/limited | Aggregates ALL deals everywhere |

### Success Metrics

| Metric | 6 Month | 12 Month |
|--------|---------|----------|
| Tools Listed | 300 | 500+ |
| Monthly Visitors | 20K-30K | 50K-100K |
| Newsletter Subs | 3K | 10K |
| Monthly Revenue | $1K-2K | $5K-8K |

---

## 3. Technical Architecture

### Stack Decisions (FINAL)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 14** | SSR for SEO, API routes for scrapers, App Router |
| Database | **Supabase** | PostgreSQL + Auth + Realtime, generous free tier |
| Styling | **Tailwind CSS** | Rapid development |
| Search | **Meilisearch** | Fast, typo-tolerant, free self-hosted |
| Hosting | **Vercel** | Easy Next.js deployment |
| Email | **Resend** | Dev-friendly, good free tier |
| Scraping | **Puppeteer** on Vercel cron or separate worker |

### Data Model

```sql
-- Core tables
tools (
  id, slug, name, description, category,
  logo_url, website_url, affiliate_url,
  pricing_model, -- free/freemium/paid/enterprise
  pricing_details JSONB,
  features TEXT[],
  created_at, updated_at
)

deals (
  id, tool_id, source, -- appsumo/stacksocial/direct/user
  deal_type, -- ltd/discount/trial/coupon
  original_price, deal_price, discount_percent,
  coupon_code,
  start_date, end_date,
  affiliate_url,
  submitted_by, -- user_id if community submitted
  verified BOOLEAN,
  created_at
)

categories (
  id, slug, name, description, parent_id
)

users (
  id, email, username,
  interests TEXT[], -- for personalized alerts
  alert_preferences JSONB,
  created_at
)

user_votes (
  user_id, tool_id, vote -- 1 or -1
)

deal_alerts (
  id, user_id, tool_id, -- alert for specific tool
  category_id, -- or alert for category
  min_discount_percent,
  created_at
)
```

### Scraper Architecture

```
Scraper Pipeline:
1. Scheduled cron (daily)
2. Hit each source:
   - AppSumo API/scrape
   - StackSocial scrape
   - PitchGround scrape
   - X/Twitter API for announcements
   - Reddit r/AppSumo, r/SideProject
3. Parse and normalize deals
4. Match to existing tools (or flag for review)
5. Insert new deals
6. Trigger alerts for matching users
7. Auto-post to Discord/social (optional)
```

### URL Structure

```
ai-deals.com/
├── /                           # Homepage with deal feed
├── /tools                      # Tool directory
│   ├── /tools?category=writing
│   ├── /tools/[slug]           # Individual tool page
│   └── /tools/compare?t=jasper,copy-ai
├── /deals                      # All current deals
│   ├── /deals?type=ltd
│   └── /deals/[id]             # Deal detail
├── /vs/[tool1]-vs-[tool2]      # Comparison pages (SEO)
├── /alternatives/[tool]        # Alternative pages (SEO)
├── /pricing/[tool]             # Pricing pages (SEO)
├── /submit                     # Submit a tool or deal
└── /newsletter                 # Newsletter signup
```

### Programmatic SEO Pages

Auto-generate for high volume:
- `/vs/jasper-vs-copy-ai` (500+ comparison combos)
- `/alternatives/chatgpt` (one per major tool)
- `/pricing/midjourney-2025` (pricing pages per tool)
- `/best/ai-writing-tools` (best-of lists per category)

---

## 4. Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Deliverables:**
- [ ] Next.js project setup with Supabase
- [ ] Database schema and seed data
- [ ] Tool listing pages (browse, filter, search)
- [ ] Individual tool pages with affiliate links
- [ ] Basic deal display
- [ ] Seed 100 tools manually

**Definition of Done:**
- Can browse and search tools
- Tool pages have working affiliate links
- Deployed to Vercel

### Phase 2: Deals Engine (Week 3-4)

**Deliverables:**
- [ ] Scraper for AppSumo
- [ ] Scraper for StackSocial
- [ ] Deal display feed (homepage)
- [ ] Deal filtering (by type, category, discount)
- [ ] Manual deal submission form
- [ ] Admin review queue

**Definition of Done:**
- Deals auto-scraped daily
- Deal feed functional
- Users can submit deals

### Phase 3: Comparison & SEO (Week 5-6)

**Deliverables:**
- [ ] Tool comparison page generator
- [ ] Alternatives page generator
- [ ] Pricing page generator
- [ ] Generate 100+ programmatic pages
- [ ] Schema markup for all page types
- [ ] Sitemap generation

**Definition of Done:**
- 100+ SEO pages live
- All schema markup valid
- Submitted to GSC

### Phase 4: Community & Alerts (Week 7-8)

**Deliverables:**
- [ ] User authentication (email magic link)
- [ ] Tool upvoting
- [ ] Deal alerts (tool-specific and category)
- [ ] Newsletter signup
- [ ] Weekly deal digest email

**Definition of Done:**
- Users can create accounts
- Alerts fire on new deals
- Newsletter sending

### Phase 5: Monetization (Week 9+)

**Deliverables:**
- [ ] Featured listing system for tool makers
- [ ] Stripe integration for payments
- [ ] Newsletter sponsorship slots
- [ ] Affiliate link tracking/analytics
- [ ] A/B test affiliate placements

---

## 5. Critical Files Reference

```
ai-deals/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage/deal feed
│   │   ├── tools/
│   │   │   ├── page.tsx          # Directory
│   │   │   ├── [slug]/page.tsx   # Tool detail
│   │   │   └── compare/page.tsx  # Comparison
│   │   ├── deals/
│   │   │   ├── page.tsx          # Deal feed
│   │   │   └── [id]/page.tsx     # Deal detail
│   │   ├── vs/
│   │   │   └── [comparison]/page.tsx # SEO comparisons
│   │   └── api/
│   │       ├── scrape/route.ts   # Scraper endpoints
│   │       └── alerts/route.ts   # Alert triggers
│   ├── components/
│   │   ├── ToolCard.tsx
│   │   ├── DealCard.tsx
│   │   ├── ComparisonTable.tsx
│   │   └── SearchFilters.tsx
│   └── lib/
│       ├── supabase.ts
│       ├── scrapers/
│       │   ├── appsumo.ts
│       │   └── stacksocial.ts
│       └── email.ts
├── supabase/
│   └── migrations/
└── package.json
```

---

## 6. Context for AI Agents

### Instructions for New Sessions

1. **Read this entire document first**
2. **This project is QUEUED** - Don't start until Calcverse MVP is done
3. **Check project-tracker.md** for current status
4. **Do not re-debate decided decisions**
5. **Update this document** at session end

### Decisions Already Made (DO NOT CHANGE)

- Stack: Next.js + Supabase + Vercel
- Scraper-based deal aggregation
- Freemium community model
- Affiliate-first monetization
- Programmatic SEO for comparisons/alternatives

### Open Questions (Decide Later)

- Exact affiliate programs to prioritize
- Whether to include user reviews (vs just votes)
- Social media strategy
- Discord community (yes/no)
- Mobile app (probably no)

### Common Pitfalls to Avoid

1. **Don't build everything at once**: Ship tool directory before deals engine
2. **Don't over-scrape**: Respect rate limits, get blocked = disaster
3. **Don't ignore legal**: Affiliate disclosure on every page
4. **Don't neglect SEO**: It's the main traffic driver
5. **Don't build mobile app**: Web-first, mobile-responsive

---

## 7. Session Log

### 2025-12-13 - Initial Planning
- Completed full research and ideation
- Queued as secondary project after Calcverse
- Created this session-start document
- Next: Begin after Calcverse MVP ships

---

## Appendix: Affiliate Program Research

### High-Priority Programs (20%+ commission)

| Tool | Commission | Cookie | Notes |
|------|------------|--------|-------|
| Jasper | 30% recurring | 30 days | Top AI writing |
| Copy.ai | 45% first year | 60 days | Competitive |
| Writesonic | 30% recurring | 90 days | Good cookie |
| Descript | 25% recurring | 30 days | Video editing |
| Pictory | 30% recurring | 60 days | Video AI |
| AppSumo | 10-20% | 30 days | Deal platform itself |

### Deal Sources to Scrape

1. **AppSumo** - Largest LTD platform
2. **StackSocial** - Tech deals
3. **PitchGround** - AppSumo competitor
4. **DealMirror** - Smaller deals
5. **SaaSMantra** - LTD aggregator
6. **Direct tool announcements** - Twitter/X, newsletters
7. **Reddit** - r/AppSumo, r/SideProject, r/Entrepreneur

### Content Calendar Ideas

- Monday: "Deal of the Week" newsletter
- Wednesday: Tool comparison post
- Friday: "Weekend Deals Roundup"
- Monthly: "Best LTDs This Month"
- Quarterly: "State of AI Tools" report
