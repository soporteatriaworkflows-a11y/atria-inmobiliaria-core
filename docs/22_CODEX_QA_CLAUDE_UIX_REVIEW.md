# Codex QA Gate — Revision de la capa visual de Claude

Fecha: 2026-06-25
Rol: Codex QA Gate / UIX Merge Reviewer
Rama auditada: `feature/uix-visual-polish-claude`
Base comparada: `feature/uix-visual-polish` (capa Codex) y `main`
Base estable: `main` con tag `production-live-baseline-v1`
Commit de Claude revisado: `7f33a8f feat(uix): segunda capa visual Claude sobre UIX polish`

## Alcance

Auditoria tecnica de la segunda capa visual de Claude: confirmar que no toco
zonas sensibles, validar el reporte, corregir errores evidentes y estabilizar la
rama para preview. Sin tocar `main`, produccion, Supabase ni seguridad.

## Estado verificado

- Carpeta: `D:\ATRIA\ATRIA INMOBILIARIA`.
- Rama: `feature/uix-visual-polish-claude` (working tree limpio).
- Existen `main`, `feature/uix-visual-polish`, `feature/uix-visual-polish-claude`.
- Existe tag `production-live-baseline-v1`.
- La rama de Claude estaba solo en local (sin `origin`) al iniciar la auditoria.

## Auditoria de zonas sensibles (commit de Claude vs base Codex)

Resultado: **NINGUN archivo sensible fue tocado por Claude.**

| Zona                                                 | Tocada por Claude |
| ---------------------------------------------------- | ----------------- |
| `supabase/` (migraciones, RLS, `supabase/tests`)     | NO                |
| `src/lib/finance/` (calculos)                        | NO                |
| `src/lib/supabase/` (cliente)                        | NO                |
| `src/lib/security/` (RBAC)                           | NO                |
| `.env`, `.env.local`, `.env.example`                 | NO                |
| `.vercel/`                                           | NO                |
| `next.config.ts`                                     | NO                |
| `vercel.json`                                        | NO (no existe)    |
| `package.json` / scripts                             | NO                |
| OCR / n8n                                            | NO                |
| Secretos (service role, secret key, DB password/URL) | NO                |

El diff de `7f33a8f` se limita a: `docs/19`, `docs/21` (nuevo), 12 paginas en
`src/app/*`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/`
(`action-list`, `app-shell`, `icons` nuevo, `sidebar-nav` nuevo, `ui`) y
`src/lib/navigation.ts`. Todo frontend/UI.

## Verificacion de las "senales" del reporte

Las alertas del reporte resultaron ser artefactos de truncado de terminal, no
problemas del repositorio:

| Senal reportada              | Hallazgo real                                                          |
| ---------------------------- | ---------------------------------------------------------------------- |
| Archivo `layout.tsn.ts`      | No existe. Solo `src/app/layout.tsx`. Sin archivos mal nombrados.      |
| Ruta `/on`                   | No existe. `navigation.ts` define 12 rutas validas.                    |
| "Nuevos (3)" pero parecian 2 | Correcto: 3 nuevos reales (`docs/21`, `icons.tsx`, `sidebar-nav.tsx`). |
| Texto truncado/corrupto      | No hay corrupcion en el codigo ni en los docs.                         |

## Problemas encontrados

1. **Componente huerfano `SummaryCard`** (`src/components/summary-card.tsx`):
   sin uso en ninguna pagina, ni en la rama de Claude ni en la base de Codex.
   Codigo muerto arrastrado de una fase anterior. (Severidad: baja.)
2. Sin imports rotos, sin componentes muertos adicionales, sin errores de
   accesibilidad evidentes, sin overflow horizontal, sin errores de consola.

## Correcciones realizadas

- Eliminado `src/components/summary-card.tsx` (codigo muerto, sin referencias).
  No afecta ninguna ruta ni el build.
- No se realizaron cambios de diseno: la intencion visual de Claude se mantiene
  intacta (navegacion agrupada con estado activo, paleta ATRIA, microcopy
  humano, login mas confiable, cards mas calidas, badges menos tecnicos).

Nota: `docs/19` (fase Codex) menciona `SummaryCard` como componente "mejorado";
se conserva como registro historico de esa fase. La eliminacion queda registrada
aqui.

## Verificaciones ejecutadas

| Verificacion                            | Resultado                   |
| --------------------------------------- | --------------------------- |
| `pnpm lint`                             | PASS                        |
| `pnpm typecheck`                        | PASS                        |
| `pnpm test`                             | PASS (6/6)                  |
| `pnpm build`                            | PASS (12 rutas + not-found) |
| Smoke HTTP (12 rutas)                   | PASS (200 en todas)         |
| Smoke Playwright Chromium (375px movil) | PASS (12/12)                |

Detalle del smoke Playwright por ruta (viewport 375px):

- HTTP 200 en las 12 rutas.
- Overflow horizontal: 0px en todas.
- Navegacion visible: 12 enlaces en `nav[aria-label="Rutas principales"]`.
- Estado activo: `aria-current="page"` presente en cada ruta.
- Errores de consola: 0.
- Heuristica de datos reales/secretos (`service_role`, `secret key`,
  `private key`, `postgres://`, `password=`): sin coincidencias.

## Riesgos pendientes (heredados, no introducidos por esta auditoria)

- Identidad visual provisional: faltan logo, favicon y manual de marca oficiales.
  La serif Fraunces es decision de diseno, no marca corporativa validada.
- Falta prueba de usabilidad presencial con personas mayores.
- Auth real, CRUD por rol, adjuntos seguros y auditoria poblada siguen fuera de fase.

## Recomendacion final

**APROBAR** la rama `feature/uix-visual-polish-claude` para preview. La capa
visual es tecnicamente sana, no toca backend ni seguridad, pasa todas las
verificaciones y el smoke movil. Integracion sugerida primero hacia
`feature/uix-visual-polish` (o consolidar en `feature/uix-visual-polish-reviewed`),
**nunca directo a `main`**. Antes de `main`: validar marca (logo/favicon/paleta)
y correr una prueba de usabilidad con usuarios mayores. Auth real y CRUD por rol
deben ir en una rama separada.
