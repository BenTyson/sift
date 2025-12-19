-- RLS Policies for User Authentication
-- Run this migration to enable Row Level Security

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

-- Function to create profile on user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run on auth.users insert
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ENABLE RLS ON ALL USER-RELATED TABLES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Public profiles can be read by anyone (for future leaderboards)
CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (true);

-- ============================================
-- VOTES POLICIES
-- ============================================

-- Anyone can view votes (for displaying vote counts)
CREATE POLICY "Votes are viewable"
  ON votes FOR SELECT
  USING (true);

-- Users can insert their own votes
CREATE POLICY "Users can vote"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update own votes"
  ON votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- DEAL ALERTS POLICIES
-- ============================================

-- Users can view their own alerts
CREATE POLICY "Users can view own alerts"
  ON deal_alerts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own alerts
CREATE POLICY "Users can create alerts"
  ON deal_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own alerts
CREATE POLICY "Users can update own alerts"
  ON deal_alerts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own alerts"
  ON deal_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CLICK EVENTS POLICIES
-- ============================================

-- Anyone can insert click events (for analytics)
CREATE POLICY "Anyone can log clicks"
  ON click_events FOR INSERT
  WITH CHECK (true);

-- Only service role can read click events (admin only)
CREATE POLICY "Service role can read clicks"
  ON click_events FOR SELECT
  USING (auth.role() = 'service_role');

-- ============================================
-- PUBLIC READ TABLES (no RLS needed)
-- ============================================
-- Tools, deals, categories are public read
-- These don't need RLS as they're publicly readable

-- Enable RLS but allow public read
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Tools are publicly viewable"
  ON tools FOR SELECT
  USING (true);

CREATE POLICY "Deals are publicly viewable"
  ON deals FOR SELECT
  USING (true);

CREATE POLICY "Categories are publicly viewable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Tool categories are publicly viewable"
  ON tool_categories FOR SELECT
  USING (true);

-- Service role can manage all public data
CREATE POLICY "Service role manages tools"
  ON tools FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages deals"
  ON deals FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages categories"
  ON categories FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages tool_categories"
  ON tool_categories FOR ALL
  USING (auth.role() = 'service_role');

-- Newsletter: public insert, service role manages
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages newsletter"
  ON newsletter_subscribers FOR ALL
  USING (auth.role() = 'service_role');
