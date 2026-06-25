# 08 - Financial Model Risks

## Confirmed rules

- Money is represented as integer COP in TypeScript and `NUMERIC(14,0)` in PostgreSQL.
- JavaScript floating-point arithmetic must not be used for money.
- Administration demo amount: COP `1,107,000`.
- Accountant demo amount: COP `922,500`.
- Combined global demo amount: COP `2,029,500`.
- Auditability is mandatory for financial changes.

## Current provisional formula

```text
total_participation = rental_collections - expense_participation
accumulated_balance = total_participation + previous_balance + pending_payable + manual_adjustments
```

`amount_to_pay` is currently a provisional positive accumulated balance. This must be validated against the private accountant reference documents outside the repository.

## Main risks

- Final participation rules may be estate-level, property-level, or mixed.
- Negative balances may mean debt, carry-forward, or manual review depending on the final business rule.
- Consignments and payouts are not fully modeled yet.
- Reopening a published closing needs a formal workflow and audit entry.
- Historical visibility for sold or inactive properties is not finalized.
- Owner/heir access to receipts versus reports only remains undecided.

## Required controls

- Posted records are corrected through adjustments or reversals, not edits or deletes.
- Published closing snapshots are immutable.
- Unknown rules must be configurable or documented as provisional.
- Tests using private documents must remain local-only and never enter Git.
