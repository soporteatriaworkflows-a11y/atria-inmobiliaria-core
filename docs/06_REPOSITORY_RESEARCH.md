# 06 - Repository Research

## Decision

ATRIA Inmobiliaria Core uses a clean proprietary scaffold instead of cloning an existing real-estate or property-management repository.

## Repositories reviewed conceptually

- `microrealestate`
- `condo`
- `movinin`
- `prop-pulse`
- `nextjs/saas-starter`

## Outcome

- Do not clone `microrealestate`, `condo`, `movinin`, or `prop-pulse`.
- Use `nextjs/saas-starter` only as a conceptual reference for SaaS structure, not as source code.
- Keep the domain model purpose-built for inherited rental property administration, monthly liquidation, auditability, and future multi-client expansion.
- Keep Supabase RLS at the center of security instead of relying on frontend-only guards.

## Rationale

The MVP needs strict separation between organizations, profiles, memberships, properties, participants, financial records, requests, attachments, and audit logs. Existing projects do not match the inheritance-liquidation workflow closely enough and would add migration, licensing, and security-review overhead.

## Guardrail

External repositories may inform product thinking, but no code should be copied unless licensing, security, and architecture have been explicitly reviewed.
