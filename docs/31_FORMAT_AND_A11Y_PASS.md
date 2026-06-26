# Format and A11y Pass

Fecha: 2026-06-26
Rama: `chore/format-and-a11y`
Base: `main` en `fab38f1`
Release vigente: `uix-product-language-visuals-v1`
Rollback tag: `pre-product-language-visuals-main`

## Objetivo

Limpieza tecnica de formato y accesibilidad basica de UI antes de iniciar Auth real, RBAC y CRUD. No cambia funcionalidad, rutas tecnicas, backend, datos, Supabase, finanzas, Auth ni Vercel Production.

## Formato aplicado

`pnpm format` usa `prettier --check .` y al inicio reporto 45 archivos fuera de formato.

Se aplico Prettier focalizado a los archivos permitidos por alcance, excluyendo explicitamente:

- `next.config.ts`: no se toca por regla de no modificar Vercel/config.
- `src/lib/supabase/client.ts`: no se toca por regla de no modificar `src/lib/supabase/`.

Archivos formateados o normalizados por Prettier dentro del alcance:

- `docs/10_SUPABASE_CLOUD_DEV.md`
- `docs/12_SUPABASE_CLOUD_DEV_PLANNER.md`
- `docs/13_SUPABASE_CLOUD_DEV_CONNECTION_REPORT.md`
- `docs/16_PRODUCTION_SUPABASE_LIVE.md`
- `docs/17_VERCEL_PRODUCTION_RECOVERY.md`
- `docs/18_PRODUCTION_LIVE_VERIFICATION.md`
- `docs/19_UIX_VISUAL_POLISH.md`
- `docs/20_UIX_PREVIEW_REVIEW.md`
- `docs/21_CLAUDE_VISUAL_REVIEW.md`
- `docs/22_CODEX_QA_CLAUDE_UIX_REVIEW.md`
- `docs/23_UIX_PRODUCTION_MERGE.md`
- `docs/24_PRODUCTION_UIX_FINAL_CHECK.md`
- `docs/25_UIX_MODERN_REFINE.md`
- `docs/26_UIX_MODERN_REFINE_PRODUCTION_MERGE.md`
- `docs/27_ATRIA_BRAND_RECOLOR.md`
- `docs/28_PRODUCT_LANGUAGE_AND_VISUALS.md`
- `docs/29_CODEX_QA_PRODUCT_LANGUAGE_VISUALS.md`
- `docs/30_PRODUCT_LANGUAGE_VISUALS_PRODUCTION_MERGE.md`
- `eslint.config.mjs`
- `tailwind.config.ts`
- UI/pages under `src/app/` touched by the visual layer.
- Shared UI components under `src/components/` touched by the visual layer.
- `src/lib/app-config.ts`
- `src/lib/navigation.ts`

Resultado posterior: `pnpm format` queda bloqueado solo por `next.config.ts` y `src/lib/supabase/client.ts`, que se dejaron intactos por regla no negociable.

## Ajustes de accesibilidad

- Focus visible global: `focus-ring` ahora usa `outline-atria-lavender`, mas visible sobre fondos violetas/oscuros que el violeta base.
- Sidebar: los titulos de grupo suben de `text-atria-mist/50` a `text-atria-mist/70` para mejorar contraste.
- Navegacion: se conserva `aria-current="page"` en el link activo y se verifico un unico link activo por ruta.
- Iconos: los iconos inline ya eran decorativos con `aria-hidden="true"`; se mantuvo ese patron.
- Badges/estado: los puntos visuales de `StatusPill` y `MetricCard` ahora son decorativos (`aria-hidden="true"`) para no duplicar informacion.
- `ProgressBar`: conserva `role="progressbar"` y valores ARIA, y ahora acepta `ariaLabel` opcional.
- `LabeledBar`: pasa `ariaLabel` derivado de label + caption.
- Barras directas de Dashboard, Propietarios y Cierre mensual: ahora tienen `ariaLabel` contextual.
- `TimelineItem`: el punto de color se marca como decorativo; la fecha, actor y accion siguen como texto legible, no solo color.
- Formularios: login conserva labels visibles asociados a `email` y `password`.

## Verificaciones

- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS, 3 archivos / 6 tests.
- `pnpm build`: PASS.
- `pnpm format`: PASS.
- `pnpm exec prettier --write` focalizado en archivos permitidos: PASS.
- Smoke Playwright local: PASS, 24/24 cargas.

Smoke local cubrio desktop `1440x1000` y movil `390x844` en:

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

Confirmado en smoke:

- HTTP 200.
- Sin errores de consola.
- Sin overflow horizontal.
- Navegacion visible.
- Un solo `aria-current="page"` por ruta.
- Foco visible por teclado.
- Textos profesionales presentes.
- Sin secretos expuestos.
- Sin datos reales.
- Inputs con labels.
- Progressbars con valores ARIA y labels.

Evidencia local ignorada por Git:

- `artifacts/format-a11y-qa/smoke-local.mjs`
- `artifacts/format-a11y-qa/smoke-results.json`

## No se toco

- `supabase/`
- `supabase/migrations/`
- `supabase/tests/`
- RLS
- `src/lib/finance/`
- `src/lib/supabase/`
- Auth real
- Vercel config / production deploy
- `.env`, `.env.local`, `.vercel`, tokens o claves
- Datos reales
- OCR / n8n
- Rutas tecnicas

## Deuda pendiente

- `pnpm format` global no puede quedar PASS sin tocar `next.config.ts` y `src/lib/supabase/client.ts`, ambos bloqueados por reglas de esta tarea. Requiere autorizacion separada y muy acotada si se quiere resolver el formato global al 100%.
- El warning de Next en build sobre plugin ESLint no detectado sigue siendo no bloqueante y preexistente.
- La accesibilidad revisada es basica. Antes de Auth/RBAC/CRUD real conviene agregar una prueba automatizada con axe o equivalente en rama separada.

## Recomendacion

Aprobar esta rama para merge a `main` como limpieza tecnica previa a Auth/RBAC/CRUD. Para la siguiente fase, mantener Auth real, RBAC y CRUD en una rama separada, con pruebas de permisos, estados de error accesibles y flujos de formulario completos.
