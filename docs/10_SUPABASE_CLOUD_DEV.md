# 10 - Supabase Cloud DEV

## Goal

Create a separate Supabase Cloud DEV project for previews and QA. Do not connect to production and do not reuse any Construction Ops project.

## Project creation

1. In Supabase, create a new project.
2. Suggested name: `atria-inmobiliaria-dev`.
3. Use a separate organization/project from Construction Ops if available.
4. Do not import real financial documents or personal data.
5. Do not paste service role keys into frontend code or Vercel public variables.

## Current DEV project

The Cloud DEV project for this MVP was created manually with this visible name:

```text
atria-inmobiliaria
```

Project ref:

```text
bzoqbjcktoyngvszcwhl
```

Even though the visible name is not `atria-inmobiliaria-dev`, this project is treated as DEV-only for the MVP. It is not the Construction Ops project and must not be mixed with:

- `construction-ops-prod` / `jabddbccmhrxztfzpdii`
- `just-padel-digital` / `riwlwactbxcgttfagwzn`

## Variables to obtain

| Variable                               | Where to get it               | Where to paste it               | Public/secret |
| -------------------------------------- | ----------------------------- | ------------------------------- | ------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project API settings | `.env.local` and Vercel Preview | Public        |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase project API settings | `.env.local` and Vercel Preview | Public        |

No service role key is required for normal app usage at this stage.

## Secret values

These must not be committed and must not be exposed to frontend code:

- Supabase service role key.
- Supabase secret key.
- Direct database connection string.
- Database password.

If a backend-only operation later needs one of these, document the exact variable name, scope, and reason before use.

## Controlled migration plan

These commands were authorized for Cloud DEV only on 2026-06-25:

```powershell
pnpm exec supabase link --project-ref bzoqbjcktoyngvszcwhl
pnpm exec supabase db push
```

Controlled sequence:

1. Confirm the DEV project ref with the owner.
2. Confirm it is not Construction Ops.
3. Run local checks before remote work.
4. Link the project with `pnpm exec supabase link --project-ref bzoqbjcktoyngvszcwhl`.
5. Confirm migration status with `pnpm exec supabase migration list`.
6. Apply migrations to DEV with `pnpm exec supabase db push`.
7. Confirm migration status again.
8. Run RLS validation against DEV when Docker Desktop is available for pgTAP.

Current migration status:

- `202606240001_initial_schema.sql` applied to Cloud DEV.
- `pnpm exec supabase migration list` shows local and remote versions aligned.
- `pnpm exec supabase db query --linked --file .\supabase\tests\database\rls.sql --output json` executed the RLS SQL against Cloud DEV inside a transaction and completed successfully.
- `pnpm exec supabase test db --linked` still fails in the CLI pgTAP harness because `plan()` is not resolved there; keep using the documented query-based validation until the harness is corrected.

## Separation rule

Local, Supabase Cloud DEV, Vercel Preview, and eventual Production must remain separate. Never reuse Construction Ops keys, projects, containers, or databases.
