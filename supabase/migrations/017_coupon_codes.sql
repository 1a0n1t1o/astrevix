-- Migration 017: Coupon Code system
-- Auto-generates unique coupon codes when submissions are approved.
-- Codes are included in the approval SMS and displayed on the submissions review page.

-- 1. Create coupon_codes table
CREATE TABLE coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE UNIQUE,
  reward_tier_id uuid REFERENCES reward_tiers(id) ON DELETE SET NULL,
  code text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  reward_description text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  sms_sent boolean DEFAULT false,
  sms_sent_at timestamptz,
  used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 2. Indexes for common queries
CREATE INDEX idx_coupon_codes_business_id ON coupon_codes(business_id);
CREATE INDEX idx_coupon_codes_submission_id ON coupon_codes(submission_id);
CREATE INDEX idx_coupon_codes_code ON coupon_codes(code);
CREATE INDEX idx_coupon_codes_status ON coupon_codes(business_id, status);

-- 3. RLS policies
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;

-- Owners can view their coupon codes
CREATE POLICY "Owners can read their coupon codes" ON coupon_codes
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Owners can update their coupon codes (mark as used, etc.)
CREATE POLICY "Owners can update their coupon codes" ON coupon_codes
  FOR UPDATE USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Permissive insert (API routes create coupons on approval, matches sms_log pattern)
CREATE POLICY "Allow insert coupon codes" ON coupon_codes
  FOR INSERT WITH CHECK (true);

-- 4. Add coupon expiry setting to businesses table
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS default_coupon_expiry_days integer DEFAULT 30;
