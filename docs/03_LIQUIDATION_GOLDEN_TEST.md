# 03 — Liquidation golden test

## Purpose
The current accountant PDF and private Excel are reference documents. They must remain outside Git. The repository includes only a sanitized workbook fixture.

## Required calculation behavior
Create a pure, testable calculation engine. It must accept:
- month;
- collections;
- property expenses;
- global expenses;
- participation rules;
- previous balances;
- pending payable values;
- manual adjustments.

It must output per participant:
- rental collections;
- expense participation;
- total participation;
- previous balance;
- pending payable;
- accumulated balance;
- amount to pay.

## Provisional formula
```text
total_participation = rental_collections - expense_participation
accumulated_balance = total_participation + previous_balance + pending_payable + manual_adjustments
```

Do not assume the final payout rule until validated against the private reference documents. Record mismatches explicitly.

## Test assets
- `fixtures/MVP_Liquidacion_Herederos_SANITIZED_FIXTURE.xlsx`
- private local-only reference documents stored outside the repository.
