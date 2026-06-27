# Codex QA Auth RBAC CRUD Foundation

## Rama auditada

- Rama: `feature/auth-rbac-crud-foundation`
- Commits auditados:
  - `de63e21 feat(auth): add auth rbac crud foundation`
  - `18c7448 docs: document auth rbac crud foundation`
- Base comparada: `origin/main` en `87720ec docs: registrar merge de visual craft en produccion`

## Diff sensible

No se modificaron en esta rama:

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

El diff esta limitado a componentes frontend de Auth/CRUD, rutas/paginas, tests unitarios y documentacion.

## Arquitectura Auth revisada

- `AuthProvider` inicializa Supabase Auth solo en `NEXT_PUBLIC_APP_MODE=live` con URL y publishable key publicas.
- `AuthGate` protege rutas en modo live.
- `/login` queda publico.
- `/` redirige segun rol a dashboard operativo.
- Sesion sin membresia queda sin rol y no accede a rutas protegidas.
- Rol sin permiso recibe estado de acceso denegado y redireccion a vista de propietario.
- No se detecto service role, secret key, DB password ni DB URL en `src`.
- No se imprimen tokens ni secretos.

## Variables requeridas

Solo nombres, sin valores:

- `NEXT_PUBLIC_APP_MODE=live`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Fixtures sanitizados

Usuarios propuestos para Supabase local o DEV:

- `platform.admin@atria.test` -> `platform_admin`
- `estate.admin@atria.test` -> `estate_admin`
- `accountant@atria.test` -> `accountant`
- `owner@atria.test` -> `owner_readonly`

Contraseñas: usar valores locales de prueba, no reales, no reutilizados y no commiteados como secreto productivo. Si se usa seed SQL local, debe ser contra Supabase local/DEV y con hashes generados localmente. Si se usa Admin API, la service role solo puede existir en entorno local/DEV y nunca en frontend ni en Git.

## Matriz RBAC validada en frontend

| Rol              | Acceso validado                                                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform_admin` | Dashboard admin, propiedades, propietarios, ingresos, gastos, cierre, solicitudes, historial.                                                                                            |
| `estate_admin`   | Dashboard admin y gestion operativa base.                                                                                                                                                |
| `accountant`     | Dashboard gestion contable, lectura operativa, ingresos/gastos y preparacion de cierre; no dashboard admin.                                                                              |
| `owner_readonly` | Dashboard propietario y solicitudes de ajuste. Bloqueado en admin, contador, propiedades, propietarios, ingresos, gastos, cierre e historial hasta que RLS este acotado por propietario. |

## CRUD validado

- Propiedades: formulario y boton solo habilitados para roles con `properties:write`.
- Propietarios/participaciones: lectura conectada; creacion no implementada porque `profiles.id` depende de `auth.users(id)` y requiere invitacion segura.
- Ingresos: monto obligatorio, entero positivo; owner bloqueado por ruta/permisos.
- Gastos: monto obligatorio, entero positivo; owner bloqueado por ruta/permisos.
- Solicitudes: owner puede crear solicitud con detalle obligatorio; listado se filtra por `requested_by = auth.user.id` para owner en UI.
- Cierre mensual: no se implementa cierre irreversible.

## RLS validado

- Supabase local detectado para este proyecto.
- `pnpm exec supabase test db`: PASS, 12/12 tests existentes.
- Hallazgo QA: los tests/policies existentes permiten que `owner_readonly` lea filas financieras de la organizacion completa. En `supabase/tests/database/rls.sql`, el test actual espera que el owner lea dos filas de `rent_collections` de la organizacion. Eso no satisface el requisito funcional nuevo de "no ver datos de otros propietarios".
- No se modifico RLS ni migraciones porque un ajuste seguro requiere diseno y tests especificos de `property_access`, `participation_rules`, cierres y solicitudes.

## Pruebas permitidas/denegadas

Validado automaticamente:

- Owner no accede a `/dashboard/admin`.
- Owner no accede a `/dashboard/contador`.
- Owner no accede a `/propiedades`, `/herederos`, `/recaudos`, `/gastos`, `/liquidacion`, `/auditoria`.
- Owner accede a `/dashboard/propietario` y `/solicitudes`.
- Accountant accede a `/dashboard/contador` y no a `/dashboard/admin`.
- Secret scan en `src` sin service role ni credenciales de DB.

Pendiente con usuarios fixture reales:

- Login/logout real por cada rol.
- Inserts permitidos/denegados via cliente autenticado.
- Confirmar errores RLS en UI con usuarios fixture.

## Tests agregados o ajustados

- `src/lib/auth/routes.test.ts`: landing por rol y rutas denegadas para owner/accountant.
- `src/lib/auth/crud-validation.test.ts`: montos COP enteros positivos.
- `src/lib/auth/secret-scan.test.ts`: guardia de secretos en `src`.

## Resultados de checks

- `pnpm format`: PASS
- `pnpm lint`: PASS
- `pnpm typecheck`: PASS
- `pnpm test`: PASS, 17/17
- `pnpm build`: PASS
- `pnpm exec supabase test db`: PASS, 12/12 RLS existentes
- Smoke local 12 rutas x claro/oscuro x desktop/movil: PASS, 48/48

## Que no se toco

No se tocaron produccion, Vercel config, variables, secretos, `.env*`, `.vercel/`, `src/lib/supabase/`, `src/lib/finance/`, `supabase/`, migraciones, RLS ni `VIDEOS DE PROCESO/`.

## Riesgos pendientes

- Bloqueante para merge funcional: RLS no esta acotado por propietario; un cliente autenticado owner podria consultar datos de la organizacion si conoce las tablas.
- No se validaron login/logout reales con usuarios fixture persistentes porque no se deben imprimir ni commitear claves locales; quedan pasos manuales seguros.
- Falta flujo seguro de invitacion/alta de propietarios.
- Falta auditoria explicita por evento CRUD.

## Pasos manuales seguros para QA local/DEV

1. Crear usuarios fixture sanitizados en Supabase local/DEV.
2. Insertar `profiles` y `memberships` para cada usuario fixture.
3. Vincular `property_access` para owner.
4. Ejecutar la app con `NEXT_PUBLIC_APP_MODE=live` y variables publicas del entorno local/DEV.
5. Probar login/logout y CRUD permitido/denegado por rol.
6. Antes de merge, crear migracion RLS acotada y tests que prueben que owner no ve datos ajenos.

## Recomendacion final

Ajustar mas antes de merge. La capa frontend queda mas segura y los checks pasan, pero el gate funcional Auth/RBAC/CRUD no debe aprobarse para `main` hasta corregir RLS de owner-scope con migracion y tests.
