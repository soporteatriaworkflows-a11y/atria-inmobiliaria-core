# UIX Production Merge — Integracion de la capa visual a produccion

Fecha: 2026-06-25
Rol: UIX Production Merge
Rama destino: `main`
URL produccion: https://atria-inmobiliaria-core.vercel.app

> Nota de gobernanza: AGENTS.md prohibe por defecto mergear a `main` y desplegar
> produccion. Esta integracion se ejecuto bajo **autorizacion explicita y directa
> del orquestador humano**, que asumio la responsabilidad de anular esa politica
> para esta fase. Las demas reglas (Supabase, RLS, calculos, Auth, secretos,
> datos reales) se mantuvieron intactas.

## Ramas integradas

- `feature/uix-visual-polish-claude` -> `main` (merge `--no-ff`).
- La rama incluia tambien la capa base de Codex (`feature/uix-visual-polish`),
  que aun no estaba en `main`. El merge trajo la UIX completa.

## Commits integrados

- `26555c5` Polish ATRIA visual UIX (Codex, base)
- `11047db` Document UIX preview verification (Codex)
- `7f33a8f` feat(uix): segunda capa visual Claude (nav agrupada, estado activo,
  iconos, serif de marca, microcopy humano, login confiable, cards calidas)
- `7ac0071` chore(qa): QA gate Codex + limpieza de codigo muerto + docs/22
- `5fcb37c` Merge commit de integracion a `main`

## Tags

- `pre-uix-merge-main` -> `db94248` (snapshot de seguridad de `main` previo al
  merge; permite rollback). Subido a origin.
- `uix-visual-polish-v1` -> commit final de `main` con la UIX en produccion.
  Subido a origin.
- `production-live-baseline-v1` (preexistente) se conserva intacto.

## Auditoria de archivos sensibles (NO tocados)

Diff `pre-uix-merge-main..main` revisado. Confirmado que el merge NO toco:

- `supabase/` (migraciones, RLS, `supabase/tests`)
- `src/lib/finance/` (calculos)
- `src/lib/supabase/` (cliente)
- `src/lib/security/` (RBAC)
- `.env`, `.env.local`, `.env.example`
- `.vercel/`
- `next.config.ts`
- `vercel.json` (no existe)
- `package.json` / scripts
- OCR / n8n

Cambios del merge: solo `docs/`, `src/app/*` (UI), `src/components/*` (UI),
`src/lib/navigation.ts` y `tailwind.config.ts` (paleta ATRIA).

## Verificaciones

| Verificacion | Resultado |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS (6/6) |
| `pnpm build` | PASS (12 rutas + not-found) |
| `pnpm exec supabase test db` | OMITIDO (justificado, ver abajo) |
| Smoke local Playwright 375px | PASS (12/12) |
| Smoke produccion HTTP (12 rutas) | PASS (200 en todas) |

`supabase test db` se omitio a proposito: el merge es UI puro, no cambia
migraciones, RLS ni permisos, por lo que la verification gate de RLS no aplica.
Ademas, arrancar el stack local de Supabase podria afectar otros proyectos
(sin garantia de aislamiento), lo que contradice las reglas no negociables de
esta fase. Ejecutarlo no aportaba senal y si riesgo.

## Verificacion de produccion

URL: https://atria-inmobiliaria-core.vercel.app

- Deploy de Vercel disparado por push a `main`. Estado servido: HTTP 200 (Ready).
- Nueva UIX visible: tipografia serif de marca (`font-display`), navegacion
  agrupada (`Paneles`/`Operacion`/`Control`), estado activo (`aria-current`),
  iconografia propia.
- Modo live visible: "Produccion conectada".
- El estado "Modo demostracion" NO aparece como estado principal.
- Aviso de minimizacion: pill "Datos de ejemplo" presente.
- Estado de Supabase: componente "Plataforma conectada con cuidado" presente; la
  comprobacion real corre en el navegador y muestra mensaje claro segun resultado.
- Seguridad: sin secretos ni datos reales en el HTML (sin `service_role`,
  `secret key`, claves privadas, `postgres://`, `password=`, JWT largos).
- Las 12 rutas principales responden HTTP 200.

## Que NO se toco

Backend, Supabase, migraciones, RLS, `supabase/tests`, calculos financieros,
Auth real, variables de Vercel, `.env*`, `.vercel`, tokens/claves, datos reales,
service role, secret key, DB password, DB URL, OCR, n8n. Sin force-push, sin
borrado de ramas.

## Riesgos pendientes

- Identidad visual provisional: faltan logo, favicon y manual de marca oficiales.
  La serif Fraunces es decision de diseno, no marca corporativa validada.
- Falta prueba de usabilidad presencial con personas mayores.
- Auth real, CRUD por rol, adjuntos seguros y auditoria poblada siguen fuera de fase.
- La conexion live de Supabase depende de las variables publicas configuradas en
  Vercel; el frontend muestra mensaje claro si faltan, pero conviene confirmar el
  estado "Supabase conectado" en navegador tras el deploy.

## Siguiente fase recomendada

1. Validar marca real: logo, favicon y paleta corporativa definitiva.
2. Prueba de usabilidad con usuarios mayores (administrador, contador, propietario).
3. Fase separada de Auth real + RBAC + CRUD por rol (rama propia, fuera de UI).
4. Recien entonces planificar carga de datos reales con auditoria, adjuntos
   seguros y respaldo/rollback.

## Rollback

Si fuese necesario revertir produccion: `git revert -m 1 5fcb37c` en una rama y
PR, o restaurar el estado de `pre-uix-merge-main`. No usar force-push.
