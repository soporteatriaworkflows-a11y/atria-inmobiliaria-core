# 11 - Visual QA Vercel

## Scope

Public production demo reviewed on June 25, 2026.

- Primary URL: `https://atria-inmobiliaria-core.vercel.app`
- Direct deployment URL: `https://atria-inmobiliaria-core-itpt4aj1c.vercel.app`
- App mode expected: `NEXT_PUBLIC_APP_MODE=demo`
- Data policy: sanitized demo data only

## Routes reviewed

| Route                    | Desktop | Tablet | Mobile | Result                                                     |
| ------------------------ | ------- | ------ | ------ | ---------------------------------------------------------- |
| `/`                      | PASS    | PASS   | PASS   | Loads with demo banner and summary cards                   |
| `/login`                 | PASS    | PASS   | PASS   | Demo login form visible; no real auth required             |
| `/dashboard/admin`       | PASS    | PASS   | PASS   | Admin actions are distinct from accountant and owner views |
| `/dashboard/contador`    | PASS    | PASS   | PASS   | Accountant review actions visible                          |
| `/dashboard/propietario` | PASS    | PASS   | PASS   | Owner view communicates read-only behavior                 |
| `/propiedades`           | PASS    | PASS   | PASS   | Demo properties visible, no real addresses                 |
| `/herederos`             | PASS    | PASS   | PASS   | Demo participants visible, no real identities              |
| `/recaudos`              | PASS    | PASS   | PASS   | Demo collections visible                                   |
| `/gastos`                | PASS    | PASS   | PASS   | Demo expenses visible                                      |
| `/liquidacion`           | PASS    | PASS   | PASS   | Demo liquidation visible with assumptions                  |
| `/solicitudes`           | PASS    | PASS   | PASS   | Demo change requests visible                               |
| `/auditoria`             | PASS    | PASS   | PASS   | Demo audit entries visible                                 |

## Automated checks

Playwright checked 36 page loads: 12 routes across desktop, tablet, and mobile viewports.

Viewports:

- Desktop: `1440x1000`
- Tablet: `834x1112`
- Mobile: `390x844`

Checks performed:

- HTTP status is successful.
- No console errors or warnings were captured.
- No failed network requests were captured.
- `Modo demo seguro: datos sanitizados` is visible on every route and viewport.
- Navigation has 12 links on every route.
- No horizontal overflow was detected.
- Navigation click targets are at least 44px tall.
- No page was visually empty by text-length check.
- Owner dashboard includes read-only language.

## Screenshots

Screenshots were generated locally and intentionally not committed to Git.

Directory:

```text
artifacts/visual-qa/vercel-demo-2026-06-25/
```

Representative files:

- `desktop-home.png`
- `desktop-liquidacion.png`
- `tablet-home.png`
- `tablet-liquidacion.png`
- `mobile-home.png`
- `mobile-liquidacion.png`

Machine-readable results:

- `artifacts/visual-qa/vercel-demo-2026-06-25/results.json`
- `artifacts/visual-qa/vercel-demo-2026-06-25/layout-checks.json`

## Corrections performed

No visual corrections were required. The app loaded cleanly across all reviewed routes and responsive sizes.

QA tooling added:

- `scripts/visual-qa.mjs`
- `scripts/visual-layout-check.mjs`
- `@playwright/test` as a dev dependency

## UX findings

- Buttons and navigation links are large enough for older users.
- Language is simple and task-oriented.
- Navigation is visible on every page.
- Owner dashboard is read-only in appearance and copy.
- Admin and accountant dashboards have differentiated action lists.
- Demo banner is visible on all pages, reducing risk of mistaking the deployment for real production.

## Pending risks

- Visual QA used automated screenshots and DOM metrics; manual design review can still refine typography, spacing, and information hierarchy.
- Auth remains demo-only.
- Supabase Cloud DEV is not connected.
- No custom domain is configured.
- OCR and n8n remain out of scope.

## Checklist before Supabase Cloud DEV

- Keep `NEXT_PUBLIC_APP_MODE=demo` for production demo until DEV integration is explicitly authorized.
- Create a separate Supabase Cloud DEV project only.
- Add only publishable Supabase variables to Vercel Preview first.
- Do not add service role, secret key, database URL, or real financial data.
- Re-run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm exec supabase test db` before any DEV database push.
