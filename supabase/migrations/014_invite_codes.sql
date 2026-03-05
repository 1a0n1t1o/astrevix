-- Migration 014: Invite codes for gated signups
-- Allows admins to generate invite codes that restrict signup access

CREATE TABLE IF NOT EXISTS invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  business_name text,
  business_email text,
  max_uses integer NOT NULL DEFAULT 1,
  times_used integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'used', 'expired', 'revoked')),
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  claimed_by uuid REFERENCES auth.users(id),
  claimed_at timestamptz
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_status ON invite_codes(status);
CREATE INDEX IF NOT EXISTS idx_invite_codes_created_by ON invite_codes(created_by);

-- Enable RLS — no public policies needed.
-- All access goes through getSupabaseAdmin() (service role key, bypasses RLS).
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
