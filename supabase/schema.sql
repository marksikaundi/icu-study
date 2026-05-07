create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique not null,
  username text unique not null,
  avatar_url text,
  campus text not null,
  city text,
  rating numeric(2,1) default 5.0,
  trust_score integer default 50,
  verified boolean default false,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  icon text
);

create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.users(id) on delete cascade,
  category_id uuid references public.categories(id),
  title text not null,
  description text not null,
  condition text not null,
  price numeric(10,2) not null,
  negotiable boolean default false,
  location text not null,
  campus text not null,
  images text[] default '{}',
  status text default 'active' check (status in ('active', 'sold', 'hidden', 'flagged')),
  featured_until timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete set null,
  buyer_id uuid not null references public.users(id) on delete cascade,
  seller_id uuid not null references public.users(id) on delete cascade,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (listing_id, buyer_id, seller_id)
);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  message_type text default 'text' check (message_type in ('text', 'image', 'offer', 'system')),
  body text,
  image_url text,
  offer_price numeric(10,2),
  seen_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.typing_status (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  is_typing boolean default false,
  updated_at timestamptz default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, listing_id)
);

create table if not exists public.saved_searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  query text not null,
  category text,
  city text,
  created_at timestamptz default now()
);

create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  target_user_id uuid references public.users(id),
  target_listing_id uuid references public.listings(id),
  reason text not null,
  notes text,
  status text default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan text not null check (plan in ('basic', 'premium')),
  active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.featured_payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  amount numeric(10,2) not null,
  currency text default 'USD',
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz default now()
);

create table if not exists public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  token text not null unique,
  platform text not null,
  created_at timestamptz default now()
);

create table if not exists public.admin_actions (
  id uuid primary key default uuid_generate_v4(),
  admin_user_id uuid not null references public.users(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  notes text,
  created_at timestamptz default now()
);

create or replace function public.current_user_row_id()
returns uuid
language sql
stable
as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.users where auth_user_id = auth.uid() and role = 'admin'
  );
$$;

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.typing_status enable row level security;
alter table public.favorites enable row level security;
alter table public.saved_searches enable row level security;
alter table public.reports enable row level security;
alter table public.subscriptions enable row level security;
alter table public.featured_payments enable row level security;
alter table public.push_tokens enable row level security;
alter table public.admin_actions enable row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own on public.users for select using (auth.uid() = auth_user_id or public.is_admin());
drop policy if exists users_update_own on public.users;
create policy users_update_own on public.users for update using (auth.uid() = auth_user_id) with check (auth.uid() = auth_user_id);
drop policy if exists users_insert_self on public.users;
create policy users_insert_self on public.users for insert with check (auth.uid() = auth_user_id);

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories for select using (true);

drop policy if exists listings_public_read on public.listings;
create policy listings_public_read on public.listings for select using (status = 'active' or seller_id = public.current_user_row_id() or public.is_admin());
drop policy if exists listings_owner_write on public.listings;
create policy listings_owner_write on public.listings for all using (seller_id = public.current_user_row_id() or public.is_admin()) with check (seller_id = public.current_user_row_id() or public.is_admin());

drop policy if exists conversations_member_all on public.conversations;
create policy conversations_member_all on public.conversations for all using (buyer_id = public.current_user_row_id() or seller_id = public.current_user_row_id() or public.is_admin()) with check (buyer_id = public.current_user_row_id() or seller_id = public.current_user_row_id() or public.is_admin());

drop policy if exists messages_member_all on public.messages;
create policy messages_member_all on public.messages for all using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = public.current_user_row_id() or c.seller_id = public.current_user_row_id() or public.is_admin())
  )
) with check (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = public.current_user_row_id() or c.seller_id = public.current_user_row_id() or public.is_admin())
  ) and (sender_id = public.current_user_row_id() or public.is_admin())
);

drop policy if exists typing_member_all on public.typing_status;
create policy typing_member_all on public.typing_status for all using (
  user_id = public.current_user_row_id()
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = public.current_user_row_id() or c.seller_id = public.current_user_row_id())
  )
) with check (
  user_id = public.current_user_row_id()
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = public.current_user_row_id() or c.seller_id = public.current_user_row_id())
  )
);

drop policy if exists favorites_owner_all on public.favorites;
create policy favorites_owner_all on public.favorites for all using (user_id = public.current_user_row_id() or public.is_admin()) with check (user_id = public.current_user_row_id() or public.is_admin());

drop policy if exists saved_search_owner_all on public.saved_searches;
create policy saved_search_owner_all on public.saved_searches for all using (user_id = public.current_user_row_id() or public.is_admin()) with check (user_id = public.current_user_row_id() or public.is_admin());

drop policy if exists reports_owner_or_admin on public.reports;
create policy reports_owner_or_admin on public.reports for select using (reporter_id = public.current_user_row_id() or public.is_admin());
drop policy if exists reports_insert_self on public.reports;
create policy reports_insert_self on public.reports for insert with check (reporter_id = public.current_user_row_id());
drop policy if exists reports_admin_update on public.reports;
create policy reports_admin_update on public.reports for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists subscriptions_owner_all on public.subscriptions;
create policy subscriptions_owner_all on public.subscriptions for all using (user_id = public.current_user_row_id() or public.is_admin()) with check (user_id = public.current_user_row_id() or public.is_admin());

drop policy if exists featured_payments_owner_all on public.featured_payments;
create policy featured_payments_owner_all on public.featured_payments for all using (user_id = public.current_user_row_id() or public.is_admin()) with check (user_id = public.current_user_row_id() or public.is_admin());

drop policy if exists push_tokens_owner_all on public.push_tokens;
create policy push_tokens_owner_all on public.push_tokens for all using (user_id = public.current_user_row_id() or public.is_admin()) with check (user_id = public.current_user_row_id() or public.is_admin());

drop policy if exists admin_actions_admin_only on public.admin_actions;
create policy admin_actions_admin_only on public.admin_actions for all using (public.is_admin()) with check (public.is_admin());
