# 09 - Vercel Deployment

## Goal

Create a technical/demo deployment that is visually reviewable and uses sanitized demo data only.

## Importing the repository

1. In Vercel, create a new project.
2. Import the private GitHub repository `atria-inmobiliaria-core`.
3. Use framework preset: Next.js.
4. Keep root directory as the repository root.
5. Set the Production Branch to `main`.
6. Keep Preview deployments enabled for `setup/foundation` and future feature branches.

## Demo environment variables

For the first technical demo, only this variable is required:

| Variable               | Value  | Scope                  | Public/secret |
| ---------------------- | ------ | ---------------------- | ------------- |
| `NEXT_PUBLIC_APP_MODE` | `demo` | Preview and Production | Public        |

In demo mode, the app uses committed sanitized demo fixtures and does not require Supabase Cloud variables.

## Supabase Cloud DEV variables

When the separate Supabase DEV project exists, add these to Vercel Preview first:

| Variable                               | Source                    | Scope   | Public/secret |
| -------------------------------------- | ------------------------- | ------- | ------------- |
| `NEXT_PUBLIC_APP_MODE`                 | Manual value `dev`        | Preview | Public        |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase DEV API settings | Preview | Public        |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase DEV API settings | Preview | Public        |

Do not add service role keys to frontend variables. Do not prefix backend secrets with `NEXT_PUBLIC_`.

## Variables that must not be used in frontend

- Supabase service role key.
- Supabase secret key.
- Database password or direct database URL.
- Vercel tokens.
- GitHub tokens.
- Any private financial, identity, bank, PDF, or Excel data.

## Preview vs Production

- Preview: branch deployments from `setup/foundation` and future feature branches.
- Production Demo: branch `main`, still sanitized and demo-only.
- Real production with financial data is out of scope until a separate security and data review is complete.

## CLI guidance

Prefer Git integration for initial deployment. If CLI is needed, use:

```powershell
pnpm dlx vercel
```

If Vercel asks for login, token, team selection, or project authorization, stop and complete that step manually in Vercel. Do not paste tokens into chat or commit `.vercel`.

## Actual production demo deployment

Executed from `D:\ATRIA\ATRIA INMOBILIARIA` on branch `setup/foundation`.

- GitHub default branch changed to `main` with GitHub CLI.
- Vercel CLI used through `pnpm dlx vercel`; no global install required.
- Vercel scope: `soporteatriaworkflows-8854s-projects`.
- Vercel project created: `atria-inmobiliaria-core`.
- GitHub repository connected by Vercel CLI.
- Production deployment URL: `https://atria-inmobiliaria-core.vercel.app`.
- Deployment inspect URL: available in Vercel project dashboard.
- Production environment variable configured: `NEXT_PUBLIC_APP_MODE=demo`.
- Preview environment variable configured: `NEXT_PUBLIC_APP_MODE=demo`.
- No Supabase Cloud variables were configured.
- No service role, secret key, database URL, Vercel token, or GitHub token was added to Vercel project variables.

## Verification performed

- Local `pnpm lint`: passed.
- Local `pnpm typecheck`: passed.
- Local `pnpm test`: passed.
- Local `pnpm build`: passed.
- Vercel production deployment status: Ready.
- HTTP check for production URL: `200`.
- Production page contains: `Modo demo seguro: datos sanitizados`.
- `vercel logs` returned no runtime logs for the static demo pages.

## Local files created by Vercel CLI

Vercel CLI created local `.vercel/` metadata and `.env.local`. These are local-only and must not be committed.

## Remaining deployment risks

- The current production demo is sanitized and static/demo-oriented; it is not real financial production.
- Supabase Cloud DEV is not connected yet.
- No custom domain is configured.
- Next.js build emits a warning that its ESLint plugin is not auto-detected because the project uses an explicit flat ESLint config for Windows reliability.
