-- Migration 015: Fix foreign key constraints for proper user deletion
-- Without these, deleting a user from auth.users fails due to FK constraints

-- 1. invite_codes.claimed_by: SET NULL on user delete
ALTER TABLE invite_codes
  DROP CONSTRAINT IF EXISTS invite_codes_claimed_by_fkey;
ALTER TABLE invite_codes
  ADD CONSTRAINT invite_codes_claimed_by_fkey
    FOREIGN KEY (claimed_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. invite_codes.created_by: SET NULL on user delete
ALTER TABLE invite_codes
  DROP CONSTRAINT IF EXISTS invite_codes_created_by_fkey;
ALTER TABLE invite_codes
  ADD CONSTRAINT invite_codes_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Also make created_by nullable since it can now be null after user deletion
ALTER TABLE invite_codes ALTER COLUMN created_by DROP NOT NULL;

-- 3. businesses.owner_id: CASCADE on user delete
ALTER TABLE businesses
  DROP CONSTRAINT IF EXISTS businesses_owner_id_fkey;
ALTER TABLE businesses
  ADD CONSTRAINT businesses_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;
