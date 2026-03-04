-- ============================================
-- Normalize existing submission emails to lowercase
-- Ensures consistent case-insensitive matching
-- ============================================

UPDATE submissions
SET customer_email = LOWER(TRIM(customer_email))
WHERE customer_email IS DISTINCT FROM LOWER(TRIM(customer_email));
