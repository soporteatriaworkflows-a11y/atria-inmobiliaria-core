# Codex QA Gate - Product Language + Visuals

Fecha: 2026-06-26
Rama auditada: `feature/uix-product-language-visuals`
Base visual: `feature/atria-brand-recolor`
Base de integracion: `main`
Commit auditado: `c74fa89 feat(uix): lenguaje de producto + apoyo visual premium`

## Estado inicial verificado

- Carpeta actual: `D:\ATRIA\ATRIA INMOBILIARIA`.
- Rama actual: `feature/uix-product-language-visuals`.
- Existen ramas locales/remotas relevantes: `main`, `feature/atria-brand-recolor`, `feature/uix-product-language-visuals`.
- Existen tags requeridos: `uix-modern-refine-v1`, `pre-modern-refine-main`.
- Working tree tenia un directorio no trackeado `VIDEOS DE PROCESO/`; se dejo fuera del alcance y no se agrega al commit.

## Archivos modificados en la rama

Diff contra `feature/atria-brand-recolor` del commit auditado:

- `docs/28_PRODUCT_LANGUAGE_AND_VISUALS.md`
- `src/app/auditoria/page.tsx`
- `src/app/dashboard/admin/page.tsx`
- `src/app/dashboard/contador/page.tsx`
- `src/app/dashboard/propietario/page.tsx`
- `src/app/gastos/page.tsx`
- `src/app/herederos/page.tsx`
- `src/app/liquidacion/page.tsx`
- `src/app/page.tsx`
- `src/app/propiedades/page.tsx`
- `src/app/recaudos/page.tsx`
- `src/app/solicitudes/page.tsx`
- `src/components/viz.tsx`
- `src/lib/navigation.ts`

Correcciones QA aplicadas en esta revision:

- `src/components/app-shell.tsx`: copy visible de conexion sin nombrar proveedor tecnico.
- `src/components/viz.tsx`: atributos ARIA en `ProgressBar` y SVG decorativo en `Donut`.
- `src/app/liquidacion/page.tsx`: traduccion UI-only de `basis points` a lenguaje de negocio, sin tocar el motor financiero.
- `docs/29_CODEX_QA_PRODUCT_LANGUAGE_VISUALS.md`: este reporte.

## Archivos sensibles no tocados

Confirmado sin cambios contra `main` y contra `feature/atria-brand-recolor` en:

- `supabase/`
- `supabase/migrations/`
- `supabase/tests/`
- `src/lib/finance/`
- `src/lib/supabase/`
- `.env`, `.env.local`, `.env.example`
- `.vercel/`
- `next.config.ts`
- `vercel.json`
- `package.json` y scripts

No se usaron datos reales, service role, secret key, password de base de datos ni DB URL. No se tocaron produccion, Supabase, RLS, migraciones, Auth real, Vercel config, OCR ni n8n.

## Lenguaje visible auditado

Verificado en `src/lib/navigation.ts` y smoke local:

- `Herederos` -> `Propietarios`.
- `Recaudos` -> `Ingresos`.
- `Liquidacion` -> `Cierre mensual` / `Distribucion mensual` en copy visible.
- `Auditoria` -> `Historial` / `Registro de actividad`.
- `Supabase conectado` -> `Sistema conectado` / conexion del sistema.
- `datos sanitizados/demo` -> `Datos de prueba` / `valores de ejemplo`.

Busqueda y smoke local no encontraron terminos tecnicos innecesarios visibles: `RLS`, `append-only`, `DB`, `schema`, `CRUD`, `datos sanitizados`, `Supabase conectado`, `basis points`.

## Componentes visuales auditados

Archivo: `src/components/viz.tsx`.

- `ProgressBar`: CSS puro, sin dependencias, valores acotados 0-100, ahora con `role="progressbar"` y `aria-valuemin/max/now`.
- `LabeledBar`: compone label, caption y barra; no calcula finanzas ni consulta backend.
- `Donut`: SVG puro, proporcional al valor recibido, sin backend ni secretos, SVG marcado como decorativo.
- `TimelineItem`: semantica esperada dentro de listas `ol/li`, sin dependencias ni datos remotos.

Los datos provienen de fixtures demo existentes y el UI indica datos de prueba/valores de ejemplo. No hay exposicion de secretos ni dependencia de backend real.

## Rutas auditadas

Smoke Playwright local contra `http://localhost:3000` en desktop `1440x1000` y movil `390x844`:

- `/`
- `/login`
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

Resultado: 24 cargas verificadas, HTTP 200, sin errores de consola, sin overflow horizontal, navegacion visible, identidad ATRIA dark tech visible, sin verde como identidad dominante, sin datos reales ni secretos.

Evidencia local ignorada por Git:

- `artifacts/uix-product-language-visuals-qa/smoke-local.mjs`
- `artifacts/uix-product-language-visuals-qa/smoke-results.json`

## Verificaciones ejecutadas

- `pnpm.cmd exec prettier --write src/components/viz.tsx src/components/app-shell.tsx src/app/liquidacion/page.tsx`: PASS.
- `pnpm.cmd exec prettier --check src/components/viz.tsx src/components/app-shell.tsx src/app/liquidacion/page.tsx docs/29_CODEX_QA_PRODUCT_LANGUAGE_VISUALS.md`: PASS.
- `pnpm.cmd format`: FAIL por 39 archivos preexistentes fuera de formato en la rama; no se aplico formateo global para no ampliar el alcance QA.
- `pnpm.cmd lint`: PASS.
- `pnpm.cmd typecheck`: PASS.
- `pnpm.cmd test`: PASS, 3 archivos / 6 tests.
- `pnpm.cmd build`: PASS.
- Smoke Playwright local desktop + movil, 12 rutas: PASS, 24/24.

Nota: `next build` mantiene warning no bloqueante sobre plugin ESLint de Next no detectado. No fue introducido por esta rama QA.

## Problemas encontrados y correcciones

- Copy tecnico residual en `AppShell`: "Faltan variables publicas de Supabase para modo live". Corregido a "Falta configurar la conexion segura del sistema".
- `ProgressBar` no exponia estado a tecnologias asistivas. Corregido con atributos ARIA.
- `Donut` usaba SVG visual sin marcarlo como decorativo. Corregido con `aria-hidden="true"`.
- En cierre mensual, un supuesto proveniente del motor financiero mostraba `basis points`. Corregido en UI con traduccion local, sin tocar `src/lib/finance/`.

## Recomendacion final

APROBAR la rama `feature/uix-product-language-visuals` para integracion segura a `main` despues de autorizacion explicita del orquestador humano. La rama auditada es de UI/copy/docs, no toca archivos sensibles, pasa verificaciones tecnicas y smoke local.

No se realizo merge a `main` y no se desplego produccion.
