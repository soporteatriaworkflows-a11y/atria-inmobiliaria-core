create or replace function public.is_org_admin(target_organization_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role(target_organization_id) in ('platform_admin', 'estate_admin')
$$;

create or replace function public.is_owner_readonly(target_organization_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role(target_organization_id) = 'owner_readonly'
$$;

create or replace function public.can_access_property(target_property_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.properties p
    where p.id = target_property_id
      and (
        public.is_staff(p.organization_id)
        or exists (
          select 1
          from public.property_access pa
          where pa.property_id = p.id
            and pa.organization_id = p.organization_id
            and pa.profile_id = auth.uid()
            and pa.can_view = true
        )
        or exists (
          select 1
          from public.participation_rules pr
          where pr.property_id = p.id
            and pr.organization_id = p.organization_id
            and pr.participant_profile_id = auth.uid()
            and (pr.effective_to is null or pr.effective_to >= current_date)
        )
      )
  )
$$;

create or replace function public.can_view_profile(target_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select target_profile_id = auth.uid()
    or exists (
      select 1
      from public.memberships actor
      join public.memberships target
        on target.organization_id = actor.organization_id
      where actor.profile_id = auth.uid()
        and target.profile_id = target_profile_id
        and actor.role in ('platform_admin', 'estate_admin', 'accountant')
    )
$$;

create or replace function public.can_view_membership(target_organization_id uuid, target_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select target_profile_id = auth.uid()
    or public.current_user_role(target_organization_id) in ('platform_admin', 'estate_admin')
$$;

drop policy if exists "users can view own profile" on public.profiles;
drop policy if exists "members can view memberships" on public.memberships;
drop policy if exists "staff can manage memberships" on public.memberships;
drop policy if exists "members can view properties" on public.properties;
drop policy if exists "staff can manage properties" on public.properties;
drop policy if exists "members can view participation rules" on public.participation_rules;
drop policy if exists "staff can manage participation rules" on public.participation_rules;
drop policy if exists "members can view property access" on public.property_access;
drop policy if exists "staff can manage property access" on public.property_access;
drop policy if exists "members can view rent collections" on public.rent_collections;
drop policy if exists "staff can manage rent collections" on public.rent_collections;
drop policy if exists "members can view expenses" on public.expenses;
drop policy if exists "staff can manage expenses" on public.expenses;
drop policy if exists "members can view recurring expenses" on public.recurring_expenses;
drop policy if exists "staff can manage recurring expenses" on public.recurring_expenses;
drop policy if exists "members can view ledger entries" on public.ledger_entries;
drop policy if exists "staff can insert ledger entries" on public.ledger_entries;
drop policy if exists "members can view monthly closings" on public.monthly_closings;
drop policy if exists "staff can manage draft monthly closings" on public.monthly_closings;
drop policy if exists "members can view heir liquidations" on public.heir_liquidations;
drop policy if exists "staff can insert heir liquidations" on public.heir_liquidations;
drop policy if exists "members can view change requests" on public.change_requests;
drop policy if exists "members can create change requests" on public.change_requests;
drop policy if exists "staff can review change requests" on public.change_requests;
drop policy if exists "members can view attachments" on public.attachments;
drop policy if exists "staff can create attachments" on public.attachments;
drop policy if exists "members can view audit log" on public.audit_log;
drop policy if exists "staff can insert audit log" on public.audit_log;

create policy "scoped profiles are visible" on public.profiles
for select using (public.can_view_profile(id));

create policy "scoped memberships are visible" on public.memberships
for select using (public.can_view_membership(organization_id, profile_id));

create policy "org admins can manage memberships" on public.memberships
for all using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

create policy "scoped properties are visible" on public.properties
for select using (public.is_staff(organization_id) or public.can_access_property(id));

create policy "org admins can manage properties" on public.properties
for all using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

create policy "scoped participation rules are visible" on public.participation_rules
for select using (public.is_staff(organization_id) or participant_profile_id = auth.uid());

create policy "org admins can manage participation rules" on public.participation_rules
for all using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

create policy "scoped property access is visible" on public.property_access
for select using (public.is_org_admin(organization_id) or (profile_id = auth.uid() and can_view = true));

create policy "org admins can manage property access" on public.property_access
for all using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

create policy "scoped rent collections are visible" on public.rent_collections
for select using (public.is_staff(organization_id) or public.can_access_property(property_id));

create policy "staff can manage rent collections" on public.rent_collections
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "scoped expenses are visible" on public.expenses
for select using (
  public.is_staff(organization_id)
  or (property_id is not null and public.can_access_property(property_id))
);

create policy "staff can manage expenses" on public.expenses
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "staff can view recurring expenses" on public.recurring_expenses
for select using (public.is_staff(organization_id));

create policy "staff can manage recurring expenses" on public.recurring_expenses
for all using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "staff can view ledger entries" on public.ledger_entries
for select using (public.is_staff(organization_id));

create policy "staff can insert ledger entries" on public.ledger_entries
for insert with check (public.is_staff(organization_id));

create policy "staff can view monthly closings" on public.monthly_closings
for select using (public.is_staff(organization_id));

create policy "staff can manage draft monthly closings" on public.monthly_closings
for all using (public.is_staff(organization_id) and status <> 'published')
with check (public.is_staff(organization_id));

create policy "scoped heir liquidations are visible" on public.heir_liquidations
for select using (public.is_staff(organization_id) or participant_profile_id = auth.uid());

create policy "staff can insert heir liquidations" on public.heir_liquidations
for insert with check (public.is_staff(organization_id));

create policy "scoped change requests are visible" on public.change_requests
for select using (public.is_staff(organization_id) or requested_by = auth.uid());

create policy "members can create own change requests" on public.change_requests
for insert with check (public.is_member(organization_id) and requested_by = auth.uid());

create policy "staff can review change requests" on public.change_requests
for update using (public.is_staff(organization_id))
with check (public.is_staff(organization_id));

create policy "staff can view attachments" on public.attachments
for select using (public.is_staff(organization_id));

create policy "staff can create attachments" on public.attachments
for insert with check (public.is_staff(organization_id));

create policy "staff can view audit log" on public.audit_log
for select using (organization_id is not null and public.is_staff(organization_id));

create policy "staff can insert audit log" on public.audit_log
for insert with check (organization_id is not null and public.is_staff(organization_id));
