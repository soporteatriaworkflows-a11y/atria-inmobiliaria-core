# AGENTS.md — ATRIA Inmobiliaria Core

## Mission
Build a secure, modular real-estate inheritance administration system for ATRIA. The first goal is a reliable MVP for monthly liquidation of inherited rental properties. The architecture must remain reusable for a future multi-client property-management SaaS.

## Non-negotiable safety rules
- Never commit secrets, real financial documents, personal data, addresses, bank data, or private Excel/PDF files.
- Never print secrets in logs, prompts, commits, or reports.
- Never work directly on `main`.
- Never force-push, delete branches, rewrite history, or merge into `main`.
- Never deploy to production.
- Never mutate a production database.
- Prefer local Supabase for schema and RLS work. A remote DEV project may be used only after explicit setup.
- Use sanitized fixtures only.
- Any OCR output must enter `pending_review`; never auto-post financial records.
- Financial records are append-only after posting. Corrections use reversal/adjustment entries and audit logs.
- Closing snapshots are immutable once published. Reopening requires an explicit workflow and audit entry.
- Use decimal-safe types: PostgreSQL `NUMERIC`, TypeScript decimal library or integer COP amounts. Never use JS floating-point arithmetic for money.

## Branch and worktree policy
- Base branch: `main`.
- Foundation branch: `setup/foundation`.
- Feature branches: `feature/<module>-<short-description>`.
- Security fixes: `fix/security-<short-description>`.
- Each coding agent works in its own branch/worktree.
- One agent owns one module at a time.
- The orchestrator integrates only after QA and security verification pass.

## Autonomous workflow
Agents may autonomously:
- inspect files;
- create branches/worktrees;
- edit code and documentation;
- run local commands;
- install project dependencies;
- run lint, typecheck, tests, local database resets, and local RLS tests;
- create commits on feature branches;
- produce integration reports.

Agents must stop and report before:
- using or requesting a real secret;
- touching production;
- changing account permissions;
- making a destructive database change outside local DEV;
- merging to `main`;
- publishing a production deployment.

## Required stack baseline
- Next.js App Router + TypeScript
- Supabase Postgres, Auth, Storage
- Local Supabase CLI + Docker
- PostgreSQL migrations in version control
- RLS on every exposed business table
- Private Storage buckets and signed URLs
- Tests for calculations and RLS
- Vercel Preview deployments after the local foundation passes

## Domain model guardrails
Do not model every authenticated user as an heir. Keep separate concepts:
- organizations / estates;
- profiles;
- memberships and roles;
- properties;
- ownership or participation rules with effective dates;
- property-level access grants;
- collections;
- expenses;
- ledger entries / adjustments;
- monthly closings;
- heir liquidations;
- attachments;
- change requests;
- audit log.

Every business table must include `organization_id` or inherit it through a verified relation. The future product must support more than one client safely.

## MVP uncertainty policy
Unknown business rules must not be invented. Implement them as:
- configurable parameters;
- manual review fields;
- explicit assumptions documented in `docs/01_DECISIONS_AND_UNKNOWNS.md`;
- tests labeled as provisional.

## Verification gate for every agent
Before reporting completion:
1. Run formatter if configured.
2. Run lint.
3. Run typecheck.
4. Run unit tests.
5. Run local database reset and migrations when schema changes.
6. Run RLS tests when permissions change.
7. Run build.
8. Summarize changed files, tests, assumptions, and remaining risks.

## Source-of-truth documents
Read before coding:
- `docs/00_PRODUCT_SCOPE.md`
- `docs/01_DECISIONS_AND_UNKNOWNS.md`
- `docs/02_SECURITY_BASELINE.md`
- `docs/03_LIQUIDATION_GOLDEN_TEST.md`
- `docs/04_AGENT_ORCHESTRATION.md`
