-- ============================================
-- Add review fields to submissions
-- ============================================

ALTER TABLE submissions
  ADD COLUMN reward_given text,
  ADD COLUMN review_comment text;
