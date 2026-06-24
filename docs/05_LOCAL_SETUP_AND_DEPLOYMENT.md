# 05 - Local setup and preview deployment

## Local commands

```powershell
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Environment variables

Commit only `.env.example`. Real values belong in `.env.local` for local use and in Vercel project environment variables for Preview.

| Variable                               | Scope               | Where to get it                   | Where to paste it               |
| -------------------------------------- | ------------------- | --------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Public browser-safe | Supabase DEV project API settings | `.env.local` and Vercel Preview |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public browser-safe | Supabase DEV project API settings | `.env.local` and Vercel Preview |

No service role key is required for this foundation.

## Supabase DEV project

1. Create a new Supabase project dedicated to `atria-inmobiliaria-core`.
2. Do not reuse keys or databases from other projects.
3. Use local Supabase first: `supabase start`, then `supabase db reset`.
4. Push migrations to remote DEV only after local schema, RLS tests and seed are reviewed.
5. Keep production separate and uncreated until security review.

## Vercel Preview project

1. Create a new Vercel project for this repository.
2. Import the private GitHub repository.
3. Configure framework preset as Next.js.
4. Set Preview environment variables using only the Supabase DEV public URL and publishable key.
5. Do not configure a production domain yet.

## Demo data

The repo may use only `fixtures/MVP_Liquidacion_Herederos_SANITIZED_FIXTURE.xlsx` and generated demo rows. Private accountant PDFs, private spreadsheets, names, addresses, IDs, bank data and receipts stay outside Git.
