# Database Schema

## Overview

Supabase PostgreSQL database with Row Level Security (RLS) policies.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│ categories  │◄──────│ tool_categories │──────►│    tools    │
└─────────────┘       └─────────────────┘       └──────┬──────┘
      │                                                 │
      │ (self-ref)                                     │
      ▼                                                ▼
┌─────────────┐                               ┌─────────────┐
│  (parent)   │                               │    deals    │
└─────────────┘                               └─────────────┘
                                                      │
                                                      ▼
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   profiles  │◄──────│     votes       │       │ deal_alerts │
└─────────────┘       └─────────────────┘       └─────────────┘
      │
      ▼
┌─────────────────────┐
│newsletter_subscribers│
└─────────────────────┘
```

## Tables

### categories

Hierarchical tool categories.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,                -- Lucide icon name (e.g., 'pen-tool')
  parent_id UUID REFERENCES categories(id),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
```

**Initial Categories:**
- Writing
- Image Generation
- Video
- Audio
- Coding
- Productivity
- Marketing
- Sales
- Customer Support
- Research
- Data
- Design
- Social Media
- SEO
- Automation

### tools

Core entity - AI tools with affiliate links.

```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,                          -- One-liner (max 100 chars)
  description TEXT,                      -- Full description (markdown)

  -- Media
  logo_url TEXT,
  screenshot_url TEXT,

  -- Links
  website_url TEXT NOT NULL,
  affiliate_url TEXT,                    -- Primary monetization
  affiliate_program TEXT,                -- e.g., 'impact', 'partnerstack'

  -- Pricing
  pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise', 'open_source')),
  pricing_details JSONB,                 -- {free_tier: true, starting_price: 9, currency: 'USD'}

  -- Features
  features TEXT[],                       -- Array of feature strings
  use_cases TEXT[],
  integrations TEXT[],

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Status
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'archived')),

  -- Stats (denormalized for performance)
  upvotes INT DEFAULT 0,
  view_count INT DEFAULT 0,
  click_count INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_featured ON tools(is_featured) WHERE is_featured = true;
CREATE INDEX idx_tools_pricing ON tools(pricing_model);
CREATE INDEX idx_tools_upvotes ON tools(upvotes DESC);
```

### tool_categories

Many-to-many relationship between tools and categories.

```sql
CREATE TABLE tool_categories (
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (tool_id, category_id)
);

CREATE INDEX idx_tool_categories_category ON tool_categories(category_id);
```

### deals

Scraped and user-submitted deals.

```sql
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,

  -- Source tracking
  source TEXT NOT NULL,                  -- 'appsumo', 'stacksocial', 'direct', 'user'
  source_url TEXT,
  source_id TEXT,                        -- External ID for deduplication

  -- Deal info
  deal_type TEXT CHECK (deal_type IN ('ltd', 'discount', 'coupon', 'trial', 'free')),
  title TEXT NOT NULL,
  description TEXT,

  -- Pricing
  original_price DECIMAL(10,2),
  deal_price DECIMAL(10,2),
  discount_percent INT,
  currency TEXT DEFAULT 'USD',
  coupon_code TEXT,

  -- Validity
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,

  -- Affiliate
  affiliate_url TEXT,

  -- Community
  submitted_by UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT false,
  upvotes INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Prevent duplicate scrapes
  UNIQUE(source, source_id)
);

CREATE INDEX idx_deals_active ON deals(is_active) WHERE is_active = true;
CREATE INDEX idx_deals_tool ON deals(tool_id);
CREATE INDEX idx_deals_expires ON deals(expires_at);
CREATE INDEX idx_deals_source ON deals(source);
CREATE INDEX idx_deals_type ON deals(deal_type);
```

### profiles

User profiles (extends Supabase auth.users).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  interests TEXT[],                      -- Category slugs
  alert_preferences JSONB DEFAULT '{"deals": true, "digest": "weekly"}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### votes

Tool upvotes by users.

```sql
CREATE TABLE votes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  value INT CHECK (value IN (-1, 1)),    -- Future: allow downvotes
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, tool_id)
);

CREATE INDEX idx_votes_tool ON votes(tool_id);
```

### deal_alerts

User subscriptions to deal notifications.

```sql
CREATE TABLE deal_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  min_discount INT,                      -- Minimum % to trigger
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (tool_id IS NOT NULL OR category_id IS NOT NULL)
);

CREATE INDEX idx_deal_alerts_user ON deal_alerts(user_id);
CREATE INDEX idx_deal_alerts_tool ON deal_alerts(tool_id);
CREATE INDEX idx_deal_alerts_category ON deal_alerts(category_id);
```

### newsletter_subscribers

Non-authenticated newsletter signups.

```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  interests TEXT[],                      -- Category slugs
  digest_frequency TEXT DEFAULT 'weekly' CHECK (digest_frequency IN ('daily', 'weekly', 'never')),
  is_verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  unsubscribe_token TEXT DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_verified ON newsletter_subscribers(is_verified) WHERE is_verified = true;
```

### click_events

Affiliate click tracking for analytics.

```sql
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id),
  deal_id UUID REFERENCES deals(id),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,                       -- Anonymous tracking
  referrer TEXT,
  page_url TEXT,
  destination_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clicks_tool ON click_events(tool_id);
CREATE INDEX idx_clicks_deal ON click_events(deal_id);
CREATE INDEX idx_clicks_date ON click_events(created_at);
```

## Row Level Security (RLS)

### Public Read Access

```sql
-- Categories, tools, deals are publicly readable
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active tools are viewable by everyone" ON tools FOR SELECT USING (status = 'active');

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active deals are viewable by everyone" ON deals FOR SELECT USING (is_active = true);
```

### User-Specific Access

```sql
-- Profiles: users can read all, update own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Votes: users can manage their own votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON votes FOR DELETE USING (auth.uid() = user_id);

-- Deal alerts: users can manage their own
ALTER TABLE deal_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own alerts" ON deal_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own alerts" ON deal_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON deal_alerts FOR DELETE USING (auth.uid() = user_id);
```

## Functions

### update_tool_upvotes

Trigger to update denormalized upvote count.

```sql
CREATE OR REPLACE FUNCTION update_tool_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE tools SET upvotes = (
      SELECT COALESCE(SUM(value), 0) FROM votes WHERE tool_id = NEW.tool_id
    ) WHERE id = NEW.tool_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE tools SET upvotes = (
      SELECT COALESCE(SUM(value), 0) FROM votes WHERE tool_id = OLD.tool_id
    ) WHERE id = OLD.tool_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_change
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_tool_upvotes();
```

### increment_click_count

Function to atomically increment click count.

```sql
CREATE OR REPLACE FUNCTION increment_click_count(tool_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE tools SET click_count = click_count + 1 WHERE id = tool_uuid;
END;
$$ LANGUAGE plpgsql;
```

## Migration Files

Migrations are stored in `/supabase/migrations/` with timestamp prefixes:

```
supabase/migrations/
├── 20241213000000_initial_schema.sql
├── 20241213000001_rls_policies.sql
├── 20241213000002_functions.sql
└── 20241213000003_seed_categories.sql
```
