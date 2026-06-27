begin;

create extension if not exists pgtap;
set search_path to public, extensions;

select plan(27);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('10000000-0000-4000-8000-000000000000', 'authenticated', 'authenticated', 'platform.admin@atria.test', 'demo', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'estate.admin@atria.test', 'demo', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'accountant@atria.test', 'demo', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'owner@atria.test', 'demo', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'admin.otra.org@atria.test', 'demo', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'owner2@atria.test', 'demo', now(), now(), now());

insert into public.organizations (id, name, slug)
values
  ('20000000-0000-4000-8000-000000000001', 'Organizacion Demo RLS A', 'org-demo-rls-a'),
  ('20000000-0000-4000-8000-000000000002', 'Organizacion Demo RLS B', 'org-demo-rls-b');

insert into public.profiles (id, display_name)
values
  ('10000000-0000-4000-8000-000000000000', 'Soporte Demo'),
  ('10000000-0000-4000-8000-000000000001', 'Admin Demo'),
  ('10000000-0000-4000-8000-000000000002', 'Contador Demo'),
  ('10000000-0000-4000-8000-000000000003', 'Propietario Demo'),
  ('10000000-0000-4000-8000-000000000004', 'Admin Otra Org Demo'),
  ('10000000-0000-4000-8000-000000000005', 'Propietario Dos Demo');

insert into public.memberships (organization_id, profile_id, role)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000000', 'platform_admin'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'estate_admin'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'accountant'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 'owner_readonly'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'owner_readonly'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004', 'estate_admin');

insert into public.properties (id, organization_id, code, display_name)
values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'RLS-A-1', 'Propiedad Permitida'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'RLS-A-2', 'Propiedad Ajena'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000002', 'RLS-B-1', 'Propiedad Otra Org');

insert into public.property_access (organization_id, property_id, profile_id, can_view)
values
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', true),
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000005', true);

insert into public.participation_rules (organization_id, property_id, participant_profile_id, basis_points, effective_from)
values
  ('20000000-0000-4000-8000-000000000001', null, '10000000-0000-4000-8000-000000000003', 5000, '2026-01-01'),
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 5000, '2026-01-01'),
  ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000005', 5000, '2026-01-01');

insert into public.monthly_closings (id, organization_id, period_month, status, snapshot, published_at)
values
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '2026-06-01', 'draft', '{}', null),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '2026-07-01', 'published', '{}', now());

insert into public.rent_collections (id, organization_id, property_id, period_month, amount_cop, status, source, posted_at)
values
  ('50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-06-01', 1000000, 'posted', 'rls_test', now()),
  ('50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', '2026-06-01', 2000000, 'posted', 'rls_test', now());

insert into public.expenses (id, organization_id, property_id, period_month, category, description, amount_cop, status, posted_at)
values
  ('60000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-06-01', 'property', 'Gasto permitido demo', 100000, 'posted', now()),
  ('60000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', '2026-06-01', 'property', 'Gasto ajeno demo', 200000, 'posted', now()),
  ('60000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', null, '2026-06-01', 'global', 'Gasto global demo', 300000, 'posted', now());

