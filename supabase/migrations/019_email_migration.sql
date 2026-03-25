-- Migration 019: SMS-to-Email migration
-- Revert customer communication from SMS/Twilio back to email via Resend
-- A2P 10DLC registration keeps getting rejected, switching to email

-- 1. Ensure customer_email column exists on submissions (it should from before SMS migration)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS customer_email text;

-- 2. Ensure customer_email column exists on rewards_sent
ALTER TABLE rewards_sent ADD COLUMN IF NOT EXISTS customer_email text;

-- 3. Email template columns on businesses table
--    (Repurpose from old legacy columns to new structured templates)
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS email_subject_confirmation text,
  ADD COLUMN IF NOT EXISTS email_body_confirmation text,
  ADD COLUMN IF NOT EXISTS email_confirmation_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_subject_approval text,
  ADD COLUMN IF NOT EXISTS email_body_approval text,
  ADD COLUMN IF NOT EXISTS email_approval_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_subject_rejection text,
  ADD COLUMN IF NOT EXISTS email_body_rejection text,
  ADD COLUMN IF NOT EXISTS email_rejection_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_reward_link text,
  ADD COLUMN IF NOT EXISTS email_reward_file_url text,
  ADD COLUMN IF NOT EXISTS email_reward_file_name text;

-- 4. email_log table
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('confirmation', 'approval', 'rejection')),
  subject text,
  status text DEFAULT 'sent',
  sent_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_log_business ON email_log(business_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_log_submission ON email_log(submission_id);

ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read their email_log" ON email_log
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Public can insert email_log" ON email_log
  FOR INSERT WITH CHECK (true);

-- 5. Index for email-based lookups
CREATE INDEX IF NOT EXISTS idx_submissions_business_email ON submissions(business_id, customer_email);
CREATE INDEX IF NOT EXISTS idx_rewards_sent_business_email ON rewards_sent(business_id, customer_email);

-- 6. Add customer_email to coupon_codes if not exists
ALTER TABLE coupon_codes ADD COLUMN IF NOT EXISTS customer_email text;

-- 7. Add email_sent / email_sent_at to coupon_codes
ALTER TABLE coupon_codes ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false;
ALTER TABLE coupon_codes ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;

-- 8. Update check_submission_limit() trigger to use email (with phone fallback for legacy)
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

  -- Normalize email if present
  IF NEW.customer_email IS NOT NULL THEN
    NEW.customer_email := LOWER(TRIM(NEW.customer_email));
  END IF;

  -- Normalize phone if present (backward compat)
  IF NEW.customer_phone IS NOT NULL THEN
    NEW.customer_phone := TRIM(NEW.customer_phone);
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

  -- Count existing submissions: prefer email, fall back to phone
  IF NEW.customer_email IS NOT NULL THEN
    SELECT COUNT(*) INTO current_count
    FROM submissions
    WHERE business_id = NEW.business_id
      AND LOWER(TRIM(customer_email)) = NEW.customer_email;
  ELSIF NEW.customer_phone IS NOT NULL THEN
    SELECT COUNT(*) INTO current_count
    FROM submissions
    WHERE business_id = NEW.business_id
      AND customer_phone = NEW.customer_phone;
  ELSE
    current_count := 0;
  END IF;

  IF current_count >= max_rewards THEN
    RAISE EXCEPTION 'LIMIT_REACHED:%', COALESCE(biz_name, 'this business');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-attach trigger
DROP TRIGGER IF EXISTS check_submission_limit_trigger ON submissions;
CREATE TRIGGER check_submission_limit_trigger
  BEFORE INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_submission_limit();

-- 9. Create reward-files storage bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('reward-files', 'reward-files', true)
ON CONFLICT (id) DO NOTHING;
