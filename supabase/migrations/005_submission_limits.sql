-- ============================================
-- Submission Limits + Reward Tracking
-- ============================================

-- Add max_rewards_per_customer to businesses
-- Default 1 = one reward per email per business. NULL = unlimited.
ALTER TABLE businesses
  ADD COLUMN max_rewards_per_customer integer DEFAULT 1;

-- Rewards sent tracking table (audit trail)
CREATE TABLE rewards_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  customer_email text NOT NULL,
  reward_type text,
  sent_at timestamptz DEFAULT now()
);

-- Index for the limit-check query: how many rewards for this email + business
CREATE INDEX idx_rewards_sent_business_email
  ON rewards_sent(business_id, customer_email);

-- Unique constraint to prevent duplicate reward sends for the same submission
CREATE UNIQUE INDEX idx_rewards_sent_submission_unique
  ON rewards_sent(submission_id);

-- ============================================
-- RLS for rewards_sent
-- ============================================
ALTER TABLE rewards_sent ENABLE ROW LEVEL SECURITY;

-- Public read so anon client can count rewards for limit checks
CREATE POLICY "Public read rewards_sent for limit check" ON rewards_sent
  FOR SELECT USING (true);

-- Authenticated owners can insert rewards for their businesses
CREATE POLICY "Owners can insert rewards_sent" ON rewards_sent
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );
