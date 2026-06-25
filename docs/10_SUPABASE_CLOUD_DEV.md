# 10 - Supabase Cloud DEV

## Goal

Create a separate Supabase Cloud DEV project for previews and QA. Do not connect to production and do not reuse any Construction Ops project.

## Project creation

1. In Supabase, create a new project.
2. Suggested name: `atria-inmobiliaria-dev`.
3. Use a separate organization/project from Construction Ops if available.
4. Do not import real financial documents or personal data.
5. Do not paste service role keys into frontend code or Vercel public variables.

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

Do not run these until explicitly authorized:

```powershell
pnpm exec supabase link
pnpm exec supabase db push
```

Recommended controlled sequence after authorization:

1. Confirm the Supabase DEV project is empty or disposable.
2. Confirm `.env.local` contains only DEV values.
3. Run local `pnpm exec supabase db reset`.
4. Run local `pnpm exec supabase test db`.
5. Link the project with `pnpm exec supabase link`.
6. Apply migrations to DEV with `pnpm exec supabase db push`.
7. Run a smoke test with sanitized data only.

## Separation rule

Local, Supabase Cloud DEV, Vercel Preview, and eventual Production must remain separate. Never reuse Construction Ops keys, projects, containers, or databases.
