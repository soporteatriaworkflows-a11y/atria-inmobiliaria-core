# Auth, RBAC y CRUD foundation

## Rama

- Rama: `feature/auth-rbac-crud-foundation`
- Base: `main` despues de `impeccable-visual-craft-v1`
- Produccion visual previa: `https://atria-inmobiliaria-core.vercel.app`

## Objetivo

Convertir la UI demo en una base operativa progresiva sin usar datos reales ni secretos. La implementacion mantiene el modo demo cuando `NEXT_PUBLIC_APP_MODE` no es `live`, y activa Supabase Auth/RBAC solo con variables publicas configuradas.

## Arquitectura Auth

- `src/components/auth/auth-provider.tsx` crea un provider cliente para sesion Supabase.
- Usa solo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` mediante `src/lib/supabase/client.ts`.
- No usa service role, secret key, DB password ni DB URL.
- `AuthGate` protege rutas cuando `NEXT_PUBLIC_APP_MODE=live` y Supabase publico esta configurado.
- `/login` queda publico con `requireAuth={false}`.
- En demo/dev, las rutas mantienen la experiencia visual con datos de prueba.

## Roles

El esquema existente ya define roles en `public.app_role`; no se agregaron migraciones.

- `platform_admin` -> Soporte ATRIA / super_admin
- `estate_admin` -> Administracion / admin
- `accountant` -> Gestion contable / accountant
- `owner_readonly` -> Propietario / owner

## Permisos

- `platform_admin`: lectura/escritura operativa completa en entorno de prueba.
- `estate_admin`: gestiona propiedades, propietarios, ingresos, gastos, cierres, solicitudes e historial.
- `accountant`: gestiona ingresos, gastos y preparacion de cierres; no administra propiedades.
- `owner_readonly`: lectura y creacion de solicitudes de ajuste; no escribe datos financieros.

La politica de rutas esta en `src/lib/auth/routes.ts` y se cubre con pruebas unitarias.

## Tablas usadas

Sin cambios de esquema. La foundation consume tablas existentes mediante RLS:

- `memberships` para organizacion y rol principal.
- `properties` para propiedades.
- `participation_rules` y `profiles` para propietarios/participantes.
- `rent_collections` para ingresos.
- `expenses` para gastos.
- `change_requests` para solicitudes de ajuste.

## CRUD implementado

- Propiedades: lectura y creacion de propiedades demo/live segun permisos.
- Propietarios/participantes: lectura conectada de reglas de participacion y perfiles.
- Ingresos: lectura y creacion de ingresos en borrador.
- Gastos: lectura y creacion de gastos en borrador.
- Solicitudes de ajuste: lectura y creacion por usuario autenticado.

La creacion de propietarios no se implementa todavia porque `profiles.id` referencia `auth.users(id)`; requiere flujo seguro de invitacion/alta de usuario.

## Rutas protegidas

- `/`
- `/dashboard/admin`
- `/dashboard/contador`
- `/dashboard/propietario`
- `/propiedades`
- `/herederos`
- `/recaudos`
- `/gastos`
- `/liquidacion`
- `/solicitudes`
- `/auditoria`

`/login` queda publica.

## Variables requeridas

Solo nombres, sin valores:

- `NEXT_PUBLIC_APP_MODE=live`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Tests

- `src/lib/auth/rbac.test.ts`: mapeo de roles y permisos por producto.
- `src/lib/auth/routes.test.ts`: rutas publicas/protegidas y restricciones por rol.
- Tests existentes de finanzas y seguridad siguen pasando.

## Verificaciones

- `pnpm format`: PASS
- `pnpm lint`: PASS
- `pnpm typecheck`: PASS
- `pnpm test`: PASS, 13/13
- `pnpm build`: PASS
- Smoke local: PASS, 48/48 en 12 rutas, claro/oscuro, desktop/movil.

## Que no se toco

- `supabase/`
- `supabase/migrations`
- `supabase/tests`
- `src/lib/finance/`
- `src/lib/supabase/`
- `.env*`
- `.vercel/`
- `next.config.ts`
- `vercel.json`
- scripts de `package.json`
- configuracion funcional de Vercel
- estructura de base de datos
- datos reales, documentos reales o secretos

## Limitaciones

- No se creo migracion nueva; se reutiliza el esquema existente.
- No hay flujo de invitacion/alta para nuevos propietarios Auth.
- No se publica cierre mensual irreversible.
- Auditoria basica queda preparada por tablas existentes, pero no se conecto escritura explicita de eventos desde cada formulario.
- La validacion real de login/logout requiere usuarios fixture en Supabase local o DEV, sin datos reales.

## Rollback

Al ser una rama funcional no integrada a `main`, el rollback inmediato es no mergear la rama. Si se integra despues, crear tag pre-merge y revertir el merge commit si algun gate falla.

## Recomendacion

Pasar a QA Codex funcional con usuarios fixture sanitizados para validar login/logout real, RLS por rol y operaciones CRUD permitidas/denegadas contra Supabase local o DEV. No mergear a `main` hasta completar ese QA.

## Nota QA Codex

El QA funcional posterior endurecio rutas frontend para `owner_readonly` y agrego validacion de montos/secret scan. La recomendacion actual es no mergear a `main` hasta implementar RLS acotado por propietario; las politicas actuales permiten lectura por membresia de organizacion completa. Ver `docs/43_CODEX_QA_AUTH_RBAC_CRUD_FOUNDATION.md`.
