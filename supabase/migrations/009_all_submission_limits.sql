-- ============================================
-- COMPLETE submission limit enforcement
-- Safe to run multiple times (idempotent)
-- ============================================

-- 1. Add max_rewards_per_customer column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses'
    AND column_name = 'max_rewards_per_customer'
  ) THEN
    ALTER TABLE businesses ADD COLUMN max_rewards_per_customer integer DEFAULT 1;
  END IF;
END $$;

-- 2. Make sure existing businesses have the default (1)
UPDATE businesses
SET max_rewards_per_customer = 1
WHERE max_rewards_per_customer IS NULL;

-- 3. Normalize all existing submission emails to lowercase
UPDATE submissions
SET customer_email = LOWER(TRIM(customer_email))
WHERE customer_email IS DISTINCT FROM LOWER(TRIM(customer_email));

-- 4. Add unique index on (business_id, post_url) if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_submissions_business_post_url'
  ) THEN
    -- Remove duplicates first (keep earliest)
    DELETE FROM submissions
    WHERE id NOT IN (
      SELECT DISTINCT ON (business_id, post_url) id
      FROM submissions
      ORDER BY business_id, post_url, created_at ASC
    );
    CREATE UNIQUE INDEX idx_submissions_business_post_url
      ON submissions(business_id, post_url);
  END IF;
END $$;

-- 5. Create the BEFORE INSERT trigger function
CREATE OR REPLACE FUNCTION check_submission_limit()
RETURNS TRIGGER AS $$
DECLARE
  max_rewards integer;
  current_count integer;
  biz_name text;
BEGIN
  -- Normalize data before insert
  NEW.customer_email := LOWER(TRIM(NEW.customer_email));
  NEW.customer_name := TRIM(NEW.customer_name);
  NEW.post_url := TRIM(NEW.post_url);

  -- Get the business's limit setting
  SELECT b.max_rewards_per_customer, b.name
  INTO max_rewards, biz_name
  FROM businesses b
  WHERE b.id = NEW.business_id;

  -- null = unlimited, skip check
  IF max_rewards IS NULL THEN
    RETURN NEW;
  END IF;

  -- Count ALL existing submissions for this email + business
  SELECT COUNT(*) INTO current_count
  FROM submissions
  WHERE business_id = NEW.business_id
  AND customer_email = NEW.customer_email;

  IF current_count >= max_rewards THEN
    RAISE EXCEPTION 'LIMIT_REACHED:%', COALESCE(biz_name, 'this business');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Attach trigger (drop first if exists)
DROP TRIGGER IF EXISTS check_submission_limit_trigger ON submissions;
CREATE TRIGGER check_submission_limit_trigger
  BEFORE INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_submission_limit();
