# 07 - Supabase Security Notes

## Current local posture

- Supabase local is configured for this repository only.
- Local ports are isolated from other projects:
  - API: `55321`
  - Database: `55322`
  - Shadow database: `55320`
  - Studio: `55323`
  - Inbucket: `55324`
- Analytics is disabled locally to avoid the Docker log sidecar instability on this workstation.

## Security decisions

- Keep Supabase Row Level Security as the main data boundary.
- Do not use secret keys or service role keys in the browser.
- Normal app actions should use the authenticated user session so RLS remains enforced.
- Service role keys are reserved only for narrow backend maintenance tasks and must never be exposed to frontend code.
- Separate Local, Supabase Cloud DEV, Vercel Preview, and eventual Production.
- Do not reuse the Construction Ops Supabase project, keys, database, or containers.

## RLS and immutability

The initial migration enforces:

- RLS enabled on exposed business tables.
- Organization-scoped access through memberships.
- `audit_log` append-only.
- `ledger_entries` append-only.
- Posted financial records immutable; corrections must use reversals or adjustments.
- Published monthly closings immutable; reopening requires an explicit workflow later.

## Local test coverage

`supabase/tests/database/rls.sql` validates:

- admin access within organization;
- accountant financial creation permissions;
- accountant cannot delete financial records;
- owner/heir read-only financial behavior;
- cross-organization isolation;
- immutable audit log;
- immutable published closings.
