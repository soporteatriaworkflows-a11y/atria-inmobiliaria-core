# 01 — Decisions and unknowns

## Confirmed for the MVP
- Admin cost: COP 1,107,000.
- Accountant cost: COP 922,500.
- There are about 18 properties.
- Expenses can be property-specific or global.
- Owners/heirs should not edit financial records directly.
- Requests for changes and permission changes must be traceable.

## Unknown business rules — do not invent
- Whether participation percentages are global, property-specific, or both.
- Whether a property can have multiple owners with different percentages.
- How consignments map to collections, payouts and account reconciliation.
- Exact reopening workflow for delayed month-end closings.
- Whether a negative balance always means the person owes the estate.
- Whether sold properties remain visible historically and to whom.
- Whether owners should access source receipts or only liquidation reports.
- Whether accountant and administration amounts change by month.

## MVP handling
- Store effective-dated participation rules.
- Allow estate-level default percentages and property-level overrides.
- Store configurable recurring expenses.
- Keep closings in `draft`, `review`, `published`.
- Use manual review for unresolved formulas.
- Preserve a full audit trail.
