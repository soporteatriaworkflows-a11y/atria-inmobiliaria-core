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
