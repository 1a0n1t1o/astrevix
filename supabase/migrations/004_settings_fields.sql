-- ============================================
-- Settings Page: Business Info + QR Defaults
-- ============================================

-- Business Information fields
ALTER TABLE businesses
  ADD COLUMN category text,
  ADD COLUMN phone text,
  ADD COLUMN address_street text,
  ADD COLUMN address_city text,
  ADD COLUMN address_state text,
  ADD COLUMN address_zip text,
  ADD COLUMN website text,
  ADD COLUMN operating_hours jsonb DEFAULT '{}';

-- QR/NFC default settings
ALTER TABLE businesses
  ADD COLUMN qr_default_redirect_url text,
  ADD COLUMN qr_default_fallback text DEFAULT 'landing_page',
  ADD COLUMN qr_default_branding boolean DEFAULT true;
