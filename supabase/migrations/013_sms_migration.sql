-- Migration 013: Email-to-SMS migration
-- Replace email-based customer communication with SMS via Twilio

-- 1. submissions table: add phone, make email nullable
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE submissions ALTER COLUMN customer_email DROP NOT NULL;

-- 2. rewards_sent table: add phone, make email nullable
ALTER TABLE rewards_sent ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE rewards_sent ALTER COLUMN customer_email DROP NOT NULL;

-- 3. businesses table: SMS template fields
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS sms_confirmation_template text,
  ADD COLUMN IF NOT EXISTS sms_confirmation_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sms_approval_template text,
  ADD COLUMN IF NOT EXISTS sms_approval_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sms_rejection_template text,
  ADD COLUMN IF NOT EXISTS sms_rejection_enabled boolean DEFAULT false;

-- 4. sms_log table
CREATE TABLE IF NOT EXISTS sms_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  customer_phone text NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('confirmation', 'approval', 'rejection')),
  message_body text NOT NULL,
  twilio_sid text,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_log_business ON sms_log(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_log_submission ON sms_log(submission_id);

ALTER TABLE sms_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read their sms_log" ON sms_log
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Public can insert sms_log" ON sms_log
  FOR INSERT WITH CHECK (true);

-- 5. Indexes for phone-based lookups
CREATE INDEX IF NOT EXISTS idx_submissions_business_phone ON submissions(business_id, customer_phone);
CREATE INDEX IF NOT EXISTS idx_rewards_sent_business_phone ON rewards_sent(business_id, customer_phone);

-- 6. Update check_submission_limit() trigger to use phone (with email fallback)
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

  -- Normalize email if present (backward compat)
  IF NEW.customer_email IS NOT NULL THEN
    NEW.customer_email := LOWER(TRIM(NEW.customer_email));
  END IF;

  -- Normalize phone if present
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

  -- Count existing submissions: prefer phone, fall back to email
  IF NEW.customer_phone IS NOT NULL THEN
    SELECT COUNT(*) INTO current_count
    FROM submissions
    WHERE business_id = NEW.business_id
      AND customer_phone = NEW.customer_phone;
  ELSIF NEW.customer_email IS NOT NULL THEN
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

-- Re-attach trigger
DROP TRIGGER IF EXISTS check_submission_limit_trigger ON submissions;
CREATE TRIGGER check_submission_limit_trigger
  BEFORE INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_submission_limit();
