-- ============================================
-- Astrevix Initial Schema
-- ============================================

-- Businesses table
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  tagline text,
  logo_url text,
  logo_emoji text default '🏪',
  brand_color text default '#E8553A',
  reward_description text not null,
  content_type text default 'Instagram Reel or TikTok',
  requirements text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Submissions table
create table submissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  post_url text not null,
  detected_platform text,
  customer_name text not null,
  customer_email text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- QR scans tracking table
create table qr_scans (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  scanned_at timestamptz default now(),
  user_agent text
);

-- ============================================
-- Row Level Security
-- ============================================

alter table businesses enable row level security;
alter table submissions enable row level security;
alter table qr_scans enable row level security;

-- Anyone can read businesses (public landing pages)
create policy "Public read access" on businesses
  for select using (true);

-- Anyone can insert submissions (customers submit without auth)
create policy "Public insert access" on submissions
  for insert with check (true);

-- Anyone can insert QR scans
create policy "Public insert access" on qr_scans
  for insert with check (true);

-- ============================================
-- Seed Data
-- ============================================

insert into businesses (name, slug, tagline, logo_emoji, brand_color, reward_description, content_type, requirements)
values (
  'Sunrise Café',
  'sunrise-cafe',
  'Where every morning feels golden',
  '☀️',
  '#E8553A',
  '$10 off your next visit',
  'Instagram Reel or TikTok',
  array['Tag @sunrisecafe in your post', 'Show your food or drink', 'Use #SunriseCafe', 'Post must be public']
);
