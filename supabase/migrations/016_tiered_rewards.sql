-- Migration 016: Tiered Rewards system
-- Adds reward_tiers table and verification fields to submissions

-- ============================================
-- 1. Create reward_tiers table
-- ============================================

CREATE TABLE reward_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tier_name text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'facebook', 'google')),
  content_type text NOT NULL,
  reward_description text NOT NULL,
  reward_value text,
  verification_hours integer NOT NULL DEFAULT 72
    CHECK (verification_hours >= 24 AND verification_hours <= 120),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_reward_tiers_business_id ON reward_tiers(business_id);
CREATE INDEX idx_reward_tiers_business_active ON reward_tiers(business_id, is_active)
  WHERE is_active = true;

-- ============================================
-- 2. RLS policies for reward_tiers
-- ============================================

ALTER TABLE reward_tiers ENABLE ROW LEVEL SECURITY;

-- Public can read active tiers (customer landing pages)
CREATE POLICY "Public read active tiers" ON reward_tiers
  FOR SELECT USING (is_active = true);

-- Owners can read all their tiers (including inactive)
CREATE POLICY "Owners can read own tiers" ON reward_tiers
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Owners can insert tiers for their business
CREATE POLICY "Owners can insert own tiers" ON reward_tiers
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Owners can update their own tiers
CREATE POLICY "Owners can update own tiers" ON reward_tiers
  FOR UPDATE USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Owners can delete their own tiers
CREATE POLICY "Owners can delete own tiers" ON reward_tiers
  FOR DELETE USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- ============================================
-- 3. Add verification fields to submissions
-- ============================================

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS reward_tier_id uuid REFERENCES reward_tiers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_deadline timestamptz,
  ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'expired', 'failed')),
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- Indexes for verification queries
CREATE INDEX IF NOT EXISTS idx_submissions_verification
  ON submissions(verification_status, verification_deadline);
CREATE INDEX IF NOT EXISTS idx_submissions_reward_tier
  ON submissions(reward_tier_id);
