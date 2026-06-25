# Production Live Verification

Fecha: 2026-06-25
Proyecto: `atria-inmobiliaria-core`
URL final: `https://atria-inmobiliaria-core.vercel.app`
Scope Vercel: `soporteatriaworkflows-8854s-projects`
Proyecto Vercel: `atria-inmobiliaria-core`
Supabase live unico: `atria-inmobiliaria` / `bzoqbjcktoyngvszcwhl`
Supabase URL publica: `https://bzoqbjcktoyngvszcwhl.supabase.co`

## Objetivo

Verificar que Production ya no sirve la demo anterior, que el deployment live esta en estado Ready, que la app usa Supabase con variables publicas y que no hay secretos configurados para frontend.

## Estado Git al verificar

- Rama: `main`
- Estado: limpio y sincronizado con `origin/main`
- Commit desplegado observado al iniciar la verificacion: `6646044 chore: retrigger production deploy after GitHub connection refresh`

## Vercel Production

Deployment activo observado desde el alias principal:

- Alias: `https://atria-inmobiliaria-core.vercel.app`
- Deployment URL: `https://atria-inmobiliaria-core-9k5wkqhia.vercel.app`
- Deployment ID: `dpl_H1BJTnvEt5Xajj3UcD42qRsB8WN7`
- Target: Production
- Estado: Ready
- Duracion listada: 43s
- Build: funciones lambda generadas para rutas de la app

El bloqueo anterior quedo resuelto:

- Ya no esta `Blocked`.
- Ya no esta `UNKNOWN`.
- Ya no aparece como `build 0ms` sin outputs.

## Verificacion HTTP y UI

Verificacion HTTP:

- `GET /`: 200
- Rutas principales revisadas en logs de Vercel: `/`, `/login`, `/dashboard/admin`, `/dashboard/contador`, `/dashboard/propietario`, `/propiedades`, `/herederos`, `/recaudos`, `/gastos`, `/liquidacion`, `/solicitudes`, `/auditoria`.
- Logs recientes: respuestas 200 para rutas de aplicacion. Solo se observaron 404 de favicon, sin impacto funcional.

Verificacion con navegador headless:

- `Modo live`: visible.
- `Produccion conectada`: visible.
- `Supabase conectado`: visible despues de ejecutar cliente en navegador.
- `Modo demo seguro`: no visible.
- Error de variables faltantes: no visible.
- Errores de consola: ninguno observado.
- Texto literal de publishable key: no visible en el cuerpo de la pagina.
- Texto `service_role`: no visible en el cuerpo de la pagina.

## Variables Production

Variables publicas activas:

| Variable | Estado | Uso frontend |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_MODE` | configurada como `live` | Si |
| `NEXT_PUBLIC_SUPABASE_URL` | apunta a `https://bzoqbjcktoyngvszcwhl.supabase.co` | Si |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | existe | Si, es publica |

Variables prohibidas no encontradas por nombre en Production pull local:

- service role key
- secret key
- database password
- direct database URL
- `VERCEL_TOKEN`
- GitHub token

Nota: `.vercel/.env.production.local` es un archivo local ignorado por Git y no debe commitearse.

## Supabase

Backend usado:

- Nombre visible: `atria-inmobiliaria`
- Project ref: `bzoqbjcktoyngvszcwhl`
- URL publica: `https://bzoqbjcktoyngvszcwhl.supabase.co`

La comprobacion de frontend confirma que la app puede inicializar Supabase con URL publica y publishable key publica. No se uso service role, secret key, password de base de datos ni URL directa de base de datos.

## Verificaciones locales

- `pnpm lint`: PASS
- `pnpm typecheck`: PASS
- `pnpm test`: PASS, 3 archivos / 6 tests
- `pnpm build`: PASS, rutas dinamicas server-rendered on demand
- `pnpm exec supabase test db`: PASS, RLS local 12/12

## Secretos y datos reales

- No se cargaron datos reales.
- No se usaron PDF, Excel, nombres, direcciones, cedulas, cuentas bancarias ni comprobantes reales.
- No se imprimieron claves completas.
- No se agregaron variables secretas al frontend.
- No se tocaron proyectos Supabase ajenos ni Construction Ops.

## Riesgos pendientes antes de datos reales

- Falta implementar Auth real y sesiones por rol.
- Falta conectar flujos CRUD con RLS validado desde UI autenticada.
- Falta definir politica operativa de cargas, adjuntos y revisiones manuales.
- Falta monitoreo de errores y auditoria visible para operaciones reales.
- Falta estrategia de backup/restore, rollback funcional y plan de respuesta a incidentes.
- Falta validacion legal/financiera antes de ingresar datos personales o financieros reales.
- Favicon devuelve 404; es cosmetico y no bloquea la base live.

## Siguiente fase recomendada

Fase UIX visual con Claude:

1. Revisar pantallas live con foco en personas mayores.
2. Mejorar jerarquia visual sin cambiar modelo de datos ni migraciones.
3. Mantener modo live conectado a Supabase y sin datos reales.
4. Preparar Auth real y CRUD por rol como fase posterior separada.
