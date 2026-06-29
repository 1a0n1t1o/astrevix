-- Migration 020: Restrict anonymous access to the businesses table (M2)
-- ============================================================================
-- The "Public read active businesses" RLS policy exposed every column of
-- `businesses` to the anon role (owner_id, phone/address PII, internal email
-- templates, plan, qr settings, etc.) — anyone could scrape it directly via
-- PostgREST with the public anon key.
--
-- Fix: expose ONLY the columns the public landing page needs through a view,
-- and revoke anon's direct SELECT on the base table. This is a definer view
-- (NOT security_invoker), so anon needs SELECT on the view only, never on the
-- base table. The `deleted_at IS NULL` filter replaces the old RLS predicate.
--
-- The `authenticated` role keeps its grant on `businesses`, so the owner
-- dashboard (RLS-scoped to auth.uid()) and service-role admin paths are
-- unaffected. App code: lib/data.ts (getBusinessBySlug) and
-- api/submissions/create both read `public_businesses` instead of `businesses`.
-- ============================================================================

create or replace view public.public_businesses as
select
  id,
  slug,
  name,
  logo_url,
  logo_emoji,
  tagline,
  brand_color,
  reward_description,
  content_type,
  requirements,
  max_rewards_per_customer,
  terms_conditions,
  status
from public.businesses
where deleted_at is null;

-- Anon (public landing + submission create) and authenticated read the view.
grant select on public.public_businesses to anon, authenticated;

-- Remove anon's direct access to the base table.
revoke select on public.businesses from anon;

-- The old anon-facing policy is now dead (anon has no table grant). Drop it to
-- avoid implying anon can still read the base table.
drop policy if exists "Public read active businesses" on public.businesses;