insert into public.heir_liquidations (id, organization_id, monthly_closing_id, participant_profile_id, rental_collections_cop, expense_participation_cop, total_participation_cop, accumulated_balance_cop, amount_to_pay_cop)
values
  ('80000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 1000000, 100000, 900000, 900000, 900000),
  ('80000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 2000000, 200000, 1800000, 1800000, 1800000);

insert into public.change_requests (id, organization_id, requested_by, request_type, status, details)
values
  ('90000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 'adjustment', 'pending_review', '{"demo":true}'),
  ('90000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 'adjustment', 'pending_review', '{"demo":true}');

insert into public.audit_log (id, organization_id, action, entity_table, entity_id)
values ('70000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'rls_test', 'properties', '30000000-0000-4000-8000-000000000001');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000000', true);
select is((select count(*) from public.properties where organization_id = '20000000-0000-4000-8000-000000000001'), 2::bigint, 'platform_admin sees organization properties');
select lives_ok($$ insert into public.properties (organization_id, code, display_name) values ('20000000-0000-4000-8000-000000000001', 'RLS-A-3', 'Propiedad Nueva Demo') $$, 'platform_admin can manage organization properties');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select is((select count(*) from public.properties where organization_id = '20000000-0000-4000-8000-000000000001'), 3::bigint, 'estate_admin sees organization properties');
select lives_ok($$ insert into public.property_access (organization_id, property_id, profile_id, can_view) values ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', true) on conflict (property_id, profile_id) do nothing $$, 'estate_admin can manage property access');
select is((select count(*) from public.audit_log where organization_id = '20000000-0000-4000-8000-000000000001'), 1::bigint, 'estate_admin can read audit log');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
select lives_ok($$ insert into public.rent_collections (organization_id, property_id, period_month, amount_cop, status, source) values ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-06-01', 250000, 'draft', 'rls_test') $$, 'accountant can create rent collections');
select lives_ok($$ insert into public.expenses (organization_id, property_id, period_month, category, description, amount_cop, status) values ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-06-01', 'property', 'Gasto contador demo', 50000, 'draft') $$, 'accountant can create expenses');
select throws_ok($$ insert into public.properties (organization_id, code, display_name) values ('20000000-0000-4000-8000-000000000001', 'RLS-A-4', 'No permitido') $$, '42501', null, 'accountant cannot manage properties');
select lives_ok($$ insert into public.heir_liquidations (organization_id, monthly_closing_id, participant_profile_id, rental_collections_cop, expense_participation_cop, total_participation_cop, accumulated_balance_cop, amount_to_pay_cop) values ('20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 1000000, 100000, 900000, 900000, 900000) $$, 'accountant can create liquidation rows');
select throws_ok($$ delete from public.expenses where id = '60000000-0000-4000-8000-000000000001' $$, 'P0001', 'financial records are append-only; create reversal entries instead', 'accountant cannot delete posted financial records');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', true);
select is((select count(*) from public.properties where organization_id = '20000000-0000-4000-8000-000000000001'), 1::bigint, 'owner sees only scoped properties');
select is((select count(*) from public.rent_collections where property_id = '30000000-0000-4000-8000-000000000001'), 2::bigint, 'owner can read rent collections for permitted property');
select is((select count(*) from public.rent_collections where property_id = '30000000-0000-4000-8000-000000000002'), 0::bigint, 'owner cannot read rent collections for other properties');
select is((select count(*) from public.expenses where property_id = '30000000-0000-4000-8000-000000000001'), 2::bigint, 'owner can read expenses for permitted property');
select is((select count(*) from public.expenses where property_id = '30000000-0000-4000-8000-000000000002'), 0::bigint, 'owner cannot read expenses for other properties');
select is((select count(*) from public.expenses where property_id is null), 0::bigint, 'owner cannot read global expenses directly');
select throws_ok($$ insert into public.rent_collections (organization_id, property_id, period_month, amount_cop, status, source) values ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-06-01', 1, 'draft', 'rls_test') $$, '42501', null, 'owner cannot create rent collections');
select throws_ok($$ insert into public.expenses (organization_id, property_id, period_month, category, description, amount_cop, status) values ('20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-06-01', 'property', 'No permitido', 1, 'draft') $$, '42501', null, 'owner cannot create expenses');
select lives_ok($$ insert into public.change_requests (organization_id, requested_by, request_type, details) values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 'adjustment', '{"demo":true}') $$, 'owner can create own change requests');
select is((select count(*) from public.change_requests where organization_id = '20000000-0000-4000-8000-000000000001'), 2::bigint, 'owner can read only own change requests');
select is((select count(*) from public.monthly_closings where organization_id = '20000000-0000-4000-8000-000000000001'), 0::bigint, 'owner cannot read org-wide monthly closings directly');
select is((select count(*) from public.heir_liquidations where organization_id = '20000000-0000-4000-8000-000000000001'), 2::bigint, 'owner can read only own liquidation rows including duplicate inserted by accountant');
select is((select count(*) from public.audit_log where organization_id = '20000000-0000-4000-8000-000000000001'), 0::bigint, 'owner cannot read audit log');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000004', true);
select is((select count(*) from public.properties where organization_id = '20000000-0000-4000-8000-000000000001'), 0::bigint, 'organization B admin cannot see organization A properties');
select is((select count(*) from public.rent_collections where organization_id = '20000000-0000-4000-8000-000000000001'), 0::bigint, 'organization B admin cannot see organization A finance rows');
reset role;

select throws_ok($$ update public.audit_log set action = 'tamper' where id = '70000000-0000-4000-8000-000000000001' $$, 'P0001', 'audit_log is append-only', 'audit_log cannot be updated');
select throws_ok($$ update public.monthly_closings set snapshot = '{"tampered":true}'::jsonb where id = '40000000-0000-4000-8000-000000000002' $$, 'P0001', 'published monthly closings are immutable; use explicit reopen workflow', 'published closings are immutable');

select * from finish();

rollback;
