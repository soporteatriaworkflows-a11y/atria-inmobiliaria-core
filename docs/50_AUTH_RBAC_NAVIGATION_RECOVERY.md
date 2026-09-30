# Auth/RBAC: recuperación de navegación administrativa

Fecha: 2026-09-30.

Rama: `feature/mvp-recovery-live-flows`.

## Auditoría previa

- Rama correcta y árbol limpio antes de editar.
- `git fetch origin` completado.
- HEAD local: `01eaa14 feat(auth): complete password recovery flow`.
- HEAD remoto al iniciar: `39be885 fix(ux): clean encoding and role-aware navigation`.
- Ahead/behind inicial: `1 / 0`; `01eaa14` todavía no estaba en origin.
- Se revisaron los últimos ocho commits, RBAC, rutas, navegación, sidebar,
  AuthProvider/AuthGate, AppShell y las diez páginas de la matriz.
- `.env.local` continúa ignorado; no se modificó ni se imprimieron sus valores.

## Causa comprobada antes de editar

`createSupabaseBrowserClient()` creaba un cliente nuevo en cada llamada.
AuthProvider escucha `SIGNED_IN` y llama a `refreshMembership()`. Esa función
creaba otro cliente, cuya inicialización recuperaba la sesión y emitía otro
`SIGNED_IN` por el canal compartido de Auth. El resultado era un bucle de eventos,
cargas de membership y actualizaciones de React que bloqueaba la navegación.

La reproducción en Edge headless, con sesión ficticia y peticiones externas
interceptadas, resolvió `platform_admin`. Registró 174 consultas de membership
en la primera observación y 2.669 al terminar. Después de abrir el panel admin,
los otros nueve enlaces eran visibles, pero los clics mantenían la URL en
`/dashboard/admin`. No hubo denegación de permisos ni errores de página.

El problema no exigía ampliar la matriz RBAC: `canAccessRoute` ya permitía las
diez rutas a `platform_admin`. Sidebar y AuthGate ya utilizaban esa misma función.

También se comprobó que la consulta de memberships no filtraba `profile_id` y
tomaba veinte filas arbitrarias. Los administradores pueden leer memberships
ajenas según RLS; esas filas no deben determinar el rol de su propia sesión.

## Corrección

- Un único cliente Supabase por navegador. Los usos en servidor conservan
  clientes independientes para evitar compartir sesiones entre solicitudes.
- Memberships filtradas por `profile_id` del usuario de la sesión; se elimina el
  límite arbitrario de veinte filas y se conserva la prioridad de roles existente.
- AuthGate espera la resolución del rol mediante el estado `loading` existente.
- Respuestas anteriores se descartan si hubo otra carga, logout o desmontaje.
- La lectura inicial de sesión no sobrescribe un evento de Auth más reciente.
- Se mantienen AuthGate, los permisos, la fuente común `canAccessRoute` y RLS.
  No se implementa ni se valida CRUD Cloud.

## Matriz final

Sí significa acceso a la página y presencia en sidebar. No significa enlace
ausente y redirección por AuthGate al dashboard propio. La matriz conserva los
permisos anteriores; la lectura de datos continúa limitada por RLS.

| Ruta                     | platform_admin | estate_admin | accountant | owner_readonly |
| ------------------------ | -------------- | ------------ | ---------- | -------------- |
| `/dashboard/admin`       | Sí             | Sí           | No         | No             |
| `/dashboard/contador`    | Sí             | Sí           | Sí         | No             |
| `/dashboard/propietario` | Sí             | Sí           | Sí         | Sí             |
| `/propiedades`           | Sí             | Sí           | Sí         | No             |
| `/herederos`             | Sí             | Sí           | Sí         | No             |
| `/recaudos`              | Sí             | Sí           | Sí         | No             |
| `/gastos`                | Sí             | Sí           | Sí         | No             |
| `/solicitudes`           | Sí             | Sí           | Sí         | Sí             |
| `/liquidacion`           | Sí             | Sí           | Sí         | No             |
| `/auditoria`             | Sí             | Sí           | Sí         | No             |

`accountant` conserva la lectura autorizada de propiedades y propietarios,
trabajo financiero, solicitudes e historial. No gana administración de
propiedades/propietarios ni revisión de solicitudes. `owner_readonly` conserva
solo su dashboard y solicitudes como rutas operativas.

Para cada una de las diez rutas:

- La página existe en `src/app` y usa AppShell con AuthGate activo.
- Con `platform_admin`, sidebar, `canAccessRoute` y AuthGate permiten el acceso.
- No hay redirección ni denegación para ese rol en esas páginas.
- Un rol denegado se redirige a su dashboard. Sin sesión se redirige a `/login`.
- `/` redirige al dashboard por rol. `/login` y `/auth/update-password` conservan
  sus flujos públicos de ingreso y recuperación.

## Pruebas y checks

- Matriz completa de rutas para los cuatro roles, incluyendo sidebar, dashboard
  predeterminado y bloqueo anónimo.
- Ciclo de vida del cliente: reutilización en navegador, aislamiento en servidor
  y rechazo de configuración pública incompleta.
- `node scripts/auth-rbac-smoke.mjs`: PASS, 57/57 comprobaciones con fixtures.
  Incluye login, etiqueta de rol, diez rutas por rol, redirecciones, carga de
  membership retenida, logout con respuesta tardía y membership ausente.
- Smoke: cero clientes duplicados, consultas sin filtro, errores de página y
  peticiones externas inesperadas. Cero peticiones enviadas a Cloud.
- `pnpm format`: PASS.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS, 41/41 tests en nueve archivos.
- `pnpm build`: PASS. Emite una advertencia de detección del plugin Next en
  ESLint; el lint independiente con la configuración existente pasó.
- Después del build se reinició exclusivamente el servidor local de este
  workspace, porque la caché compartida había provocado HTTP 500 en desarrollo.
  `/login` vuelve a responder HTTP 200 y sus cinco scripts cargan sin errores.

El smoke necesita localhost:3000 en modo live con configuración pública y un
navegador instalado; usa Edge por defecto. Intercepta todas las peticiones que
no tengan origen localhost:3000 y solo utiliza usuarios y sesiones ficticios.
No usa credenciales reales ni cambia registros operativos.

No se modificaron permisos ni políticas RLS; no se ejecutaron migraciones,
reset de base de datos, db push, cambios Cloud, merge o deploy.

## Validación manual pendiente

La membership y el login Cloud fueron confirmados manualmente por el usuario.
Esta intervención comprobó `platform_admin` en la reproducción local con
fixtures; no inspeccionó la sesión privada del navegador del usuario.

1. Recargar `/login` con la sesión real y confirmar la etiqueta `Soporte ATRIA`,
   correspondiente a `platform_admin`.
2. Abrir todas las diez rutas de la matriz desde sidebar y directamente por URL.
   Deben permanecer en la ruta elegida, sin denegación ni retorno al panel.
3. Abrir `/` y verificar que termina en `/dashboard/admin`.
4. En `/login`, cerrar sesión y abrir `/dashboard/admin`: debe volver a `/login`.
5. Iniciar sesión de nuevo y repetir una navegación administrativa.

Las páginas existentes aún incluyen datos de ejemplo y paneles base. Esta
verificación cubre Auth/RBAC y navegación; la validación de CRUD live y cierres
financieros continúa fuera de alcance.
