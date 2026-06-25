import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/202606240001_initial_schema.sql"),
  "utf8",
);

describe("database security schema", () => {
  it("enables RLS on exposed business tables", () => {
    for (const table of [
      "organizations",
      "profiles",
      "memberships",
      "properties",
      "participation_rules",
      "property_access",
      "rent_collections",
      "expenses",
      "recurring_expenses",
      "ledger_entries",
      "monthly_closings",
      "heir_liquidations",
      "change_requests",
      "attachments",
      "audit_log",
    ]) {
      expect(migration).toContain(
        `alter table public.${table} enable row level security;`,
      );
    }
  });

  it("keeps audit and posted financial records immutable", () => {
    expect(migration).toContain("block_audit_log_update_delete");
    expect(migration).toContain("block_posted_financial_update_delete");
    expect(migration).toContain("block_ledger_update_delete");
    expect(migration).toContain("block_published_closing_update_delete");
    expect(migration).toContain("owner_readonly");
    expect(migration.toLowerCase()).not.toMatch(
      /owner_readonly[^;]+insert[^;]+rent_collections/,
    );
  });
});
