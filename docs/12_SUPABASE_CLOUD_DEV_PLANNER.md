# 12 - Supabase Cloud DEV Planner

## Objective

Prepare a safe, separate Supabase Cloud DEV project for `atria-inmobiliaria-core` without linking, pushing migrations, configuring Vercel Supabase variables, or using real data in this phase.

Target project name:

```text
atria-inmobiliaria-dev
```

Current production demo remains static/demo-oriented at:

```text
https://atria-inmobiliaria-core.vercel.app
```

## Current local status

- Local Supabase CLI: `2.107.0`.
- Local project ID: `atria-inmobiliaria-core-local`.
- Local Supabase stack is separate from `construction-ops`.
- Local ports:

| Service         | Port    |
| --------------- | ------- |
| API             | `55321` |
| Database        | `55322` |
| Shadow database | `55320` |
| Studio          | `55323` |
| Inbucket        | `55324` |

Do not stop or mutate any `construction-ops` containers.

## Cloud DEV project creation checklist

Manual steps for the project owner:

1. Open Supabase dashboard.
2. Create a new project named `atria-inmobiliaria-dev`.
3. Do not reuse any Construction Ops project, database, organization settings, keys, or passwords.
4. Choose the closest available region to Colombia/LatAm from the Supabase dashboard. If a South America region is available in the dashboard, prefer that; otherwise choose the lowest-latency available region after checking Supabase's current options in the dashboard.
5. Create a strong database password and store it outside the repository, chat, screenshots, and commits.
6. Do not paste the database password, service role key, secret key, or direct database URL into frontend code or Vercel public variables.
7. Do not import real PDFs, Excels, names, addresses, IDs, bank data, or receipts.
8. Keep this project DEV-only until QA and security review approve any later production data plan.

## Migration readiness review

Migration file:

```text
supabase/migrations/202606240001_initial_schema.sql
```

The migration currently includes:

- `pgcrypto` extension.
- Application enums.
- Organization-scoped business tables.
- `profiles` referencing `auth.users`.
- Money columns as `NUMERIC(14,0)`.
- RLS enabled on exposed business tables.
- `security definer` helper functions for membership checks.
- Policies for member/staff/owner-readonly boundaries.
- Append-only `audit_log` trigger.
- Append-only `ledger_entries` trigger.
- Posted financial record immutability triggers.
- Published monthly closing immutability trigger.
- Grants for the `authenticated` role, with RLS still enforcing data access.

No obvious Cloud DEV blockers were found in local review. Before remote migration, run the local checks again and confirm the Cloud DEV project is empty or disposable.

## Cloud cautions before `db push`

- `supabase db push` applies migrations to the linked remote project. It must not be run until explicitly authorized.
- `supabase/seed.sql` is used by local `supabase db reset`; do not assume it will be pushed to Cloud DEV by default.
- If demo seed data is needed in Cloud DEV later, use a separate reviewed, sanitized seed workflow.
- RLS tests currently run locally with pgTAP. Cloud validation should use either a temporary DEV-only test workflow or manual SQL checks that do not introduce real data.
- Remote Storage buckets are not fully configured yet. Keep attachments/OCR out of scope.

## Environment variable matrix

