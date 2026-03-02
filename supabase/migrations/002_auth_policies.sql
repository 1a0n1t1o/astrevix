-- ============================================
-- Add owner_id to businesses + Auth RLS policies
-- ============================================

-- Add owner_id column (nullable for seed/legacy data)
alter table businesses
  add column owner_id uuid references auth.users(id);

-- Create index for efficient owner lookups
create index idx_businesses_owner_id on businesses(owner_id);

-- ============================================
-- Business Owner RLS policies
-- ============================================

-- Owners can update their own businesses
create policy "Owners can update own businesses" on businesses
  for update using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Owners can delete their own businesses
create policy "Owners can delete own businesses" on businesses
  for delete using (auth.uid() = owner_id);

-- Authenticated users can insert businesses (with their own owner_id)
create policy "Auth users can insert businesses" on businesses
  for insert with check (auth.uid() = owner_id);

-- ============================================
-- Submission RLS policies for business owners
-- ============================================

-- Owners can read submissions for their businesses
create policy "Owners can read own submissions" on submissions
  for select using (
    business_id in (
      select id from businesses where owner_id = auth.uid()
    )
  );

-- Owners can update submissions for their businesses (approve/reject)
create policy "Owners can update own submissions" on submissions
  for update using (
    business_id in (
      select id from businesses where owner_id = auth.uid()
    )
  );

-- ============================================
-- QR scans RLS policies for business owners
-- ============================================

-- Owners can read QR scans for their businesses
create policy "Owners can read own qr_scans" on qr_scans
  for select using (
    business_id in (
      select id from businesses where owner_id = auth.uid()
    )
  );
