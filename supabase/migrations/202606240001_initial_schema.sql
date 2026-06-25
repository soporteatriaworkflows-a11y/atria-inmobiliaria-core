create extension if not exists "pgcrypto";

create type public.app_role as enum ('platform_admin', 'estate_admin', 'accountant', 'owner_readonly');
create type public.financial_status as enum ('draft', 'review', 'posted', 'reversed');
create type public.closing_status as enum ('draft', 'review', 'published', 'reopened');
create type public.request_status as enum ('pending_review', 'approved', 'rejected', 'cancelled');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  profile_id uuid not null references public.profiles(id),
  role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, profile_id, role)
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  code text not null,
  display_name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table public.participation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  property_id uuid references public.properties(id),
  participant_profile_id uuid not null references public.profiles(id),
  basis_points integer not null check (basis_points >= 0 and basis_points <= 10000),
  effective_from date not null,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_to >= effective_from)
);

create table public.property_access (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  property_id uuid not null references public.properties(id),
  profile_id uuid not null references public.profiles(id),
  can_view boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, profile_id)
);

create table public.rent_collections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  property_id uuid not null references public.properties(id),
  period_month date not null,
  amount_cop numeric(14,0) not null check (amount_cop >= 0),
  status public.financial_status not null default 'draft',
  source text not null default 'manual',
  posted_at timestamptz,
  reversed_entry_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  property_id uuid references public.properties(id),
  period_month date not null,
  category text not null,
  description text not null,
  amount_cop numeric(14,0) not null check (amount_cop >= 0),
  status public.financial_status not null default 'draft',
  posted_at timestamptz,
  reversed_entry_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recurring_expenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  label text not null,
  amount_cop numeric(14,0) not null check (amount_cop >= 0),
  starts_on date not null,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on)
);

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  period_month date not null,
  entry_type text not null,
  amount_cop numeric(14,0) not null,
  memo text not null,
  source_table text,
  source_id uuid,
  reversal_of uuid references public.ledger_entries(id),
  created_at timestamptz not null default now()
);

create table public.monthly_closings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  period_month date not null,
  status public.closing_status not null default 'draft',
  snapshot jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, period_month)
);

create table public.heir_liquidations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  monthly_closing_id uuid not null references public.monthly_closings(id),
  participant_profile_id uuid not null references public.profiles(id),
  rental_collections_cop numeric(14,0) not null,
  expense_participation_cop numeric(14,0) not null,
  total_participation_cop numeric(14,0) not null,
  previous_balance_cop numeric(14,0) not null default 0,
  pending_payable_cop numeric(14,0) not null default 0,
  manual_adjustments_cop numeric(14,0) not null default 0,
  accumulated_balance_cop numeric(14,0) not null,
  amount_to_pay_cop numeric(14,0) not null,
  created_at timestamptz not null default now()
);

