# 13 - Supabase Cloud DEV Connection Report

## Scope

Connect the local ATRIA Inmobiliaria project to the approved Supabase Cloud DEV project, apply the initial schema migration, and validate the migration state without using real data or frontend secrets.

## Approved DEV project

| Field | Value |
| ----- | ----- |
| Visible name | `atria-inmobiliaria` |
| Intended environment | DEV for the MVP |
| Project ref | `bzoqbjcktoyngvszcwhl` |

The owner confirmed this is not Construction Ops. Do not touch these projects:

- `construction-ops-prod` / `jabddbccmhrxztfzpdii`
- `just-padel-digital` / `riwlwactbxcgttfagwzn`

## Commands executed

```powershell
pnpm exec supabase projects list
pnpm exec supabase link --project-ref bzoqbjcktoyngvszcwhl
pnpm exec supabase migration list
pnpm exec supabase db push
pnpm exec supabase migration list
pnpm exec supabase test db --linked
docker ps
```

## Remote migration result

Migration status after `db push`:

| Local | Remote | Status |
| ----- | ------ | ------ |
| `202606240001` | `202606240001` | Applied |

The applied migration is:

```text
supabase/migrations/202606240001_initial_schema.sql
```

Cloud note: Supabase Cloud already had the `pgcrypto` extension, so the migration emitted the expected notice `extension "pgcrypto" already exists, skipping`.

## RLS validation

Local RLS validation passed 12/12 after Docker Desktop was reopened.

Remote SQL validation executed successfully with:

```powershell
pnpm exec supabase db query --linked --file .\supabase\tests\database\rls.sql --output json
```

The RLS test file uses sanitized demo users and wraps test data in a transaction with `rollback`, so it does not leave test data in Cloud DEV. The command completed with exit code 0 and reached test 12.

Known tooling issue: `pnpm exec supabase test db --linked` still fails because the CLI pgTAP harness does not resolve `plan()` on Cloud DEV, even though transacting `create extension if not exists pgtap` through `db query --linked` exposes the pgTAP functions. Use the query-based validation until this harness issue is corrected.

## Vercel Preview variables to configure later

Do not configure Vercel Production with Supabase DEV. Production must remain in demo mode for now.

Preview-only variables for the next phase:

| Variable | Value/source | Public/secret | Frontend allowed |
| -------- | ------------ | ------------- | ---------------- |
| `NEXT_PUBLIC_APP_MODE` | `dev` | Public | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API settings for `bzoqbjcktoyngvszcwhl` | Public | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase API settings for `bzoqbjcktoyngvszcwhl` | Public | Yes |

Never add these to frontend, Vercel public env, chat, commits, screenshots, or logs:

- Supabase service role key.
- Supabase secret key.
- Database password.
- Direct database URL.
- `VERCEL_TOKEN`.
- GitHub token.
- Real personal, financial, address, bank, PDF, Excel, or receipt data.

## Pending validation

For Cloud DEV RLS validation, run:

```powershell
pnpm exec supabase db query --linked --file .\supabase\tests\database\rls.sql --output json
pnpm exec supabase test db
```

Then run the normal app gate:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Rollback guidance

This DEV project should remain disposable until real QA approval. If a later Cloud DEV migration fails, do not retry against another project. Fix locally, re-run local reset/tests, then apply to the same confirmed DEV project only after explicit authorization.
