# Supabase Cloud Activation Gate

Fecha: 2026-06-27

Rama: `feature/auth-rbac-crud-foundation`

Decision: **Cloud no listo / merge detenido**

## Objetivo

Preparar Supabase Cloud para evitar lockout antes de integrar Auth/RBAC/CRUD a
`main`.

## Proyecto Cloud identificado

- Project ref verificado: `bzoqbjcktoyngvszcwhl`
- Nombre Supabase verificado por CLI: `atria-inmobiliaria`
- Estado reportado por CLI: activo/saludable
- Proyecto no tocado: `construction-ops-prod`

El proyecto vinculado localmente en `supabase/.temp/project-ref` coincide con
`bzoqbjcktoyngvszcwhl`.

## Estado de migraciones Cloud

`supabase migration list --linked` reporto:

- `202606240001`: aplicado en local y remoto.
- `202606270001`: presente localmente y pendiente en remoto.

La unica migracion pendiente detectada fue:

- `supabase/migrations/202606270001_owner_scope_rls.sql`

No se aplico la migracion Cloud en esta compuerta.

## Auditoria de la migracion RLS

La migracion `202606270001_owner_scope_rls.sql` fue auditada localmente.

Resultado:

- No contiene `DROP TABLE`.
- No contiene `DROP SCHEMA`.
- No contiene `TRUNCATE`.
- No contiene `DELETE FROM`.
- No desactiva RLS.
- No contiene service role, secret ni password.
- Reemplaza funciones auxiliares y policies RLS.
- Endurece owner-scope.
- Mantiene acceso operativo de admin/accountant segun tests locales.

Nota: contiene `DROP POLICY IF EXISTS`, esperado para reemplazar politicas RLS.

## Estado inicial Cloud

Consultas agregadas remotas, sin imprimir filas personales:

- `organization_count`: `0`
- `admin_memberships`: `0`

Esto confirmo riesgo de lockout si se integraba Auth/RBAC/CRUD con
`NEXT_PUBLIC_APP_MODE=live` sin preparar una cuenta admin.

## Cuenta admin fixture

Se intento preparar una cuenta fixture:

- Email fixture: `platform.admin@atria.test`
- Rol objetivo: `platform_admin`
- Organizacion fixture: `ATRIA Cloud Activation Demo`

Se creo una credencial local generada en:

- `artifacts/supabase-cloud-activation/cloud-admin-credential.local.txt`

Ese archivo esta dentro de `artifacts/`, ignorado por Git, y no fue commiteado.
No se imprimio la contrasena en la respuesta final ni en documentacion.

Resultado verificado por consulta agregada:

- `fixture_admin_ready`: `1`

Sin embargo, el login Cloud real no quedo verificado.

## Bloqueo de seguridad

La compuerta se detuvo porque el comando de Supabase CLI para listar API keys
devolvio claves sensibles en salida de consola durante un fallo de parseo.

No se commiteo ningun secreto y no se escribio ningun secreto en archivos
versionados, pero por regla de seguridad esto se considera exposicion de secreto
en la sesion de trabajo y exige detener el proceso.

Accion requerida antes de continuar:

1. Rotar/revocar las API keys de Supabase Cloud afectadas desde el dashboard de
   Supabase.
2. Confirmar que la app/Vercel usa la nueva publishable key cuando corresponda.
3. Reintentar la verificacion Cloud sin imprimir claves.

## Pruebas locales realizadas

Antes del bloqueo:

- `pnpm exec supabase test db`: PASS, 27/27 despues de reset local limpio.

La rama ya tenia gates locales recientes:

- `pnpm format`: PASS.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS, 17/17.
- `pnpm build`: PASS.
- Smoke local 48/48: PASS.
- Auth/RLS local con fixtures: PASS.
- UI Auth/CRUD local con fixtures: PASS.

## Cloud smoke

No completado.

Motivo:

- Login Cloud no verificado por bloqueo de seguridad antes de usar API key
  publica/anon de forma segura.

## Lockout

Estado final de lockout: **no resuelto al 100%**.

Aunque se preparo una membresia fixture admin por conteo, falta:

- Verificar login real del admin fixture contra Supabase Cloud.
- Aplicar/verificar migracion RLS Cloud.
- Confirmar comportamiento de app con `NEXT_PUBLIC_APP_MODE=live`.

## Rollback logico

Si se decide revertir la preparacion fixture, hacerlo manualmente con SQL
controlado en Supabase Cloud:

- eliminar membresia fixture `platform_admin`;
- eliminar profile fixture;
- eliminar organizacion fixture;
- eliminar usuario Auth fixture.

No ejecutar limpieza destructiva sin una aprobacion explicita y una consulta
previa de impacto.

## Que no se hizo

- No se mergeo a `main`.
- No se desplego produccion.
- No se aplico la migracion RLS Cloud.
- No se cambio Vercel config.
- No se tocaron `.env`, `.env.local`, `.vercel`, tokens ni claves en Git.
- No se usaron datos reales.
- No se toco `VIDEOS DE PROCESO/`.
- No se hizo force push.
- No se borraron ramas.

## Siguiente paso recomendado

Detener el release hasta rotar las API keys de Supabase Cloud y repetir esta
compuerta con un script que capture claves publicas sin imprimir salida sensible.

