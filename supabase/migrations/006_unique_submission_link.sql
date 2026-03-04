-- ============================================
-- Unique constraint on (business_id, post_url)
-- Prevents duplicate link submissions per business
-- ============================================

-- Remove any existing duplicates first (keep the earliest submission)
DELETE FROM submissions
WHERE id NOT IN (
  SELECT DISTINCT ON (business_id, post_url) id
  FROM submissions
  ORDER BY business_id, post_url, created_at ASC
);

-- Add unique constraint
CREATE UNIQUE INDEX idx_submissions_business_post_url
  ON submissions(business_id, post_url);
