-- Migration 021: Stop anon from reading customer PII out of rewards_sent (H1)
-- ============================================================================
-- rewards_sent had a public-read RLS policy (USING (true)), so anyone with the
-- public anon key could scrape every customer's email + which business rewarded
-- them straight off PostgREST. The per-customer limit check does NOT need this
-- (the BEFORE INSERT trigger counts `submissions`, and runs with full access).
--
-- Replace the public-read policy with an owner-scoped one, and revoke anon's
-- table grant entirely (no anonymous code path reads this table — the owner
-- read in api/submissions/[id]/status runs as the authenticated role, and admin
-- reads use the service-role client which bypasses RLS).
-- ============================================================================

drop policy if exists "Public read rewards_sent for limit check" on public.rewards_sent;

create policy "Owners read own rewards_sent" on public.rewards_sent
  for select using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

revoke select on public.rewards_sent from anon;