create table public.change_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  requested_by uuid references public.profiles(id),
  request_type text not null,
  status public.request_status not null default 'pending_review',
  details jsonb not null default '{}'::jsonb,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  related_table text not null,
  related_id uuid not null,
  bucket text not null,
  object_path text not null,
  review_status public.request_status not null default 'pending_review',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id),
  actor_profile_id uuid references public.profiles(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index memberships_profile_idx on public.memberships(profile_id);
create index properties_org_idx on public.properties(organization_id);
create index rent_collections_org_month_idx on public.rent_collections(organization_id, period_month);
create index expenses_org_month_idx on public.expenses(organization_id, period_month);
create index ledger_entries_org_month_idx on public.ledger_entries(organization_id, period_month);
create index audit_log_org_created_idx on public.audit_log(organization_id, created_at desc);

create or replace function public.current_user_role(target_organization_id uuid)
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select m.role
  from public.memberships m
  where m.organization_id = target_organization_id
    and m.profile_id = auth.uid()
  order by
    case m.role
      when 'platform_admin' then 1
      when 'estate_admin' then 2
      when 'accountant' then 3
      when 'owner_readonly' then 4
    end
  limit 1
$$;

create or replace function public.is_staff(target_organization_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role(target_organization_id) in ('platform_admin', 'estate_admin', 'accountant')
$$;

create or replace function public.is_member(target_organization_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.memberships m
    where m.organization_id = target_organization_id
      and m.profile_id = auth.uid()
  )
$$;

create or replace function public.block_audit_log_update_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_log is append-only';
end;
$$;

create trigger audit_log_append_only
before update or delete on public.audit_log
for each row execute function public.block_audit_log_update_delete();

create or replace function public.block_posted_financial_update_delete()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'financial records are append-only; create reversal entries instead';
  end if;

  if old.status = 'posted' then
    raise exception 'posted financial records are immutable; create reversal entries instead';
  end if;

  return new;
end;
$$;

create or replace function public.block_ledger_update_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'ledger_entries are append-only; create reversal entries instead';
end;
$$;

create or replace function public.block_published_closing_update_delete()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'published' then
    raise exception 'published monthly closings are immutable; use explicit reopen workflow';
  end if;

  return new;
end;
$$;

create trigger rent_collections_no_posted_update_delete
before update or delete on public.rent_collections
for each row execute function public.block_posted_financial_update_delete();

create trigger expenses_no_posted_update_delete
before update or delete on public.expenses
for each row execute function public.block_posted_financial_update_delete();

create trigger ledger_entries_append_only
before update or delete on public.ledger_entries
for each row execute function public.block_ledger_update_delete();

create trigger monthly_closings_published_immutable
before update or delete on public.monthly_closings
for each row execute function public.block_published_closing_update_delete();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.properties enable row level security;
alter table public.participation_rules enable row level security;
alter table public.property_access enable row level security;
alter table public.rent_collections enable row level security;
alter table public.expenses enable row level security;
alter table public.recurring_expenses enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.monthly_closings enable row level security;
alter table public.heir_liquidations enable row level security;
alter table public.change_requests enable row level security;
alter table public.attachments enable row level security;
alter table public.audit_log enable row level security;

create policy "members can view organizations" on public.organizations
for select using (public.is_member(id));

create policy "users can view own profile" on public.profiles
for select using (id = auth.uid());

create policy "members can view memberships" on public.memberships
for select using (public.is_member(organization_id));

create policy "staff can manage memberships" on public.memberships
for all using (public.current_user_role(organization_id) in ('platform_admin', 'estate_admin'))
with check (public.current_user_role(organization_id) in ('platform_admin', 'estate_admin'));

create policy "members can view properties" on public.properties
for select using (public.is_member(organization_id));

create policy "staff can manage properties" on public.properties
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "members can view participation rules" on public.participation_rules
for select using (public.is_member(organization_id));

create policy "staff can manage participation rules" on public.participation_rules
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "members can view property access" on public.property_access
for select using (public.is_member(organization_id));

create policy "staff can manage property access" on public.property_access
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "members can view rent collections" on public.rent_collections
for select using (public.is_member(organization_id));

create policy "staff can manage rent collections" on public.rent_collections
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "members can view expenses" on public.expenses
for select using (public.is_member(organization_id));

create policy "staff can manage expenses" on public.expenses
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "members can view recurring expenses" on public.recurring_expenses
for select using (public.is_member(organization_id));

create policy "staff can manage recurring expenses" on public.recurring_expenses
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "members can view ledger entries" on public.ledger_entries
for select using (public.is_member(organization_id));

create policy "staff can insert ledger entries" on public.ledger_entries
for insert with check (public.is_staff(organization_id));

create policy "members can view monthly closings" on public.monthly_closings
for select using (public.is_member(organization_id));

create policy "staff can manage draft monthly closings" on public.monthly_closings
for all using (public.is_staff(organization_id) and status <> 'published')
with check (public.is_staff(organization_id));

create policy "members can view heir liquidations" on public.heir_liquidations
for select using (public.is_member(organization_id));

create policy "staff can insert heir liquidations" on public.heir_liquidations
for insert with check (public.is_staff(organization_id));

create policy "members can view change requests" on public.change_requests
for select using (public.is_member(organization_id));

create policy "members can create change requests" on public.change_requests
for insert with check (public.is_member(organization_id) and requested_by = auth.uid());

create policy "staff can review change requests" on public.change_requests
for update using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "members can view attachments" on public.attachments
for select using (public.is_member(organization_id));

create policy "staff can create attachments" on public.attachments
for insert with check (public.is_staff(organization_id));

create policy "members can view audit log" on public.audit_log
for select using (organization_id is null or public.is_member(organization_id));

create policy "staff can insert audit log" on public.audit_log
for insert with check (organization_id is null or public.is_staff(organization_id));

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
