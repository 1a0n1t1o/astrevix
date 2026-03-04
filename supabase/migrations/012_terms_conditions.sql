-- Add terms_conditions field to businesses table
-- When NULL, the storefront displays a default legal disclaimer

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS terms_conditions text;
