-- Sanitized demo seed derived for the MVP fixture:
-- fixtures/MVP_Liquidacion_Herederos_SANITIZED_FIXTURE.xlsx
-- Do not replace with private PDFs, private Excel files, names, addresses or bank data.

insert into public.organizations (id, name, slug)
values ('00000000-0000-4000-8000-000000000001', 'Patrimonio Demo ATRIA', 'patrimonio-demo-atria')
on conflict (slug) do nothing;

insert into public.properties (id, organization_id, code, display_name)
values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'PROP-DEMO-01', 'Apartamento Demo Norte'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'PROP-DEMO-02', 'Local Demo Centro')
on conflict (organization_id, code) do nothing;

insert into public.recurring_expenses (organization_id, label, amount_cop, starts_on)
values
  ('00000000-0000-4000-8000-000000000001', 'Administracion demo', 1107000, '2026-06-01'),
  ('00000000-0000-4000-8000-000000000001', 'Contador demo', 922500, '2026-06-01');

insert into public.rent_collections (organization_id, property_id, period_month, amount_cop, status, source, posted_at)
values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '2026-06-01', 3000000, 'posted', 'sanitized_fixture', now()),
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '2026-06-01', 2000000, 'posted', 'sanitized_fixture', now());

insert into public.expenses (organization_id, property_id, period_month, category, description, amount_cop, status, posted_at)
values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '2026-06-01', 'property', 'Gasto propiedad demo', 300000, 'posted', now()),
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '2026-06-01', 'property', 'Gasto propiedad demo', 200000, 'posted', now()),
  ('00000000-0000-4000-8000-000000000001', null, '2026-06-01', 'global', 'Administracion demo', 1107000, 'posted', now()),
  ('00000000-0000-4000-8000-000000000001', null, '2026-06-01', 'global', 'Contador demo', 922500, 'posted', now());
