-- Aircraft City Model demo: database setup
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: it only creates things that don't exist yet and replaces policies.

-- ---------------------------------------------------------------
-- Admins (the owner's account, used by the control panel later)
-- ---------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------
-- Inquiries: Customize form, chatbot handoffs, general questions
-- ---------------------------------------------------------------
create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  source text not null default 'website'
    check (source in ('website', 'chatbot', 'checkout')),
  inquiry_type text not null default 'General'
    check (inquiry_type in ('General', 'Purchase', 'Custom Order', 'Bulk Order',
      'Business Partnership', 'Shipping', 'Damage Report', 'Feedback / Complaint')),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  email text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (char_length(phone) <= 40),
  country text check (char_length(country) <= 80),
  product_slug text check (char_length(product_slug) <= 200),
  product_name text check (char_length(product_name) <= 200),
  quantity int check (quantity between 1 and 10000),
  message text not null check (char_length(message) between 1 and 5000),
  reference_image_path text check (char_length(reference_image_path) <= 300),
  is_urgent boolean not null default false,
  status text not null default 'New' check (status in ('New', 'Replied', 'Closed')),
  emailed_at timestamptz,
  user_id uuid default auth.uid() references auth.users on delete set null
);
alter table public.inquiries enable row level security;

drop policy if exists "anyone can send an inquiry" on public.inquiries;
create policy "anyone can send an inquiry" on public.inquiries
  for insert to anon, authenticated
  with check (status = 'New' and emailed_at is null and (user_id is null or user_id = auth.uid()));

drop policy if exists "read own inquiries or admin" on public.inquiries;
create policy "read own inquiries or admin" on public.inquiries
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin updates inquiries" on public.inquiries;
create policy "admin updates inquiries" on public.inquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin deletes inquiries" on public.inquiries;
create policy "admin deletes inquiries" on public.inquiries
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------
-- Orders (demo checkout, no payment). Status follows the real process.
-- ---------------------------------------------------------------
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  order_number text not null unique
    default ('ACM-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text), 1, 5))),
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  email text not null check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 40),
  country text not null check (char_length(country) between 1 and 80),
  notes text check (char_length(notes) <= 3000),
  subtotal numeric(10, 2),
  has_custom_items boolean not null default false,
  status text not null default 'Pending review'
    check (status in ('Pending review', 'Design takeoff', 'Artwork approval', 'In production',
      'Quality check', 'Shipped', 'Delivered', 'Cancelled'))
);
alter table public.orders enable row level security;

drop policy if exists "users place own orders" on public.orders;
create policy "users place own orders" on public.orders
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'Pending review');

drop policy if exists "read own orders or admin" on public.orders;
create policy "read own orders or admin" on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin updates orders" on public.orders;
create policy "admin updates orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders on delete cascade,
  product_slug text not null,
  product_name text not null,
  category text,
  size_name text,
  unit_price numeric(10, 2),
  quantity int not null check (quantity between 1 and 10000),
  details text check (char_length(details) <= 3000),
  specs text check (char_length(specs) <= 3000),
  requests text check (char_length(requests) <= 3000),
  image_url text
);
alter table public.order_items enable row level security;

drop policy if exists "users add items to own orders" on public.order_items;
create policy "users add items to own orders" on public.order_items
  for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

drop policy if exists "read own items or admin" on public.order_items;
create policy "read own items or admin" on public.order_items
  for select to authenticated
  using (public.is_admin() or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

-- ---------------------------------------------------------------
-- Reference images for custom requests (private; 5 MB images only)
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('inquiry-references', 'inquiry-references', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "anyone uploads reference images" on storage.objects;
create policy "anyone uploads reference images" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'inquiry-references');

drop policy if exists "admin reads reference images" on storage.objects;
create policy "admin reads reference images" on storage.objects
  for select to authenticated
  using (bucket_id = 'inquiry-references' and public.is_admin());

-- ---------------------------------------------------------------
-- After the owner (or your test admin) signs up on the demo site, make them admin:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'OWNER_EMAIL_HERE';
-- ---------------------------------------------------------------