Despues de rotar:

1. Verificar project ref `bzoqbjcktoyngvszcwhl`.
2. Confirmar que solo `202606270001` esta pendiente.
3. Verificar o recrear admin fixture con credencial segura.
4. Verificar login Cloud real.
5. Aplicar `202606270001_owner_scope_rls.sql`.
6. Ejecutar smoke Cloud Auth/RLS.
7. Repetir release gate completo antes de mergear.

## Actualizacion 2026-07-06 — bloqueo real: proyecto Cloud pausado

Hallazgo principal: el bloqueo operativo real de la compuerta anterior incluia
que el proyecto Supabase Cloud `atria-inmobiliaria` (`bzoqbjcktoyngvszcwhl`)
estaba **pausado**. Con la base pausada, la verificacion de migracion, el admin
fixture y el smoke Cloud no podian completar. El usuario reactivo el proyecto
manualmente desde el dashboard y confirmo estado **activo**, y el `supabase link`
quedo completado en el PC nuevo.

Nota sobre claves: la exposicion previa de una key en consola del CLI se mantiene
como registro historico. El usuario decidio no tratar la rotacion como bloqueante
para continuar, dado que el bloqueo principal era el pause. Regla vigente: si
reaparece cualquier key/secreto/DB URL completa en consola o logs, detenerse y
recomendar rotacion.

### Cloud read gate post-activacion (no destructivo)

Ejecutado con `scripts/supabase-cloud-gate.sh --confirm-cloud` (sin imprimir
secretos):

- Project linked al ref esperado: PASS.
- Auditoria RLS local de `202606270001`: PASS (sin `DROP TABLE`/`DROP SCHEMA`/
  `TRUNCATE`/`DELETE FROM`/disable RLS; idempotente).
- `supabase migration list --linked`:
  - `202606240001`: aplicada Local y Remote.
  - `202606270001`: presente Local, **pendiente en Remote**.
- Unica migracion pendiente en Cloud: `202606270001_owner_scope_rls.sql`.
- Smoke agregado: saltado con WARN (`SUPABASE_DB_URL` no configurada, por decision
  de minimizar exposicion). Documentado.
- No se imprimieron keys, DB URL ni secretos.

### Snapshot de rollback pre-apply (solo metadata, sin datos)

Fuente autoritativa del estado actual de policies en Cloud: la migracion aplicada
`supabase/migrations/202606240001_initial_schema.sql` (Cloud esta exactamente en
esa version). No se consulto la DB directamente para evitar manejar el connection
string; el snapshot es fiel porque Cloud no tiene ninguna otra migracion aplicada.

La migracion `202606270001` reemplaza (drop + recreate) las siguientes policies.
Para rollback manual, re-crear las definiciones ORIGINALES desde
`202606240001_initial_schema.sql` (commit del schema inicial). Resumen por
tabla → policy original → comando → condicion:

- `profiles` → "users can view own profile" → SELECT → `id = auth.uid()`.
- `memberships` → "members can view memberships" → SELECT → `is_member(org)`;
  "staff can manage memberships" → ALL → `current_user_role in (platform_admin,estate_admin)`.
- `properties` → "members can view properties" → SELECT → `is_member(org)`;
  "staff can manage properties" → ALL → `is_staff(org)`.
- `participation_rules` → "members can view participation rules" → SELECT → `is_member(org)`;
  "staff can manage participation rules" → ALL → `is_staff(org)`.
- `property_access` → "members can view property access" → SELECT → `is_member(org)`;
  "staff can manage property access" → ALL → `is_staff(org)`.
- `rent_collections` → "members can view rent collections" → SELECT → `is_member(org)`;
  "staff can manage rent collections" → ALL → `is_staff(org)`.
- `expenses` → "members can view expenses" → SELECT → `is_member(org)`;
  "staff can manage expenses" → ALL → `is_staff(org)`.
- `recurring_expenses` → "members can view recurring expenses" → SELECT → `is_member(org)`;
  "staff can manage recurring expenses" → ALL → `is_staff(org)`.
- `ledger_entries` → "members can view ledger entries" → SELECT → `is_member(org)`;
  "staff can insert ledger entries" → INSERT → `is_staff(org)`.
- `monthly_closings` → "members can view monthly closings" → SELECT → `is_member(org)`;
  "staff can manage draft monthly closings" → ALL → `is_staff(org) and status <> 'published'`.
- `heir_liquidations` → "members can view heir liquidations" → SELECT → `is_member(org)`;
  "staff can insert heir liquidations" → INSERT → `is_staff(org)`.
- `change_requests` → "members can view change requests" → SELECT → `is_member(org)`;
  "members can create change requests" → INSERT → `is_member(org) and requested_by = auth.uid()`;
  "staff can review change requests" → UPDATE → `is_staff(org)`.
- `attachments` → "members can view attachments" → SELECT → `is_member(org)`;
  "staff can create attachments" → INSERT → `is_staff(org)`.
- `audit_log` → "members can view audit log" → SELECT → `organization_id is null or is_member(org)`;
  "staff can insert audit log" → INSERT → `organization_id is null or is_staff(org)`.

No se incluye ninguna fila de datos, ningun secreto ni ningun valor sensible.
La policy "members can view organizations" no es afectada por la migracion.
