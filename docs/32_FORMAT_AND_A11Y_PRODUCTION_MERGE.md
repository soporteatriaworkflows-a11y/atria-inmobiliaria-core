# Format and A11y Production Merge

Fecha: 2026-06-26
Rama integrada: `chore/format-and-a11y`
Base de integracion: `main`
Commit aprobado de la rama: `9acedc3 chore: format and a11y pass`
Merge commit en `main`: `c911598 Merge format and a11y pass`
URL produccion: <https://atria-inmobiliaria-core.vercel.app>

## Tags

- Rollback previo al merge: `pre-format-and-a11y-main`.
- Release final: `format-and-a11y-v1`.

## Alcance integrado

- Limpieza de formato Prettier en documentos y UI.
- Ajustes basicos de accesibilidad visual:
  - foco visible mas contrastado con `outline-atria-lavender`;
  - mayor contraste en titulos de grupos del sidebar;
  - puntos decorativos marcados con `aria-hidden`;
  - barras `ProgressBar` con valores ARIA y labels contextuales;
  - timeline legible por texto, no solo por color;
  - navegacion con `aria-current="page"` conservado.
- Documentacion de QA en `docs/31_FORMAT_AND_A11Y_PASS.md`.

## Excepcion de formato autorizada

Se aplico Prettier exclusivamente a estos dos archivos para cerrar el gate global:

- `next.config.ts`
- `src/lib/supabase/client.ts`

La revision de diff confirmo que no hubo cambio textual funcional en esos archivos despues de Prettier. No se cambio configuracion funcional de Next ni comportamiento de Supabase.

## Verificaciones locales

Ejecutadas despues del merge local a `main`:

- `pnpm format`: PASS.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS, 3 archivos / 6 tests.
- `pnpm build`: PASS.
- Smoke local Playwright, 12 rutas en desktop y movil: PASS, 24/24.

`pnpm build` mantiene el warning no bloqueante y preexistente sobre plugin ESLint de Next no detectado.

## Smoke local

Rutas cubiertas:

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

Resultado local: HTTP 200, sin errores de consola, sin overflow horizontal, navegacion visible, foco visible, textos profesionales, sin datos reales y sin secretos expuestos.

## Produccion

Verificacion despues del push de `main`:

- URL: <https://atria-inmobiliaria-core.vercel.app>
- HTTP: 200 OK.
- Estado Vercel: Ready inferido por respuesta publica 200 desde Vercel Production.
- Consola: sin errores de consola en Playwright.
- UI: ATRIA visible, navegacion profesional visible, datos de prueba visibles.
- Conexion: la UI muestra `Sistema conectado`.
- Secretos/datos reales: no se detectaron service role, secret keys, DB password, DB URL, tokens ni datos reales en texto visible.

Observacion tecnica: Playwright reporto un `HEAD` abortado hacia la consulta publica de Supabase durante la verificacion de la home. No se emitio error de consola, la pagina respondio 200 y el componente visible quedo en `Sistema conectado`.

## No se toco

- `supabase/`
- migraciones
- RLS
- `supabase/tests/`
- `src/lib/finance/`
- Auth real
- `.env`, `.env.local`, `.vercel`, tokens o claves
- datos reales
- OCR / n8n
- rutas tecnicas

## Rollback

Rollback disponible en el tag:

```bash
git switch main
git reset --hard pre-format-and-a11y-main
```

No ejecutar rollback sin autorizacion explicita del orquestador humano.

## Riesgos pendientes

- El warning de ESLint/Next en `pnpm build` sigue pendiente, no bloqueante.
- La accesibilidad validada es basica. Antes de Auth/RBAC/CRUD real conviene agregar prueba automatizada con axe o equivalente.
- Auth real, RBAC, CRUD, permisos por rol y flujos con errores accesibles siguen fuera de esta fase.

## Siguiente fase recomendada

Iniciar Auth real + RBAC + CRUD en rama separada, con pruebas de permisos, estados de carga/error accesibles, validaciones de formulario, RLS y flujos por rol.
