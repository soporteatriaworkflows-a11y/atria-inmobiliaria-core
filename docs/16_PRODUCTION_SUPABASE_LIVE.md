# 16 - Production Supabase Live

## Objetivo

Conectar Vercel Production de `atria-inmobiliaria-core` al backend Supabase principal de ATRIA sin usar datos reales ni claves privilegiadas.

## Backend Supabase unico

| Campo          | Valor                                      |
| -------------- | ------------------------------------------ |
| Nombre visible | `atria-inmobiliaria`                       |
| Project ref    | `bzoqbjcktoyngvszcwhl`                     |
| URL publica    | `https://bzoqbjcktoyngvszcwhl.supabase.co` |

Por decision operativa, este proyecto Supabase sera el backend principal unico por ahora. No se crea un segundo Supabase DEV/PROD en esta etapa.

No tocar:

- `construction-ops-prod` / `jabddbccmhrxztfzpdii`
- `just-padel-digital` / `riwlwactbxcgttfagwzn`

## Variables de Vercel Production

Variables publicas configuradas en Production:

| Variable                               | Valor / fuente                             | Tipo    | Frontend |
| -------------------------------------- | ------------------------------------------ | ------- | -------- |
| `NEXT_PUBLIC_APP_MODE`                 | `live`                                     | Publica | Si       |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase API URL de `bzoqbjcktoyngvszcwhl` | Publica | Si       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key publica del mismo proyecto | Publica | Si       |

Estas variables son publicas por el prefijo `NEXT_PUBLIC_`; no son service role ni claves secretas.

## Variables prohibidas

Nunca agregar a frontend, Vercel public env, Git, logs, screenshots o chat:

- Supabase service role key.
- Supabase secret key.
- Database password.
- Direct database URL.
- `VERCEL_TOKEN`.
- GitHub token.
- PDFs, Excel, nombres, direcciones, cedulas, cuentas bancarias, comprobantes o datos reales.

## Comportamiento de la app

- `NEXT_PUBLIC_APP_MODE=live`: muestra banner de produccion conectada y activa comprobacion minima de Supabase desde el navegador con publishable key.
- `NEXT_PUBLIC_APP_MODE=demo`: mantiene datos sanitizados estaticos como fallback seguro.
- Si faltan variables publicas en `live`, la UI muestra un error claro sin romper el build.
- La comprobacion live consulta `organizations` con RLS. Si RLS bloquea lectura anonima, se interpreta como conexion activa y datos protegidos.

## Rollback a demo

Si hay un incidente antes de cargar datos reales:

1. En Vercel Production, cambiar `NEXT_PUBLIC_APP_MODE` de `live` a `demo`.
2. Opcionalmente remover `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` de Production.
3. Redeploy Production desde `main`.
4. Verificar que `https://atria-inmobiliaria-core.vercel.app` vuelva a mostrar `Modo demo seguro: datos sanitizados`.

## Riesgos pendientes antes de datos reales

- Auth real aun no esta implementado.
- No hay flujo de login/roles conectado a Supabase Auth.
- Las vistas siguen usando datos demo sanitizados mientras se conecta lectura/escritura por rol.
- Attachments, Storage privado, OCR y n8n siguen fuera de alcance.
- Antes de datos reales se requiere QA de Auth, RLS, auditoria, backups y flujo de reversos/ajustes.

## Verificacion requerida

Antes de promover a datos reales:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec supabase test db
```

Production debe responder HTTP 200 y mostrar modo live sin exponer claves ni datos reales.
