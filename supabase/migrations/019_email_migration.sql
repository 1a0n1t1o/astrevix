-- Migration 019: SMS-to-Email migration
-- Fully replaces the SMS communication layer (Twilio) with email (Resend).
-- All sms_* columns are renamed to email_*, sms_log is dropped in favor of
-- email_log, and customer_phone is removed in favor of customer_email.

-- -----------------------------------------------------------------------
-- 1. businesses: rename sms_* template columns to email_*, add subjects
-- -----------------------------------------------------------------------
ALTER TABLE businesses RENAME COLUMN sms_confirmation_template TO email_confirmation_template;
ALTER TABLE businesses RENAME COLUMN sms_confirmation_enabled  TO email_confirmation_enabled;
ALTER TABLE businesses RENAME COLUMN sms_approval_template     TO email_approval_template;
ALTER TABLE businesses RENAME COLUMN sms_approval_enabled      TO email_approval_enabled;
ALTER TABLE businesses RENAME COLUMN sms_rejection_template    TO email_rejection_template;
ALTER TABLE businesses RENAME COLUMN sms_rejection_enabled     TO email_rejection_enabled;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS email_confirmation_subject text,
  ADD COLUMN IF NOT EXISTS email_approval_subject     text,
  ADD COLUMN IF NOT EXISTS email_rejection_subject    text;

-- -----------------------------------------------------------------------
-- 2. submissions: customer_email becomes required, drop customer_phone
-- -----------------------------------------------------------------------
-- customer_email column already exists (was made nullable in 013).
-- Backfill any null emails would need manual data work; leave nullable
-- at DB level to avoid breaking historical rows. API enforces NOT NULL.

DROP INDEX IF EXISTS idx_submissions_business_phone;
ALTER TABLE submissions DROP COLUMN IF EXISTS customer_phone;

CREATE INDEX IF NOT EXISTS idx_submissions_business_email
  ON submissions(business_id, customer_email);

-- -----------------------------------------------------------------------
-- 3. rewards_sent: drop customer_phone, keep customer_email
-- -----------------------------------------------------------------------
DROP INDEX IF EXISTS idx_rewards_sent_business_phone;
ALTER TABLE rewards_sent DROP COLUMN IF EXISTS customer_phone;

CREATE INDEX IF NOT EXISTS idx_rewards_sent_business_email
  ON rewards_sent(business_id, customer_email);

-- -----------------------------------------------------------------------
-- 4. coupon_codes: rename customer_phone -> customer_email, sms_sent -> email_sent
-- -----------------------------------------------------------------------
ALTER TABLE coupon_codes RENAME COLUMN customer_phone TO customer_email;
ALTER TABLE coupon_codes RENAME COLUMN sms_sent       TO email_sent;
ALTER TABLE coupon_codes RENAME COLUMN sms_sent_at    TO email_sent_at;

-- -----------------------------------------------------------------------
-- 5. Drop sms_log, create email_log
-- -----------------------------------------------------------------------
DROP TABLE IF EXISTS sms_log;

CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('confirmation', 'approval', 'rejection')),
  subject text,
  message_body text NOT NULL,
  resend_id text,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_log_business   ON email_log(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_log_submission ON email_log(submission_id);

ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read their email_log" ON email_log
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Public can insert email_log" ON email_log
  FOR INSERT WITH CHECK (true);

-- -----------------------------------------------------------------------
-- 6. Rewrite check_submission_limit() trigger to use email only
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_submission_limit()
RETURNS TRIGGER AS $$
DECLARE
  max_rewards integer;
  current_count integer;
  biz_name text;
BEGIN
  -- Normalize data before insert
  NEW.customer_name := TRIM(NEW.customer_name);
  NEW.post_url := TRIM(NEW.post_url);

  IF NEW.customer_email IS NOT NULL THEN
    NEW.customer_email := LOWER(TRIM(NEW.customer_email));
  END IF;

  -- Get the business's limit setting
  SELECT b.max_rewards_per_customer, b.name
  INTO max_rewards, biz_name
  FROM businesses b
  WHERE b.id = NEW.business_id;

  -- null = unlimited, skip check
  IF max_rewards IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.customer_email IS NOT NULL THEN
    SELECT COUNT(*) INTO current_count
    FROM submissions
    WHERE business_id = NEW.business_id
      AND LOWER(TRIM(customer_email)) = NEW.customer_email;
  ELSE
    current_count := 0;
  END IF;

  IF current_count >= max_rewards THEN
    RAISE EXCEPTION 'LIMIT_REACHED:%', COALESCE(biz_name, 'this business');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_submission_limit_trigger ON submissions;
CREATE TRIGGER check_submission_limit_trigger
  BEFORE INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_submission_limit();
