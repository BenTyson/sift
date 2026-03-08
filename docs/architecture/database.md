# Database Schema

Supabase PostgreSQL with Row Level Security (RLS).

## Entity Relationship Diagram

```
                    ┌─────────────────┐
┌─────────────┐     │ tool_categories │     ┌─────────────┐
│ categories  │<----│  (junction)     │---->│    tools     │
└──────┬──────┘     └─────────────────┘     └──────┬──────┘
       │ (parent)                                   │
       └──> self                                    │
                                                    ├──> deals
                                                    ├──> click_events
                                                    └──> votes

┌─────────────┐     ┌─────────────────┐
│  profiles   │<----│     votes       │
│ (is_admin)  │     └─────────────────┘
└──────┬──────┘
       ├──> deal_alerts
       ├──> tool_submissions
       └──> deal_submissions

┌──────────────────────┐
│ newsletter_subscribers│
└──────────────────────┘
```

## Tables

### categories
Hierarchical tool categories (15 seeded).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| slug | TEXT | UNIQUE, NOT NULL |
| name | TEXT | NOT NULL |
| description | TEXT | |
| icon | TEXT | Lucide icon name |
| parent_id | UUID | FK -> categories(id) |
| display_order | INT | Default 0 |
| created_at | TIMESTAMPTZ | |

### tools
Core entity - AI tools with affiliate links (31 seeded).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| slug | TEXT | UNIQUE, NOT NULL |
| name | TEXT | NOT NULL |
| tagline | TEXT | Max ~100 chars |
| description | TEXT | Markdown |
| logo_url | TEXT | |
| screenshot_url | TEXT | |
| website_url | TEXT | NOT NULL |
| affiliate_url | TEXT | Primary monetization |
| affiliate_program | TEXT | e.g., 'impact', 'partnerstack' |
| pricing_model | TEXT | CHECK: free, freemium, paid, enterprise, open_source |
| pricing_details | JSONB | {free_tier, starting_price, currency} |
| features | TEXT[] | |
| use_cases | TEXT[] | |
| integrations | TEXT[] | |
| meta_title | TEXT | |
| meta_description | TEXT | |
| is_featured | BOOLEAN | Default false |
| is_verified | BOOLEAN | Default false |
| status | TEXT | CHECK: active, pending, archived |
| upvotes | INT | Denormalized, updated by trigger |
| view_count | INT | Default 0 |
| click_count | INT | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### tool_categories
Many-to-many junction (31 rows seeded).

| Column | Type | Notes |
|--------|------|-------|
| tool_id | UUID | PK, FK -> tools(id) CASCADE |
| category_id | UUID | PK, FK -> categories(id) CASCADE |
| is_primary | BOOLEAN | Default false |

### deals
Scraped and user-submitted deals (14 seeded).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| tool_id | UUID | FK -> tools(id) SET NULL |
| source | TEXT | NOT NULL: appsumo, stacksocial, direct, user |
| source_url | TEXT | |
| source_id | TEXT | External ID for dedup |
| deal_type | TEXT | CHECK: ltd, discount, coupon, trial, free |
| title | TEXT | NOT NULL |
| description | TEXT | |
| original_price | DECIMAL(10,2) | |
| deal_price | DECIMAL(10,2) | |
| discount_percent | INT | |
| currency | TEXT | Default USD |
| coupon_code | TEXT | |
| starts_at | TIMESTAMPTZ | |
| expires_at | TIMESTAMPTZ | |
| is_active | BOOLEAN | Default true |
| affiliate_url | TEXT | |
| submitted_by | UUID | FK -> auth.users(id) |
| is_verified | BOOLEAN | Default false |
| upvotes | INT | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| | | UNIQUE(source, source_id) |

### profiles
User profiles (extends auth.users).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, FK -> auth.users(id) CASCADE |
| username | TEXT | UNIQUE |
| avatar_url | TEXT | |
| interests | TEXT[] | Category slugs |
| alert_preferences | JSONB | Default: {deals: true, digest: "weekly"} |
| is_admin | BOOLEAN | Default false (added in migration 7) |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### votes
Tool upvotes by users.

| Column | Type | Notes |
|--------|------|-------|
| user_id | UUID | PK, FK -> auth.users(id) CASCADE |
| tool_id | UUID | PK, FK -> tools(id) CASCADE |
| value | INT | CHECK: -1 or 1 |
| created_at | TIMESTAMPTZ | |

### deal_alerts
User subscriptions to deal notifications.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK -> auth.users(id) CASCADE |
| tool_id | UUID | FK -> tools(id) CASCADE |
| category_id | UUID | FK -> categories(id) CASCADE |
| min_discount | INT | Minimum % to trigger |
| created_at | TIMESTAMPTZ | |
| | | CHECK: tool_id OR category_id must be set |