| Environment            | Variable                               | Public/secret | Source                                   | Paste location             | Frontend allowed | Keep out of Git       |
| ---------------------- | -------------------------------------- | ------------- | ---------------------------------------- | -------------------------- | ---------------- | --------------------- |
| Local demo             | `NEXT_PUBLIC_APP_MODE`                 | Public        | Manual value `demo`                      | `.env.local` if needed     | Yes              | Yes for `.env.local`  |
| Local DEV              | `NEXT_PUBLIC_APP_MODE`                 | Public        | Manual value `dev`                       | `.env.local`               | Yes              | Yes                   |
| Local DEV              | `NEXT_PUBLIC_SUPABASE_URL`             | Public        | Supabase DEV API settings                | `.env.local`               | Yes              | Yes                   |
| Local DEV              | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public        | Supabase DEV API settings                | `.env.local`               | Yes              | Yes                   |
| Vercel Preview         | `NEXT_PUBLIC_APP_MODE`                 | Public        | Manual value `dev` when DEV is connected | Vercel Preview env vars    | Yes              | N/A, stored in Vercel |
| Vercel Preview         | `NEXT_PUBLIC_SUPABASE_URL`             | Public        | Supabase DEV API settings                | Vercel Preview env vars    | Yes              | N/A, stored in Vercel |
| Vercel Preview         | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public        | Supabase DEV API settings                | Vercel Preview env vars    | Yes              | N/A, stored in Vercel |
| Vercel Production Demo | `NEXT_PUBLIC_APP_MODE`                 | Public        | Manual value `demo`                      | Vercel Production env vars | Yes              | N/A, stored in Vercel |
| Supabase DEV           | Database password                      | Secret        | Created during project setup             | Password manager only      | No               | Yes                   |
| Supabase DEV           | Service role key                       | Secret        | Supabase API settings                    | Do not use in this phase   | No               | Yes                   |
| Supabase DEV           | Direct database URL                    | Secret        | Supabase database settings               | Do not use in frontend     | No               | Yes                   |

## Variables prohibited in frontend

Never expose these through `NEXT_PUBLIC_*`, client code, screenshots, logs, commits, or chat:

- Supabase service role key.
- Supabase secret key.
- Database password.
- Direct database URL.
- `VERCEL_TOKEN`.
- GitHub token.
- Any private financial or personal data.

## Commands for the next phase only

These commands are allowed only in the future `Supabase Cloud DEV Connector` phase after explicit authorization:

```powershell
pnpm exec supabase login
pnpm exec supabase link
pnpm exec supabase db push
pnpm exec supabase test db
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Commands not to use yet

Do not run these in the planner phase:

```powershell
pnpm exec supabase login
pnpm exec supabase link
pnpm exec supabase db push
pnpm exec supabase db pull
pnpm exec supabase secrets set
pnpm exec supabase functions deploy
```

Do not add Supabase DEV variables to Vercel yet.

## Rollback plan

If a future Cloud DEV migration fails:

1. Stop immediately and record the exact failing migration and SQL error.
2. Do not retry against another project.
3. Do not point Vercel Preview to a partially migrated project.
4. If the DEV project is disposable and contains no real data, recreate it or reset it only after explicit approval.
5. Fix migration locally first.
6. Run local `supabase db reset` and `supabase test db` again before another remote attempt.

If Vercel Preview variables are misconfigured later:

1. Remove or correct only the affected Preview variables.
2. Keep Production Demo on `NEXT_PUBLIC_APP_MODE=demo`.
3. Do not add service role or database URL variables to frontend scope.

## Criteria to proceed to real Cloud DEV connection

Proceed only when all are true:

- The user has created `atria-inmobiliaria-dev` as a separate Supabase project.
- The user confirms it is not Construction Ops and is safe for DEV migrations.
- The user has the public Supabase URL and publishable key ready, but does not paste secrets into chat.
- Local checks pass:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
  - `pnpm exec supabase test db`
- The next agent receives explicit authorization to run `supabase login`, `supabase link`, and `supabase db push`.

## Next prompt: Supabase Cloud DEV Connector

Use this prompt only after the DEV project exists and the owner authorizes remote connection:

```text
Act�a como agente Supabase Cloud DEV Connector del proyecto atria-inmobiliaria-core.

El proyecto Supabase Cloud DEV separado ya fue creado con nombre atria-inmobiliaria-dev. No uses Construction Ops. No uses datos reales. Puedes pedirme autorizaci�n para supabase login, supabase link y supabase db push. Primero verifica Git limpio, rama setup/foundation, checks locales, y que el proyecto remoto correcto sea atria-inmobiliaria-dev. Luego linkea, aplica migraciones a DEV, valida schema/RLS de forma segura con datos demo sanitizados, configura �nicamente variables p�blicas en Vercel Preview si te autorizo, y no toques Production Demo ni service role keys.
```
