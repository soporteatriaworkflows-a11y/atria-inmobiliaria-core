# Final Auth/RBAC/CRUD QA

Fecha: 2026-06-27

Rama auditada: `feature/auth-rbac-crud-foundation`

Commits base auditados:

- `de63e21 feat(auth): add auth rbac crud foundation`
- `18c7448 docs: document auth rbac crud foundation`
- `16a96ad fix(auth): harden owner routes and crud validation`
- `973e8d3 docs: add auth rbac crud qa report`
- `ea47b27 fix(security): scope owner rls by property access`

Correcciones realizadas durante QA final:

- `src/components/auth/auth-provider.tsx`: `signIn` y `refreshMembership` devuelven el rol primario cargado para que el login pueda redirigir al dashboard correcto.
- `src/components/auth/auth-provider.tsx`: `AuthGate` usa navegacion completa para redirigir rutas sin sesion o sin permiso, evitando quedarse en URLs restringidas.
- `src/components/auth/login-form.tsx`: el login navega directamente al dashboard por rol y el boton "Ir al dashboard" usa la misma ruta por rol.

## Entorno usado

QA ejecutado contra Supabase local del proyecto `atria-inmobiliaria-core`.

Se uso service role local solo para crear usuarios fixture con Supabase Auth Admin API. No se imprimio, commiteo ni expuso la clave. No se uso service role en frontend ni en bundle.

No se uso DEV/produccion. No se usaron datos reales.

## Usuarios fixture sanitizados

Todos los usuarios son de prueba:

- `platform.admin@atria.test` - `platform_admin`
- `estate.admin@atria.test` - `estate_admin`
- `accountant@atria.test` - `accountant`
- `owner@atria.test` - `owner_readonly`
- `owner.other@atria.test` - fixture ajeno para validar aislamiento owner-scope
- `other.org.admin@atria.test` - fixture de otra organizacion

Organizaciones fixture:

- `ATRIA Demo Estate`
- `ATRIA Demo Estate Other`

Propiedades fixture:

- `Apartamento Norte Demo` - permitida para `owner@atria.test`
- `Casa Alameda Demo` - ajena para `owner@atria.test`
- `Local Centro Demo`
- `Propiedad Otra Org Demo`

## Matriz validada

`platform_admin`:

- Login/logout real: PASS
- Dashboard administrador: PASS
- Propiedades: listar y crear: PASS
- Ingresos/gastos: acceso operativo: PASS
- Historial/auditoria: PASS
- Aislamiento cross-org por RLS: PASS

`estate_admin`:

- Login/logout real: PASS
- Dashboard administracion: PASS
- Propiedades: listar y crear: PASS
- Solicitudes y modulos operativos: PASS

`accountant`:

- Login/logout real: PASS
- Dashboard gestion contable: PASS
- Crear ingresos: PASS
- Crear gastos: PASS
- Dashboard admin denegado/redirigido: PASS
- Crear propiedades denegado por RLS: PASS

`owner_readonly`:

- Login/logout real: PASS
- Dashboard propietario: PASS
- `/solicitudes`: PASS
- `/dashboard/admin`, `/dashboard/contador`, `/recaudos`, `/gastos`, `/propiedades`: denegado/redirigido: PASS
- Crear solicitud propia: PASS
- Crear ingresos/gastos denegado por RLS: PASS
- Ver solo datos asociados a propiedad permitida: PASS
- No ver datos de propiedad ajena: PASS
- No ver gastos globales crudos: PASS
- No ver `monthly_closings` org-wide ni `audit_log`: PASS

## RLS owner-scope

Validado desde cliente autenticado con anon/public key local:

- `owner_readonly` NO lee ingresos de propiedad ajena.
- `owner_readonly` lee ingresos de propiedad permitida.
- `owner_readonly` NO lee gastos de propiedad ajena.
- `owner_readonly` lee gastos de propiedad permitida.
- `owner_readonly` NO lee gastos globales sin `property_id`.
- `owner_readonly` NO crea ingresos.
- `owner_readonly` NO crea gastos.
- `owner_readonly` crea solicitud propia.
- `owner_readonly` NO lee solicitudes ajenas.
- `accountant` crea ingresos y gastos.
- `accountant` NO crea propiedades.
- `estate_admin` y `platform_admin` conservan acceso esperado.
- Ningun rol validado accede a datos de otra organizacion.

Resultado: PASS.

## CRUD UI

Validado desde la app local en modo live:

- Propiedades: `platform_admin` y `estate_admin` crean propiedad demo: PASS.
- Ingresos: `accountant` crea ingreso con monto COP entero positivo: PASS.
- Gastos: `accountant` crea gasto con monto COP entero positivo: PASS.
- Solicitudes: `owner_readonly` crea solicitud propia: PASS.
- Owner no accede a formularios de ingresos/gastos/propiedades desde rutas restringidas: PASS.
- Propietarios/participaciones quedan en lectura segura; no se implementa alta de propietarios sin flujo de invitacion Auth: PASS documentado.
- Cierre mensual sigue como revision/preparacion; no se implementa cierre irreversible: PASS documentado.

## UI/UX

- Modo claro default: PASS.
- Modo oscuro con toggle: PASS.
- Persistencia de tema: PASS.
- Login visual consistente: PASS.
- Formularios con labels visibles: PASS.
- Estados sin permisos visibles y redireccion por rol: PASS.
- Sin terminos tecnicos innecesarios expuestos al usuario final: PASS.
- Sin secretos visibles: PASS.
- Sin datos reales visibles: PASS.

## Verificaciones

- `pnpm format`: PASS.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS, 17/17.
- `pnpm build`: PASS.
- `pnpm exec supabase test db`: PASS, 27/27.
- QA cliente Auth/RLS con fixtures: PASS.
- QA UI Auth/CRUD con fixtures: PASS.
- Smoke local 12 rutas x claro/oscuro x desktop/movil: PASS, 48/48.

Nota: antes de `supabase test db`, se hizo reset de Supabase local porque los usuarios fixture Auth chocaban con los emails que los tests pgtap insertan dentro del test. Esto no afecto produccion ni DEV.

## Que no se toco

- Produccion.
- `main`.
- Vercel config.
- `.env`, `.env.local`, `.vercel`, tokens o claves.
- Datos reales.
- `src/lib/finance/`.
- OCR.
- n8n.
- `VIDEOS DE PROCESO/`.
- Proyectos externos o contenedores ajenos.

## Riesgos pendientes

- El flujo de invitacion/alta segura de propietarios reales queda pendiente; no se deben crear propietarios manualmente si `profiles.id` depende de `auth.users`.
- Cierre mensual irreversible sigue fuera de alcance hasta tener tests financieros completos y flujo de auditoria.
- Los fixtures de Auth se recrean localmente para QA; en DEV Cloud requieren pasos manuales equivalentes sin imprimir secretos.
- La UI todavia usa guardias frontend como mejora de UX, pero la seguridad efectiva depende de RLS y fue validada en Supabase local.

## Recomendacion

La rama queda recomendada para merge controlado despues de revision final del equipo. No se debe desplegar produccion sin el gate de integracion correspondiente.
