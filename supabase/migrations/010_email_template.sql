-- ============================================
-- Email Template Fields for Businesses
-- ============================================

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS email_subject text,
  ADD COLUMN IF NOT EXISTS email_header text,
  ADD COLUMN IF NOT EXISTS email_body text,
  ADD COLUMN IF NOT EXISTS email_footer text,
  ADD COLUMN IF NOT EXISTS email_brand_color text,
  ADD COLUMN IF NOT EXISTS reward_file_url text,
  ADD COLUMN IF NOT EXISTS reward_file_name text;
