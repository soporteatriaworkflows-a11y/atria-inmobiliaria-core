# 14 - Vercel Preview DEV Connection

## Scope

Configure Vercel Preview for the `preview/supabase-dev` branch to use Supabase Cloud DEV public configuration, while leaving Production on demo mode.

## Branch

- Working branch: `preview/supabase-dev`.
- Base branch: `setup/foundation`.
- Production branch remains `main`.
- No force push, branch deletion, service role key, database password, database URL, or real data was used.

## Vercel project

- Project: `atria-inmobiliaria-core`.
- Project ID: `prj_vDgYCWA37oY9cpZFLVKlkUIACnbg`.
- Scope: `soporteatriaworkflows-8854s-projects`.

## Preview variables configured

The following variables were added only to Vercel Preview for Git branch `preview/supabase-dev`:

| Variable | Environment | Git branch | Value policy |
| -------- | ----------- | ---------- | ------------ |
| `NEXT_PUBLIC_APP_MODE` | Preview | `preview/supabase-dev` | Public value `dev` |
| `NEXT_PUBLIC_SUPABASE_URL` | Preview | `preview/supabase-dev` | Public Supabase DEV URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Preview | `preview/supabase-dev` | Public publishable key; not service role |

Production was not configured with Supabase DEV variables in this phase.

## Production verification

Production URL checked:

```text
https://atria-inmobiliaria-core.vercel.app
```

Result:

- HTTP 200.
- Response contains ATRIA app markup and the demo navigation.
- Production remains the technical/demo deployment and should keep `NEXT_PUBLIC_APP_MODE=demo`.

## App changes

- Added explicit `demo`/`dev` app-mode handling.
- Added a public Supabase browser client factory using only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Added a visible DEV banner: `Modo DEV seguro: Supabase DEV, datos sanitizados`.
- Added a clear missing-variable warning for DEV mode.
- Demo mode remains static and sanitized; it does not require Supabase variables.

## Preview deployment attempt

Commands attempted without `--prod`:

```powershell
pnpm dlx vercel --yes
pnpm dlx vercel deploy --target preview --force --archive=tgz --yes
pnpm dlx vercel deploy . --target preview --force --archive=tgz --yes --logs
```

Observed result:

- The CLI attempts timed out in this session.
- Vercel listed Preview deployments such as `https://atria-inmobiliaria-core-1v9bxia5x.vercel.app`, but their status remained `UNKNOWN` and inspect showed a build entry of `0ms`.
- Public GET to the Preview returned a Vercel deployment protection/login page, not the app.
- `vercel curl` could access a protected deployment, but the inspected deployment was not confirmed as the current app build.

This is treated as an operational Vercel CLI/deployment issue, not an application build issue: local lint, typecheck, tests and build pass.

## Verification commands

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

All passed locally before attempting Preview deployment.

## Do not add to Vercel Preview or Production

- Supabase service role key.
- Supabase secret key.
- Database password.
- Direct database URL.
- `VERCEL_TOKEN`.
- GitHub token.
- Real PDFs, Excel files, names, addresses, IDs, bank data, receipts, or financial documents.

## Next steps

1. Inspect the Vercel project dashboard for the `UNKNOWN` Preview deployments.
2. Confirm Git integration for the repository and branch `preview/supabase-dev`.
3. Trigger a new Preview deployment from the Vercel dashboard or GitHub branch after confirming the variables are scoped to Preview/branch only.
4. Verify the Preview renders `Modo DEV seguro: Supabase DEV, datos sanitizados`.
5. Keep Production on `NEXT_PUBLIC_APP_MODE=demo` until a separate production data plan is approved.

## Debug update - 2026-06-25

- Preview branch variables were recreated with `--no-sensitive` because they are public `NEXT_PUBLIC_*` values.
- `next.config.ts` now uses `output: "export"` for this static MVP Preview path, fixing `vercel build --target preview` errors about missing lambdas for static routes.
- `vercel deploy --prebuilt --target preview --yes --no-wait` returned `https://atria-inmobiliaria-core-2usq78koa.vercel.app`.
- The prebuilt output contains `Modo DEV seguro: Supabase DEV, datos sanitizados`.
- Vercel still reports the remote Preview deployment as `UNKNOWN` with build `0ms`; dashboard inspection is recommended.
- Production remains `https://atria-inmobiliaria-core.vercel.app` with `Modo demo seguro: datos sanitizados`.
