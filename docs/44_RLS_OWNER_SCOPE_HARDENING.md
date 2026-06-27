# RLS Owner Scope Hardening

## Rama

- Rama: `feature/auth-rbac-crud-foundation`
- Fase: hardening de RLS para `owner_readonly`
- Migracion: `supabase/migrations/202606270001_owner_scope_rls.sql`
- Tests: `supabase/tests/database/rls.sql`

## Problema detectado

El QA funcional encontro que las politicas RLS iniciales usaban `public.is_member(organization_id)` para lectura en tablas operativas y financieras. Eso permitia que un usuario `owner_readonly`, por el solo hecho de pertenecer a la organizacion, leyera datos org-wide de:

- propiedades;
- reglas de participacion;
- accesos por propiedad;
- ingresos;
- gastos;
- gastos recurrentes/globales;
- ledger;
- cierres mensuales;
- liquidaciones;
- solicitudes;
- adjuntos;
- historial/audit log.

Ese comportamiento era inseguro porque `owner_readonly` no debe poder consultar datos financieros de propiedades ajenas desde un cliente autenticado.

## Riesgo

La UI ya restringia rutas para owner, pero RLS debe ser la barrera real. Sin este hardening, un owner autenticado podria consultar tablas directamente si conoce el esquema y las variables publicas del frontend.

## Modelo de acceso nuevo

### Roles

- `platform_admin`: acceso operativo completo dentro de su organizacion.
- `estate_admin`: gestion operativa de organizacion, propiedades, participaciones y accesos.
- `accountant`: lectura financiera y escritura de registros financieros permitidos; no administra propiedades, accesos ni roles.
- `owner_readonly`: lectura limitada por propiedad/participacion y solicitudes propias.

### Owner scope

Un owner puede leer una propiedad si:

- existe una fila `property_access` con `profile_id = auth.uid()` y `can_view = true`; o
- existe una fila vigente en `participation_rules` para esa propiedad y `participant_profile_id = auth.uid()`.

Los gastos globales con `property_id is null` no son visibles directamente para owner. Deben llegar al owner mediante liquidaciones o distribuciones calculadas, no como registros globales crudos.

## Helpers SQL

Se agregaron helpers `security definer` con `search_path = public`:

- `public.is_org_admin(organization_id)`
- `public.is_owner_readonly(organization_id)`
- `public.can_access_property(property_id)`
- `public.can_view_profile(profile_id)`
- `public.can_view_membership(organization_id, profile_id)`

Se reutilizaron helpers existentes:

- `public.current_user_role(organization_id)`
- `public.is_staff(organization_id)`
- `public.is_member(organization_id)`

## Politicas modificadas

La migracion reemplaza politicas org-wide por politicas scoped en:

- `profiles`: perfil propio o perfiles de organizaciones donde el actor es staff.
- `memberships`: membresia propia u org admins.
- `properties`: staff org-wide; owner solo propiedades accesibles.
- `participation_rules`: staff org-wide; owner solo reglas donde es participante.
- `property_access`: org admins; owner solo sus accesos visibles.
- `rent_collections`: staff org-wide; owner solo propiedades accesibles.
- `expenses`: staff org-wide; owner solo gastos con `property_id` accesible. Globales ocultos.
- `recurring_expenses`: staff only.
- `ledger_entries`: staff only.
- `monthly_closings`: staff only por contener snapshot org-wide.
- `heir_liquidations`: staff org-wide; owner solo filas donde `participant_profile_id = auth.uid()`.
- `change_requests`: staff org-wide; owner solo solicitudes propias.
- `attachments`: staff only.
- `audit_log`: staff only.

## Casos RLS cubiertos

`supabase/tests/database/rls.sql` cubre 27 pruebas:

- platform admin ve y gestiona propiedades de su organizacion.
- estate admin ve propiedades, gestiona property access y lee audit log.
- accountant crea ingresos y gastos, crea filas de liquidacion y no gestiona propiedades.
- accountant no borra financieros posteados.
- owner ve solo propiedades scopeadas.
- owner lee ingresos de propiedad permitida.
- owner no lee ingresos de propiedad ajena.
- owner lee gastos de propiedad permitida.
- owner no lee gastos de propiedad ajena.
- owner no lee gastos globales directamente.
- owner no crea ingresos.
- owner no crea gastos.
- owner crea solicitudes propias.
- owner lee solo solicitudes propias.
- owner no lee cierres mensuales org-wide directamente.
- owner lee solo liquidaciones propias.
- owner no lee audit log.
- admin de otra organizacion no ve datos de la organizacion A.
- audit log sigue append-only.
- cierres publicados siguen inmutables.

## Validacion local

- `pnpm exec supabase db reset`: PASS en Supabase local del proyecto.
- `pnpm exec supabase test db`: PASS, 27/27.

## Limitaciones

- Owner no ve `monthly_closings` directamente porque `snapshot` es org-wide. La vista owner debe consumir `heir_liquidations` o una vista/materializacion futura de resumen por owner.
- Owner no ve gastos globales crudos; falta modelo de allocation/distribucion si el producto quiere mostrar detalle global al owner.
- Adjuntos quedan staff-only hasta definir scope por entidad relacionada.
- `is_owner_readonly` queda disponible para politicas futuras aunque esta migracion usa principalmente `can_access_property` y `auth.uid()`.

## Seguridad operativa

- No se tocaron variables, secretos, Vercel ni produccion.
- No se usaron datos reales.
- No se imprimieron claves.
- La migracion fue validada solo contra Supabase local.

## Recomendacion

Aprobar esta fase para QA final de Auth/RBAC/CRUD con usuarios fixture sanitizados. No mergear a `main` hasta que el QA final vuelva a ejecutar checks completos, smoke y pruebas de login/logout en entorno local o DEV.
