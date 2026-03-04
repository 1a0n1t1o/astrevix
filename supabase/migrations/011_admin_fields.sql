-- ============================================
-- 011: Admin Dashboard Fields
-- ============================================
-- Adds plan, status, and soft-delete columns to businesses table.
-- Admin users are identified by is_admin: true in auth.users.raw_user_meta_data.
--
-- IMPORTANT: After running this migration, set is_admin on your account:
--   Go to Supabase Dashboard → Authentication → Users → Click your user
--   → Edit user metadata → Add: { "is_admin": true }
--
-- Or via SQL:
--   UPDATE auth.users
--   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
--   WHERE email = 'YOUR_ADMIN_EMAIL';
-- ============================================

-- Add plan column (free, pro, enterprise)
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';

-- Add check constraint for plan values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'businesses_plan_check'
  ) THEN
    ALTER TABLE businesses
      ADD CONSTRAINT businesses_plan_check
      CHECK (plan IN ('free', 'pro', 'enterprise'));
  END IF;
END $$;

-- Add status column (active, suspended)
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Add check constraint for status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'businesses_status_check'
  ) THEN
    ALTER TABLE businesses
      ADD CONSTRAINT businesses_status_check
      CHECK (status IN ('active', 'suspended'));
  END IF;
END $$;

-- Add soft delete timestamp
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_plan ON businesses(plan);
CREATE INDEX IF NOT EXISTS idx_businesses_deleted_at ON businesses(deleted_at);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at);

-- Update RLS: public reads should exclude soft-deleted businesses
DROP POLICY IF EXISTS "Public read access" ON businesses;
DROP POLICY IF EXISTS "Public read active businesses" ON businesses;
CREATE POLICY "Public read active businesses" ON businesses
  FOR SELECT USING (deleted_at IS NULL);
