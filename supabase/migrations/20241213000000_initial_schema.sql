-- SIFT Initial Schema
-- Categories, Tools, Deals, and supporting tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,  -- Lucide icon name
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ============================================
-- TOOLS
-- ============================================
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,

  -- Media
  logo_url TEXT,
  screenshot_url TEXT,

  -- Links
  website_url TEXT NOT NULL,
  affiliate_url TEXT,
  affiliate_program TEXT,

  -- Pricing
  pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise', 'open_source')),
  pricing_details JSONB DEFAULT '{}',

  -- Features
  features TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  integrations TEXT[] DEFAULT '{}',

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
CREATE INDEX idx_tools_created ON tools(created_at DESC);

-- ============================================
-- TOOL CATEGORIES (Many-to-Many)
-- ============================================
CREATE TABLE tool_categories (
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (tool_id, category_id)
);

CREATE INDEX idx_tool_categories_category ON tool_categories(category_id);

-- ============================================
-- DEALS
-- ============================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,

  -- Source tracking
  source TEXT NOT NULL,
  source_url TEXT,
  source_id TEXT,

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
  submitted_by UUID,
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
CREATE INDEX idx_deals_created ON deals(created_at DESC);

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  interests TEXT[] DEFAULT '{}',
  alert_preferences JSONB DEFAULT '{"deals": true, "digest": "weekly"}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- VOTES
-- ============================================
CREATE TABLE votes (
  user_id UUID NOT NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  value INT CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, tool_id)
);

CREATE INDEX idx_votes_tool ON votes(tool_id);

-- ============================================
-- DEAL ALERTS
-- ============================================
CREATE TABLE deal_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  min_discount INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (tool_id IS NOT NULL OR category_id IS NOT NULL)
);

CREATE INDEX idx_deal_alerts_user ON deal_alerts(user_id);
CREATE INDEX idx_deal_alerts_tool ON deal_alerts(tool_id);
CREATE INDEX idx_deal_alerts_category ON deal_alerts(category_id);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  interests TEXT[] DEFAULT '{}',
  digest_frequency TEXT DEFAULT 'weekly' CHECK (digest_frequency IN ('daily', 'weekly', 'never')),
  is_verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  unsubscribe_token TEXT DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_verified ON newsletter_subscribers(is_verified) WHERE is_verified = true;

-- ============================================
-- CLICK EVENTS (Analytics)
-- ============================================
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  user_id UUID,
  session_id TEXT,
  referrer TEXT,
  page_url TEXT,
  destination_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clicks_tool ON click_events(tool_id);
CREATE INDEX idx_clicks_deal ON click_events(deal_id);
CREATE INDEX idx_clicks_date ON click_events(created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update tool upvotes when votes change
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vote_change
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_tool_upvotes();

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_click_count(tool_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE tools SET click_count = click_count + 1 WHERE id = tool_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at
BEFORE UPDATE ON tools
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deals_updated_at
BEFORE UPDATE ON deals
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
