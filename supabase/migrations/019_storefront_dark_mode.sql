-- Add storefront dark mode toggle for customer-facing pages
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS storefront_dark_mode boolean DEFAULT false;
