-- ============================================
-- Database trigger to enforce per-customer submission limits
-- Runs BEFORE INSERT so RLS doesn't matter — this executes
-- inside Postgres with full table access.
-- ============================================

CREATE OR REPLACE FUNCTION check_submission_limit()
RETURNS TRIGGER AS $$
DECLARE
  max_rewards integer;
  current_count integer;
  biz_name text;
BEGIN
  -- Normalize email before insert
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
  AND LOWER(TRIM(customer_email)) = NEW.customer_email;

  IF current_count >= max_rewards THEN
    RAISE EXCEPTION 'LIMIT_REACHED:%', COALESCE(biz_name, 'this business');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to submissions table
DROP TRIGGER IF EXISTS check_submission_limit_trigger ON submissions;
CREATE TRIGGER check_submission_limit_trigger
  BEFORE INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_submission_limit();
