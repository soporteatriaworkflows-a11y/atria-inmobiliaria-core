# Auth/RBAC/CRUD Release Gate

Fecha: 2026-06-27

Rama auditada: `feature/auth-rbac-crud-foundation`

Decision: **merge detenido**

## Commits auditados

- `de63e21 feat(auth): add auth rbac crud foundation`
- `18c7448 docs: document auth rbac crud foundation`
- `16a96ad fix(auth): harden owner routes and crud validation`
- `973e8d3 docs: add auth rbac crud qa report`
- `ea47b27 fix(security): scope owner rls by property access`
- `cf64cac fix(auth): finalize functional qa redirects`

La rama esta actualizada contra `origin/main`: `0` commits detras, `6` commits delante.

## Archivos modificados contra main

Documentacion:

- `docs/42_AUTH_RBAC_CRUD_FOUNDATION.md`
- `docs/43_CODEX_QA_AUTH_RBAC_CRUD_FOUNDATION.md`
- `docs/44_RLS_OWNER_SCOPE_HARDENING.md`
- `docs/45_FINAL_AUTH_RBAC_CRUD_QA.md`

UI/app:

- `src/app/gastos/page.tsx`
- `src/app/herederos/page.tsx`
- `src/app/layout.tsx`
- `src/app/login/page.tsx`
- `src/app/propiedades/page.tsx`
- `src/app/recaudos/page.tsx`
- `src/app/solicitudes/page.tsx`
- `src/components/app-shell.tsx`
- `src/components/auth/auth-provider.tsx`
- `src/components/auth/login-form.tsx`
- `src/components/crud/live-crud-panels.tsx`

Auth/RBAC/tests:

- `src/lib/auth/crud-validation.ts`
- `src/lib/auth/crud-validation.test.ts`
- `src/lib/auth/rbac.ts`
- `src/lib/auth/rbac.test.ts`
- `src/lib/auth/routes.ts`
- `src/lib/auth/routes.test.ts`
- `src/lib/auth/secret-scan.test.ts`

Supabase local/schema:

- `supabase/migrations/202606270001_owner_scope_rls.sql`
- `supabase/tests/database/rls.sql`

## Migracion incluida

`supabase/migrations/202606270001_owner_scope_rls.sql`

La migracion endurece RLS owner-scope:

- `owner_readonly` solo ve propiedades por `property_access` o `participation_rules`.
- `owner_readonly` solo ve ingresos/gastos de propiedades permitidas.
- `owner_readonly` no ve gastos globales sin `property_id`.
- `owner_readonly` no ve `monthly_closings` org-wide ni `audit_log`.
- `owner_readonly` solo ve sus `change_requests` y liquidaciones propias.
- Staff conserva acceso operativo esperado.

## Matriz final de roles

`platform_admin`:

- Acceso esperado a modulos operativos.
- Gestion de propiedades.
- Ingresos/gastos.
- Solicitudes.
- Historial.

`estate_admin`:

- Dashboard administracion.
- Gestion operativa de propiedades, ingresos, gastos y solicitudes.
- Lectura de propietarios/participaciones.

`accountant`:

- Dashboard gestion contable.
- Crear ingresos y gastos.
- Revisar cierre mensual.
- No crear propiedades.
- No acceder a dashboard admin.

`owner_readonly`:

- Dashboard propietario.
- Solicitudes.
- Solo lectura owner-scope.
- No crear ingresos.
- No crear gastos.
- No editar propiedades.
- No ver datos financieros ajenos.

## Resultados de QA local

Verificaciones ejecutadas en esta compuerta:

- `pnpm format`: PASS.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS, 17/17.
- `pnpm build`: PASS.
- `pnpm exec supabase test db`: PASS, 27/27.
- Smoke local 12 rutas x claro/oscuro x desktop/movil: PASS, 48/48.
- Auth/RLS smoke local con fixtures sanitizados: PASS.
- UI Auth/CRUD smoke local con fixtures sanitizados: PASS.

Usuarios fixture usados solo localmente:

- `platform.admin@atria.test`
- `estate.admin@atria.test`
- `accountant@atria.test`
- `owner@atria.test`

No se usaron datos reales.

## Analisis de produccion

La app activa Auth real solo cuando:

- `NEXT_PUBLIC_APP_MODE=live`
- `NEXT_PUBLIC_SUPABASE_URL` existe
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` existe

Si produccion no tiene `NEXT_PUBLIC_APP_MODE=live`, la app permanece en modo demo y no hay lockout, pero Auth/RBAC/CRUD real no queda activo para usuarios finales.

Si produccion si tiene `NEXT_PUBLIC_APP_MODE=live`, despues del merge:

- Home `/` queda protegida por `AuthGate`.
- Un usuario sin sesion es redirigido a `/login`.
- Login usa Supabase Auth.
- Ruta por rol despues de login:
  - `platform_admin`: `/dashboard/admin`
  - `estate_admin`: `/dashboard/admin`
  - `accountant`: `/dashboard/contador`
  - `owner_readonly`: `/dashboard/propietario`

## Bloqueo operativo

El merge se detiene por dos riesgos que deben resolverse antes de produccion:

1. No esta verificada una cuenta admin usable en Supabase Cloud Production/DEV para evitar lockout si `NEXT_PUBLIC_APP_MODE=live`.
2. La migracion `202606270001_owner_scope_rls.sql` debe aplicarse y verificarse en Supabase Cloud antes de activar CRUD real contra datos live. Aplicarla en Cloud es una operacion de base de datos de produccion/DEV que requiere confirmacion explicita y plan operativo.

No se debe hacer merge a `main` hasta confirmar:

- Existe al menos un usuario admin operativo con membresia `platform_admin` o `estate_admin` en el entorno objetivo.
- La migracion RLS esta aplicada en el entorno Supabase objetivo.
- RLS owner-scope se valida en ese entorno sin exponer datos ajenos.
- No se requieren secretos impresos ni service role en frontend.

## Que no se toco

- No se mergeo a `main`.
- No se desplego produccion.
- No se tocaron `.env`, `.env.local`, `.vercel`, tokens ni claves.
- No se toco Vercel config.
- No se tocaron datos reales.
- No se toco `src/lib/finance/`.
- No se implemento OCR.
- No se implemento n8n.
- No se toco `VIDEOS DE PROCESO/`.

## Notas operativas

- `debug.log` fue generado por Chromium/Playwright durante smoke local. No contiene secretos y no se commitea.
- El Vercel CLI no esta disponible en este entorno, por lo que no se verificaron variables de Vercel desde CLI.

## Siguiente paso recomendado

Preparar una compuerta especifica de Supabase Cloud DEV/Production:

1. Confirmar entorno objetivo y variables sin imprimir valores.
2. Crear o confirmar usuario admin operativo.
3. Aplicar migracion RLS con backup/rollback documentado.
4. Ejecutar tests RLS equivalentes o pruebas manuales con usuarios fixture sanitizados.
5. Reintentar release merge a `main`.

## Actualizacion 2026-06-27

Se ejecuto la compuerta Cloud en `docs/48_SUPABASE_CLOUD_ACTIVATION_GATE.md`.
Resultado: Cloud no quedo listo para merge. La migracion RLS sigue sin aplicarse
en Cloud y el proceso debe retomarse despues de rotar las API keys expuestas por
salida del CLI durante la verificacion.
