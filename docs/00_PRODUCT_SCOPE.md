# 00 — Product scope

## Confirmed operating context
- Approximately 18 inherited rental properties.
- The current flow is manual.
- Monthly inputs include collections, property-specific expenses, global expenses, consignments, balances and liquidation outputs.
- Confirmed recurring global expenses:
  - Administration: COP 1,107,000
  - Accountant: COP 922,500
  - Combined initial configurable amount: COP 2,029,500
- Property-specific expenses may include repairs, utilities and property tax.
- Global expenses include administration and accountant costs.
- At month-end, remaining amounts are liquidated among heirs.
- The accountant currently sends a PDF summary. The future system should generate structured tables and reports.

## Initial roles
- Platform super admin / support.
- Main administrator.
- Accountant.
- Read-only owner or heir.
- Optional operator in a later phase.

## Initial modules
1. Auth and profiles.
2. Organizations / estates.
3. Properties.
4. Participation rules.
5. Access grants by property.
6. Collections.
7. Expenses.
8. Ledger and adjustments.
9. Monthly closings.
10. Liquidation reports.
11. Change requests.
12. Attachments.
13. Audit log.
14. OCR staging queue in a later phase.
15. n8n alerts and report delivery in a later phase.

## UX requirement
The interface must be friendly for older users: few actions per screen, large readable controls, plain language, no dense admin tables in the owner view.
