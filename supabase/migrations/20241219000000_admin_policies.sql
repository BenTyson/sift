-- Admin Policies for Submissions
-- Allows users with is_admin=true in profiles to manage all submissions

-- Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin) WHERE is_admin = true;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for tool_submissions
CREATE POLICY "Admins can view all tool submissions"
  ON tool_submissions FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update all tool submissions"
  ON tool_submissions FOR UPDATE
  USING (is_admin());

-- Admin policies for deal_submissions
CREATE POLICY "Admins can view all deal submissions"
  ON deal_submissions FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update all deal submissions"
  ON deal_submissions FOR UPDATE
  USING (is_admin());

-- Admin policies for newsletter_subscribers (view only for now)
CREATE POLICY "Admins can view all newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (is_admin());
