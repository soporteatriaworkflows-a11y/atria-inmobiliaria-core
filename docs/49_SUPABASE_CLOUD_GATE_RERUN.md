# Supabase Cloud Activation Gate — Safe Re-Run Runbook

Fecha: 2026-07-05

Rama: `feature/auth-rbac-crud-foundation`

Estado: **tooling preparado / gate aún detenido por rotación de claves**

## Contexto

La compuerta Cloud (`docs/48_SUPABASE_CLOUD_ACTIVATION_GATE.md`) se detuvo porque el
Supabase CLI imprimió API keys sensibles en consola durante un fallo de parseo.
No se commiteó ningún secreto, pero por regla se trata como exposición y exige
rotar/revocar las claves antes de retomar.

Este runbook y el script `scripts/supabase-cloud-gate.sh` permiten **repetir la
compuerta sin imprimir claves**, atacando la causa raíz del blocker.

## Causa raíz mitigada

- El script **nunca** ejecuta `supabase projects api-keys` (el comando que filtró).
- Toda salida de comandos pasa por un filtro `redact()` antes de tocar consola o
  log (enmascara URIs `postgres://`, JWTs `eyJ…`, `sb_secret_…`, y pares
  `password/secret/api_key=`).
- Solo emite etiquetas + conteos agregados; nunca filas personales.
- Ninguna operación Cloud corre sin `--confirm-cloud`; aplicar migración exige
  además `--apply-migration`.
- Usa únicamente el connection string de DB (credencial backend) para lecturas
  agregadas. No usa, lee ni imprime el `service_role` API key y no toca frontend.

## Prerrequisito bloqueante (acción manual del usuario)

**Antes** de correr el script contra Cloud:

1. Identificar el esquema de keys en el dashboard
   (`.../project/bzoqbjcktoyngvszcwhl/settings/api-keys`).
2. Rotar/revocar la clave expuesta:
   - Esquema nuevo: revocar la `sb_secret_…` y crear una nueva; rotar la
     publishable si el plan lo permite.
   - Esquema legacy: regenerar el JWT secret (invalida `anon` y `service_role` y
     todas las sesiones).
3. Si la publishable/anon cambió, actualizar `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   en Vercel (variable pública, no `NEXT_PUBLIC_` para la secret).

No pegar ninguna clave en el repo ni en la consola.

## Uso del script

```sh
# 1) Local-only (no toca Cloud): preflight + auditoría de la migración RLS
scripts/supabase-cloud-gate.sh

# 2) Lecturas Cloud (tras rotar y re-linkear): migration list + smoke agregado
scripts/supabase-cloud-gate.sh --confirm-cloud

# 3) Aplicar la migración RLS a Cloud (operación DDL de base de datos)
scripts/supabase-cloud-gate.sh --confirm-cloud --apply-migration
```

### Entrada sensible

El smoke agregado necesita el connection string de DB en `SUPABASE_DB_URL`
(variable de entorno o línea `SUPABASE_DB_URL=` en `.env.local`, ignorado por
Git). Se lee en silencio y **nunca** se imprime. Obtenerlo en:
Project Settings → Database → Connection string (URI). Preferir rol de menor
privilegio / pooler cuando sea posible.

### Qué verifica el smoke agregado (sin exponer datos)

- `organization_count` — informativo.
- `admin_memberships` (`platform_admin`/`estate_admin`) — debe ser `>= 1` (anti-lockout).
- `fixture_admin_ready` — informativo.
- `rls_functions_present` — `>= 5` funciones de la migración presentes.
- `owner_scope_policies_present` — `>= 5` policies owner-scope presentes
  (confirma que `202606270001` está aplicada).

## Salida y artefactos

- Log redactado en `artifacts/supabase-cloud-activation/gate-run-<timestamp>.log`
  (directorio ignorado por Git).
- El script devuelve exit `0` si no hubo `[FAIL]` en las fases ejecutadas.

## Verificación local realizada (2026-07-05)

- `bash -n scripts/supabase-cloud-gate.sh`: sintaxis OK.
- Ejecución local-only: RESULT PASS. Preflight + auditoría RLS en verde.
- Confirmado que el log se genera en `artifacts/` y queda git-ignored.
- Confirmado que solo `scripts/supabase-cloud-gate.sh` aparece como archivo nuevo.
- No se ejecutó ninguna fase Cloud (`--confirm-cloud` no usado).

## Pendientes del blocker (orden)

1. **[usuario]** Rotar/revocar claves expuestas en el dashboard.
2. **[usuario]** Confirmar esquema (nuevo/legacy) y si la publishable cambió.
3. Actualizar `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en Vercel si cambió.
4. Re-linkear en este PC: `pnpm exec supabase link --project-ref bzoqbjcktoyngvszcwhl`.
5. `scripts/supabase-cloud-gate.sh --confirm-cloud` (list + smoke agregado).
6. Aplicar RLS: `--confirm-cloud --apply-migration` (con plan de rollback).
7. Recrear/verificar admin fixture (`platform_admin`) y confirmar no lockout.
8. Verificar login Cloud real del admin.
9. Repetir release gate (`docs/46`) y decidir merge.

## Reglas respetadas

- No se tocó `main`. No se desplegó producción.
- No se imprimieron ni commitearon secretos.
- No se usó service role en frontend.
- No se ejecutaron operaciones Cloud en esta preparación.
- No se tocaron datos reales, Construction Ops, ni `VIDEOS DE PROCESO/`.
- No hubo force push ni borrado de ramas.
