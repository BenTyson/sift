-- Tool Submissions Table
-- Stores user-submitted tools awaiting review

CREATE TABLE tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Submitter
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT NOT NULL,

  -- Optional Info
  logo_url TEXT,
  pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise', 'open_source')),
  features TEXT[] DEFAULT '{}',

  -- Category
  category_ids UUID[] DEFAULT '{}',

  -- Review Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,

  -- If approved, link to created tool
  approved_tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tool_submissions_status ON tool_submissions(status);
CREATE INDEX idx_tool_submissions_user ON tool_submissions(submitted_by);
CREATE INDEX idx_tool_submissions_created ON tool_submissions(created_at DESC);

-- Updated at trigger
CREATE TRIGGER tool_submissions_updated_at
BEFORE UPDATE ON tool_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies for tool_submissions
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON tool_submissions FOR SELECT
  USING (auth.uid() = submitted_by);

-- Users can create submissions
CREATE POLICY "Users can create submissions"
  ON tool_submissions FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- Users can update their pending submissions
CREATE POLICY "Users can update pending submissions"
  ON tool_submissions FOR UPDATE
  USING (auth.uid() = submitted_by AND status = 'pending')
  WITH CHECK (auth.uid() = submitted_by AND status = 'pending');

-- Deal Submissions Table
-- Stores user-submitted deals awaiting review

CREATE TABLE deal_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Submitter
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Associated Tool
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  tool_name TEXT, -- For new tools not yet in system
  tool_url TEXT,  -- For new tools not yet in system

  -- Deal Info
  deal_type TEXT CHECK (deal_type IN ('ltd', 'discount', 'coupon', 'trial', 'free')),
  title TEXT NOT NULL,
  description TEXT,

  -- Pricing
  original_price DECIMAL(10,2),
  deal_price DECIMAL(10,2),
  discount_percent INT,
  coupon_code TEXT,

  -- Link
  deal_url TEXT NOT NULL,

  -- Validity
  expires_at TIMESTAMPTZ,

  -- Review Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,

  -- If approved, link to created deal
  approved_deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_deal_submissions_status ON deal_submissions(status);
CREATE INDEX idx_deal_submissions_user ON deal_submissions(submitted_by);
CREATE INDEX idx_deal_submissions_tool ON deal_submissions(tool_id);
CREATE INDEX idx_deal_submissions_created ON deal_submissions(created_at DESC);

-- Updated at trigger
CREATE TRIGGER deal_submissions_updated_at
BEFORE UPDATE ON deal_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies for deal_submissions
ALTER TABLE deal_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own deal submissions"
  ON deal_submissions FOR SELECT
  USING (auth.uid() = submitted_by);

-- Users can create deal submissions
CREATE POLICY "Users can create deal submissions"
  ON deal_submissions FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- Users can update their pending deal submissions
CREATE POLICY "Users can update pending deal submissions"
  ON deal_submissions FOR UPDATE
  USING (auth.uid() = submitted_by AND status = 'pending')
  WITH CHECK (auth.uid() = submitted_by AND status = 'pending');
