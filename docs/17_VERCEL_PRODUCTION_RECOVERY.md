# Vercel Production Recovery

Fecha: 2026-06-25
Repositorio: `soporteatriaworkflows-a11y/atria-inmobiliaria-core`
Proyecto Vercel: `atria-inmobiliaria-core`
Scope Vercel: `soporteatriaworkflows-8854s-projects`
Supabase live unico: `bzoqbjcktoyngvszcwhl`

## Objetivo

Publicar en Vercel Production el commit live de `main` con Supabase conectado mediante variables publicas, sin service role, sin secretos de base de datos y sin datos reales.

## Deployment revisado

- Deployment problemático: `dpl_CnRSKq49KD4Qd3CK1nRWpjjzphYY`
- URL: `https://atria-inmobiliaria-core-czqug3m1m.vercel.app`
- Target: Production
- Estado: `UNKNOWN`
- Build reportado por Vercel: `0ms`
- Logs: no disponibles por CLI

La URL publica principal seguia apuntando al deployment anterior listo:

- `https://atria-inmobiliaria-core.vercel.app`
- Deployment anterior: `dpl_7hYmMBG1nm7K8uG847uNMnvtPfMW`
- Estado: Ready
- Contenido: demo anterior

## Diagnostico

La configuracion de proyecto por CLI estaba correcta:

- Framework preset: Next.js
- Root directory: `.`
- Build command: default Next.js
- Output directory: default Next.js
- Install command: default
- Node.js: `24.x`

`next.config.ts` no contenia `output: "export"` y ese modo no se restauro porque bloquearia Auth, SSR, cookies o integracion futura con Supabase.

El build local con `pnpm build` pasaba, pero producia todas las rutas como estaticas. `vercel build --prod` fallaba con errores como:

- `Unable to find lambda for route: /dashboard/contador`
- `Unable to find lambda for route: /dashboard/propietario`

Esto indicaba una incompatibilidad entre el artefacto puramente estatico y el empaquetado de Vercel para este proyecto. La correccion segura fue forzar render dinamico en el layout raiz.

## Correccion aplicada

Archivo: `src/app/layout.tsx`

Se agrego:

```ts
export const dynamic = "force-dynamic";
```

Razon:

- Evita depender de export estatico.
- Mantiene compatibilidad con Auth, cookies, SSR y server actions futuras.
- Hace que Next genere rutas dinamicas (`ƒ`) en `pnpm build`.
- Permite a Vercel empaquetar funciones para las rutas.

## Resultado de build local

Despues del cambio, `pnpm build` muestra rutas server-rendered on demand (`ƒ`) para las rutas de la app.

`vercel build --prod` avanzo mas alla del problema de lambdas faltantes, pero en Windows quedo bloqueado por permisos locales al crear symlinks en `.vercel/output`:

```text
EPERM: operation not permitted, symlink '_not-found.func'
```

Este bloqueo es local de Windows/permisos para prebuilt y no requiere cambiar a `output: "export"`.

## Variables Production confirmadas

Variables publicas esperadas:

- `NEXT_PUBLIC_APP_MODE=live`
- `NEXT_PUBLIC_SUPABASE_URL=https://bzoqbjcktoyngvszcwhl.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` configurada

No se agregaron ni deben agregarse al frontend:

- service role key
- secret key
- database password
- direct database URL
- Vercel token
- GitHub token

## Comandos ejecutados

- `git status --short --branch`
- `git log --oneline -10`
- `git branch -a`
- `git remote -v`
- `vercel inspect dpl_CnRSKq49KD4Qd3CK1nRWpjjzphYY`
- `vercel logs dpl_CnRSKq49KD4Qd3CK1nRWpjjzphYY`
- `vercel ls atria-inmobiliaria-core`
- `vercel project inspect atria-inmobiliaria-core`
- `vercel env pull .\.vercel\.env.production.local --environment=production --yes`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm exec supabase test db`
- `vercel build --prod`

## Estado de seguridad

- No se tocaron proyectos Supabase ajenos.
- No se tocaron contenedores Docker ajenos.
- No se cargaron datos reales.
- No se uso service role.
- No se imprimieron valores completos de claves.
- `.env.local` y `.vercel/` siguen ignorados por Git.

## Riesgos pendientes

- El proyecto Vercel original tuvo multiples deployments en `UNKNOWN/build 0ms`; si el nuevo commit no reconstruye correctamente en remoto, revisar en Dashboard la integracion Git y la cola/build pipeline del proyecto.
- El prebuilt local desde Windows puede requerir permisos de symlink o Developer Mode; no es necesario para el flujo Git remoto.
- Antes de cargar datos reales faltan Auth, politicas operativas, flujos de auditoria en UI, backup/rollback y validacion legal/financiera.

## Rollback seguro

Si el deployment live causa un problema visible:

1. Cambiar `NEXT_PUBLIC_APP_MODE` en Production a `demo`.
2. Redeploy desde Vercel Dashboard o CLI.
3. No remover migraciones ni tocar Supabase.
4. Confirmar que la URL publica vuelve a mostrar datos sanitizados.

## Siguiente verificacion

Despues de hacer push del commit de recuperacion:

1. Verificar que Vercel cree un deployment Production nuevo desde `main`.
2. Confirmar estado `Ready`.
3. Abrir `https://atria-inmobiliaria-core.vercel.app`.
4. Confirmar banner live y estado de Supabase.
5. Confirmar que no aparecen datos reales ni valores de claves.
