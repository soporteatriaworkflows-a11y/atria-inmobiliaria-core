# 02 — Security baseline

## Environment separation
- Local: Supabase CLI + Docker, sanitized seed data only.
- DEV cloud: separate Supabase project for previews and QA.
- PROD cloud: separate Supabase project created later, after security review.

## Keys
- Frontend uses Supabase publishable key only.
- Secret key is backend-only and avoided unless a narrow privileged operation requires it.
- Normal user actions should use the authenticated user session so RLS remains enforced.
- Never hardcode or commit keys.
- Store local values in `.env.local`; commit only `.env.example`.

## Database
- RLS enabled for every exposed table.
- Least-privilege grants.
- Tests for each role and organization boundary.
- Audit log append-only.
- Financial posting append-only; corrections use adjustments/reversals.
- Published monthly closings immutable.

## Files
- Private Storage buckets.
- Signed URLs with short expiration.
- OCR uploads enter staging.
- Human validation required before posting OCR-derived financial records.

## Git and deployments
- Private repository.
- Protected `main`.
- No direct push to `main`.
- Vercel previews from feature branches.
- Production deploy only after QA/security gate.
