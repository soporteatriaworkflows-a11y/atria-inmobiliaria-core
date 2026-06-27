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
