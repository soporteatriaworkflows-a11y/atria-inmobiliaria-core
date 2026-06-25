# 15 - Vercel Preview Debug Report

## Scope

Diagnose Preview deployments for branch `preview/supabase-dev` without touching Production.

## Current branch and project

- Branch: `preview/supabase-dev`.
- Vercel project: `atria-inmobiliaria-core`.
- Project ID: `prj_vDgYCWA37oY9cpZFLVKlkUIACnbg`.
- Scope: `soporteatriaworkflows-8854s-projects`.
- Production branch remains `main`.

## Causes found

1. `vercel build --target preview` failed with `Unable to find lambda for route` while the app was fully static. Setting `output: "export"` in `next.config.ts` makes the current MVP explicit static output and allows `vercel build --target preview` to complete.
2. Preview environment variables had been created as `Sensitive` because the initial CLI add used stdin. For `NEXT_PUBLIC_*` variables this caused `vercel pull --environment=preview --git-branch=preview/supabase-dev` to download empty values. The Preview branch variables were recreated with `--no-sensitive` because they are public browser variables by design.
3. `vercel deploy` and `vercel deploy --prebuilt` without `--no-wait` hang in this Windows/CLI session while the Vercel deployment remains `UNKNOWN` with build `0ms`. Using `vercel deploy --prebuilt --target preview --yes --no-wait` successfully uploads the prebuilt output and returns a Preview URL, but `vercel inspect` still reports `UNKNOWN`.

## Preview variables confirmed

Only for Vercel Preview branch `preview/supabase-dev`:

- `NEXT_PUBLIC_APP_MODE=dev`
- `NEXT_PUBLIC_SUPABASE_URL` present for Supabase DEV project `bzoqbjcktoyngvszcwhl`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` present; public publishable key, not service role

Production pull confirmed only this public app variable:

- `NEXT_PUBLIC_APP_MODE=demo`

Production does not contain `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Commands executed

```powershell
vercel --version
vercel project inspect atria-inmobiliaria-core
vercel ls atria-inmobiliaria-core
vercel inspect <preview-url> --logs
vercel env list preview preview/supabase-dev --format json
vercel env list production --format json
vercel pull --yes --environment=preview --git-branch=preview/supabase-dev
vercel pull --yes --environment=production
pnpm lint
pnpm typecheck
pnpm test
pnpm build
vercel build --target preview
vercel deploy --prebuilt --target preview --yes --no-wait
```

No `--prod`, `promote`, domain, service role, secret key, database URL, database password, or real data was used.

## Preview build result

Local/prebuilt verification:

- `vercel build --target preview`: PASS after static export.
- `.vercel/output/static/index.html` contains `Modo DEV seguro: Supabase DEV, datos sanitizados`.
- `.vercel/output/static/index.html` does not contain `Modo demo seguro`.

Preview URL returned by upload:

```text
https://atria-inmobiliaria-core-2usq78koa.vercel.app
```

Remote state:

- `vercel inspect` reports `target=preview` and `status=UNKNOWN` with build `0ms`.
- `vercel logs` reports no logs for the UNKNOWN deployments.
- Public HTTP access to Preview is intercepted by Vercel Deployment Protection/login. This is expected for protected previews, but visual confirmation of the banner requires opening the Preview while authenticated in Vercel or using a valid bypass flow.

## Production verification

Production URL:

```text
https://atria-inmobiliaria-core.vercel.app
```

Result:

- HTTP 200.
- Contains `Modo demo seguro: datos sanitizados`.
- Does not use Supabase DEV variables.

## Files changed by debugger

- `next.config.ts`: explicit static export for the current static MVP.
- `eslint.config.mjs`: ignore generated `out/**` and `.vercel/**` outputs.
- `src/lib/app-config.ts`: normalize quoted public env values from Vercel pull/CLI.
- `docs/14_VERCEL_PREVIEW_DEV_CONNECTION.md`: updated status.
- `docs/15_VERCEL_PREVIEW_DEBUG_REPORT.md`: this report.

## Manual dashboard checks still recommended

1. Open the Vercel project dashboard and inspect the `UNKNOWN` Preview deployments.
2. Confirm whether Deployment Protection is expected for this team/project.
3. Open the Preview URL while authenticated in Vercel and verify the DEV banner.
4. If Vercel still shows `UNKNOWN` after dashboard refresh, contact Vercel support with deployment ID `dpl_6aawbXzzehbuw8swqrEGaN3A6293`.

## Security notes

- `NEXT_PUBLIC_*` values are public browser configuration, not secrets.
- Never add service role, secret key, database password, direct database URL, Vercel token, GitHub token, or real data to Vercel frontend variables.
- Production must remain demo-only until a separate production data plan is approved.
