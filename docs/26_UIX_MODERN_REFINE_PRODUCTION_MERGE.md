# UIX Modern Refine — Production Merge

Fecha: 2026-06-26
Rol: UIX Modern Refine Production Merge
Rama destino: `main`
URL produccion: https://atria-inmobiliaria-core.vercel.app

> Nota de gobernanza: AGENTS.md prohibe por defecto mergear a `main` y desplegar
> produccion. Esta integracion se ejecuto bajo autorizacion explicita y directa
> del orquestador humano. Las demas reglas (Supabase, RLS, finance, Auth,
> secretos, datos reales) se mantuvieron intactas.

## Rama integrada

- `feature/uix-modern-refine` -> `main` (merge `--no-ff`, sin squash).

## Commits integrados

- `301d688` feat(uix): capa visual moderna, compacta y premium
- `5ab226d` Merge commit de integracion a `main`

## Tags

- `pre-modern-refine-main` -> `07f5b73` (snapshot de seguridad de `main` previo
  al merge; permite rollback). Subido a origin.
- `uix-modern-refine-v1` -> commit final de `main` con la UI moderna en
  produccion. Subido a origin.
- Tags previos intactos: `production-live-baseline-v1`, `pre-uix-merge-main`,
  `uix-visual-polish-v1`.

## Auditoria de archivos sensibles (NO tocados)

Diff `pre-modern-refine-main..main` revisado. El merge NO toco:

- `supabase/` (migraciones, RLS, `supabase/tests`)
- `src/lib/finance/` (calculos)
- `src/lib/supabase/` (cliente)
- `.env`, `.env.local`, `.env.example`
- `.vercel/`
- `next.config.ts`
- `vercel.json` (no existe)
- `package.json` / scripts
- OCR / n8n

Cambios del merge: solo `docs/`, `src/app/*` (UI), `src/components/*` (UI) y
`tailwind.config.ts` (tokens). El componente `supabase-live-status.tsx` cambio
solo en presentacion; su logica de conexion no se modifico.

## Verificaciones

| Verificacion                           | En rama          | Post-merge en main |
| -------------------------------------- | ---------------- | ------------------ |
| `pnpm lint`                            | PASS             | PASS               |
| `pnpm typecheck`                       | PASS             | PASS               |
| `pnpm test`                            | PASS (6/6)       | PASS (6/6)         |
| `pnpm build`                           | PASS             | PASS               |
| Smoke local Playwright (desktop+movil) | PASS (24 vistas) | PASS (24 vistas)   |

Smoke: HTTP 200 en las 12 rutas, 0 overflow horizontal, navegacion visible
(12 enlaces), estado activo presente, 0 errores de consola.

## Estado del deploy de produccion (RESUELTO: live)

- Push inicial a `origin/main`: `07f5b73..5ab226d`.
- Tras mas de 20 minutos, la URL de produccion seguia sirviendo la version
  anterior (UIX visual-polish), incluso con cache-buster: el deploy automatico
  de Vercel no habia propagado el commit. Coincide con la flakiness historica de
  la integracion GitHub -> Vercel del proyecto.
- Por reglas no negociables NO se tocaron variables ni configuracion de Vercel,
  ni `.vercel/`, ni se uso Vercel CLI. La integracion MCP de Vercel no tiene
  acceso a este proyecto (sin teams), por lo que no se consulto el build por API.
- Mitigacion: commit de documentacion en `main` (`4254788`) como retrigger del
  pipeline (mismo patron que uso el equipo antes). El retrigger funciono.
- Verificacion final en produccion: HTTP 200 en las 12 rutas, nueva UI moderna
  visible ("Resumen general", "Datos de prueba", "Accesos rapidos", sidebar
  oscura), modo live "Produccion activa", estado "Sistema conectado" en navegador,
  0 errores de consola, sin secretos ni datos reales, y la version anterior ya no
  aparece como estado principal. Captura: `artifacts/uix-modern-refine-prod/`.

## Que NO se toco

Backend, Supabase, migraciones, RLS, `supabase/tests`, calculos, `src/lib/finance`,
`src/lib/supabase` (logica), Auth real, variables de Vercel, `.env*`, `.vercel`,
tokens/claves, datos reales, OCR, n8n. Sin force-push, sin borrado de ramas.

## Rollback recomendado

El codigo en `main` esta sano y verificado localmente; el problema es de pipeline,
no de codigo. Opciones:

1. Preferida: revisar el dashboard de Vercel y re-disparar el deploy del commit
   `5ab226d` (o "Redeploy"). No requiere cambios de codigo.
2. Si se necesita revertir el codigo de `main`:
   `git revert -m 1 5ab226d` en una rama y PR (sin force-push), o restaurar el
   estado de `pre-modern-refine-main` (`07f5b73`).

## Riesgos pendientes

- Deploy de produccion pendiente de propagar (pipeline GitHub -> Vercel).
- Identidad de marca provisional: faltan logo, favicon y paleta oficiales; tokens
  `night/slate/haze/surface` son derivados temporales.
- En movil la navegacion se apila arriba sin menu colapsable (mejora futura).
- Auth real, RBAC, CRUD, adjuntos y datos reales siguen fuera de alcance.

## Siguiente fase recomendada

1. Confirmar/forzar el deploy de produccion desde el dashboard de Vercel y
   re-verificar las 12 rutas + modo live + estado de conexion en navegador.
2. Crear el tag `uix-modern-refine-v1` una vez la UI moderna este live.
3. Validacion de marca (logo/favicon/paleta) y prueba de usabilidad.
4. Fase separada de Auth real + RBAC + CRUD base (rama propia, sin tocar UI).