### newsletter_subscribers
Non-authenticated newsletter signups.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| email | TEXT | UNIQUE, NOT NULL |
| interests | TEXT[] | Category slugs |
| digest_frequency | TEXT | CHECK: daily, weekly, never |
| is_verified | BOOLEAN | Default false |
| verification_token | TEXT | |
| unsubscribe_token | TEXT | Auto-generated UUID |
| created_at | TIMESTAMPTZ | |

### click_events
Affiliate click tracking (table exists, no API endpoint yet).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| tool_id | UUID | FK -> tools(id) |
| deal_id | UUID | FK -> deals(id) |
| user_id | UUID | FK -> auth.users(id) |
| session_id | TEXT | Anonymous tracking |
| referrer | TEXT | |
| page_url | TEXT | |
| destination_url | TEXT | |
| created_at | TIMESTAMPTZ | |

### tool_submissions
User-submitted tools awaiting review.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| submitted_by | UUID | NOT NULL, FK -> auth.users(id) CASCADE |
| name | TEXT | NOT NULL |
| tagline | TEXT | NOT NULL |
| description | TEXT | NOT NULL |
| website_url | TEXT | NOT NULL |
| logo_url | TEXT | |
| pricing_model | TEXT | CHECK: free, freemium, paid, enterprise, open_source |
| features | TEXT[] | Default {} |
| category_ids | UUID[] | Default {} |
| status | TEXT | CHECK: pending, approved, rejected |
| reviewer_notes | TEXT | |
| reviewed_at | TIMESTAMPTZ | |
| reviewed_by | UUID | |
| approved_tool_id | UUID | FK -> tools(id) SET NULL |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### deal_submissions
User-submitted deals awaiting review.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| submitted_by | UUID | NOT NULL, FK -> auth.users(id) CASCADE |
| tool_id | UUID | FK -> tools(id) CASCADE |
| tool_name | TEXT | For new tools not in system |
| tool_url | TEXT | For new tools not in system |
| deal_type | TEXT | CHECK: ltd, discount, coupon, trial, free |
| title | TEXT | NOT NULL |
| description | TEXT | |
| original_price | DECIMAL(10,2) | |
| deal_price | DECIMAL(10,2) | |
| discount_percent | INT | |
| coupon_code | TEXT | |
| deal_url | TEXT | NOT NULL |
| expires_at | TIMESTAMPTZ | |
| status | TEXT | CHECK: pending, approved, rejected |
| reviewer_notes | TEXT | |
| reviewed_at | TIMESTAMPTZ | |
| reviewed_by | UUID | |
| approved_deal_id | UUID | FK -> deals(id) SET NULL |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

## Functions

| Function | Purpose |
|----------|---------|
| `handle_new_user()` | Trigger: auto-creates profile on auth.users insert |
| `update_tool_upvotes()` | Trigger: syncs denormalized upvote count on vote change |
| `increment_click_count(tool_uuid)` | Atomically increments click_count on tools |
| `update_updated_at()` | Trigger: sets updated_at on row update |
| `is_admin()` | Returns true if current user has is_admin=true |

## RLS Summary

| Table | Public Read | User Write | Admin |
|-------|------------|------------|-------|
| tools | Yes (all) | No | Service role |
| deals | Yes (all) | No | Service role |
| categories | Yes (all) | No | Service role |
| tool_categories | Yes (all) | No | Service role |
| profiles | Yes (all) | Own only | - |
| votes | Yes (all) | Own only | - |
| deal_alerts | Own only | Own only | - |
| click_events | Service role | Anyone (insert) | - |
| newsletter_subscribers | Admin/service | Anyone (insert) | Yes |
| tool_submissions | Own + admin | Own (pending) | Yes |
| deal_submissions | Own + admin | Own (pending) | Yes |

## Migrations

```
supabase/migrations/
├── 20241213000000_initial_schema.sql      # Tables: tools, deals, categories, tool_categories, profiles, votes, deal_alerts, newsletter_subscribers, click_events
├── 20241213000001_seed_categories.sql     # 15 categories
├── 20241213000002_seed_tools.sql          # 31 AI tools
├── 20241213000003_seed_deals.sql          # 14 sample deals
├── 20241215000000_auth_rls_policies.sql   # RLS policies, handle_new_user trigger
├── 20241217000000_tool_submissions.sql    # tool_submissions + deal_submissions tables
└── 20241219000000_admin_policies.sql      # is_admin column, is_admin() function, admin policies
```

## Regenerating Types

```bash
supabase gen types typescript --linked > src/types/database.ts
```
