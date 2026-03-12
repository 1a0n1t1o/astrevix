-- Add subscription tracking columns to businesses table
ALTER TABLE businesses
  ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'inactive',
  ADD COLUMN whop_membership_id TEXT,
  ADD COLUMN subscription_activated_at TIMESTAMPTZ;

-- Constrain allowed values
ALTER TABLE businesses
  ADD CONSTRAINT businesses_subscription_status_check
  CHECK (subscription_status IN ('inactive', 'active', 'cancelled', 'past_due'));

-- Index for quick lookups
CREATE INDEX idx_businesses_subscription_status ON businesses (subscription_status);
