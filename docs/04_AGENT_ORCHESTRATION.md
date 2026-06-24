# 04 — Agent orchestration

## Boss agent
The orchestrator owns planning, dependency ordering, integration, and final reports. It must not edit the same module concurrently with a specialist.

## Specialist agents
1. Architecture agent
   - domain model, module boundaries, ADRs.
2. Database and RLS agent
   - schema, migrations, indexes, grants, RLS policies, pgTAP tests.
3. Finance engine agent
   - decimal-safe calculations, golden tests, snapshots, adjustments.
4. Frontend UX agent
   - accessible flows for administrator, accountant and older read-only users.
5. Files and OCR agent
   - Storage, signed URLs, OCR staging. Phase 2 only.
6. QA agent
   - unit, integration, build and RLS verification.
7. DevOps agent
   - GitHub rules, preview deployment, env docs. No production deployment.
8. Documentation agent
   - keep docs and changelog synchronized.

## Collision prevention
- One worktree per agent.
- One ownership map maintained by the orchestrator.
- No overlapping file edits without orchestrator reassignment.
- Integrate in dependency order.
- QA and security review every integration candidate.
