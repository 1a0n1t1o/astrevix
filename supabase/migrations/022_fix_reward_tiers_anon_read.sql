-- Migration 022: Fix anon reads of reward_tiers broken by migration 020 (M2)
-- ============================================================================
-- Migration 020 revoked anon's SELECT on `businesses` to stop direct scraping.
-- But `reward_tiers` carries a permissive SELECT policy, "Owners can read own
-- tiers", whose USING clause subqueries `businesses`:
--
--     business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
--
-- Postgres evaluates ALL permissive SELECT policies for a role and OR's them,
-- so when the anon role reads `reward_tiers` (the public landing page embeds
-- `reward_tiers(*)` via getBusinessBySlug), Postgres runs that subquery against
-- `businesses` — which anon no longer has SELECT on — and the whole request
-- fails with `42501 permission denied for table businesses`. getBusinessBySlug
-- then returns null and every /b/[slug] page 404s.
--
-- The owner-read policy is only ever meaningful for logged-in owners, so scope
-- it to the `authenticated` role. After this, anon's only applicable SELECT
-- policy on reward_tiers is "Public read active tiers" (USING is_active = true),
-- which touches no other table. `authenticated` still has SELECT on `businesses`
-- (020 only revoked it from anon), so the owner dashboard is unaffected, and the
-- M2 hardening (anon cannot read the businesses base table) stays intact.
-- ============================================================================

drop policy if exists "Owners can read own tiers" on public.reward_tiers;

create policy "Owners can read own tiers" on public.reward_tiers
  for select
  to authenticated
  using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );
