# Product Language + Visuals — Production Merge

Fecha: 2026-06-26
Rol: UIX Product Language + Visuals Production Merge
Rama destino: `main`
URL producción: https://atria-inmobiliaria-core.vercel.app

> Nota de gobernanza: AGENTS.md prohíbe por defecto mergear a `main` y desplegar
> producción. Esta integración se ejecutó bajo autorización explícita y directa
> del orquestador humano. Las demás reglas (Supabase, RLS, finance, Auth,
> secretos, datos reales) se mantuvieron intactas.

## Ramas integradas

- `feature/uix-product-language-visuals` -> `main` (merge `--no-ff`, sin squash).
- Esa rama traía también el recolor (`feature/atria-brand-recolor`), que aún no
  estaba en `main`. El merge integró ambas capas: recolor dark tech + lenguaje
  de producto + apoyo visual.

## Commits integrados

- `d33a9c2` feat(brand): recolor dark tech ATRIA (violeta/lavanda)
- `c74fa89` feat(uix): lenguaje de producto + apoyo visual premium
- `988de18` chore(qa): validar lenguaje de producto y visuales (QA Codex)
- `b5e29d4` Merge commit de integración a `main`

## Tags

- `pre-product-language-visuals-main` -> `dcb3075` (snapshot de seguridad de
  `main` previo al merge; rollback). Subido a origin.
- `uix-product-language-visuals-v1` -> commit final de `main` con el lenguaje y
  los visuales en producción. Subido a origin.
- Tags previos intactos: `production-live-baseline-v1`, `pre-uix-merge-main`,
  `uix-visual-polish-v1`, `pre-modern-refine-main`, `uix-modern-refine-v1`.

## Verificaciones

| Verificación | En rama (QA) | Post-merge en main |
| --- | --- | --- |
| `pnpm lint` | PASS | PASS |
| `pnpm typecheck` | PASS | PASS |
| `pnpm test` | PASS (6/6) | PASS (6/6) |
| `pnpm build` | PASS | PASS |
| Smoke local Playwright (desktop+móvil) | PASS (24 vistas) | PASS (24 vistas) |

Verificación de lenguaje (nav en main): presentes Dashboard, Propietarios,
Ingresos, Cierre mensual, Historial, Solicitudes de ajuste; ausentes Herederos,
Recaudos, Liquidacion, Auditoria.

## Verificación de producción

URL: https://atria-inmobiliaria-core.vercel.app

- Deploy de Vercel propagó tras el push (esta vez sin necesidad de retrigger).
- HTTP 200 en las 12 rutas.
- Nueva UI/lenguaje visible: "Dashboard", "Cierre mensual en curso",
  "Propietarios", "Ingresos", "Historial" en navegación y contenido.
- Identidad dark tech ATRIA visible (fondo carbon, acentos violeta/lavanda).
- Modo "Producción activa" visible.
- "Sistema conectado" en navegador (verificación client-side), 0 errores de
  consola.
- Sin datos reales. Sin secretos en el HTML.
- La versión anterior (UIX moderna verde / "Resumen general") ya no aparece como
  estado principal.
- Captura: `artifacts/product-language-visuals-prod/home.png`.

## Qué NO se tocó

`supabase/`, migraciones, RLS, `supabase/tests`, `src/lib/finance/`,
`src/lib/supabase/`, Auth real, configuración y variables de Vercel, `.env*`,
`.vercel`, tokens/claves, datos reales, OCR, n8n, estructura de base de datos,
rutas técnicas. Sin force-push, sin borrado de ramas.

## Nota sobre `pnpm format` global (deuda técnica)

`pnpm format` (Prettier global, `--check .`) falla por archivos PREEXISTENTES al
alcance de esta fase. No bloquea el merge porque:

- los archivos tocados por la capa/QA pasan Prettier focalizado;
- las verificaciones críticas (`lint`, `typecheck`, `test`, `build`) pasan;
- el smoke de 24 vistas pasa.

Queda registrado como deuda técnica: ejecutar un `pnpm format --write` global en
una rama de limpieza dedicada (solo formato, sin cambios funcionales) y revisarlo
por separado.

## Rollback recomendado

El código en `main` está sano y verificado; un rollback solo sería por decisión
de producto. Opciones (sin force-push):

1. Revisar el dashboard de Vercel y "Redeploy" del commit anterior, o
2. `git revert -m 1 b5e29d4` en una rama y PR, o
3. Restaurar el estado de `pre-product-language-visuals-main` (`dcb3075`).

## Siguiente fase recomendada

1. Limpieza de formato global (`pnpm format --write`) en rama dedicada.
2. Marca oficial: logo, favicon y validación de paleta ATRIA.
3. Pasada formal de accesibilidad AA (texto `mist` sobre superficies oscuras).
4. Fase separada de Auth real + RBAC + CRUD base, alimentando KPIs/timeline con
   datos reales del backend (en rama propia, sin tocar la UI consolidada).
5. Considerar renombrar la ruta `/herederos` a `/propietarios` con redirección
   segura.
