import { describe, expect, it } from "vitest";
import { can } from "./rbac";

describe("role permissions", () => {
  it("does not allow owners or heirs to edit financial records", () => {
    expect(can("owner_readonly", "finance:write")).toBe(false);
    expect(can("owner_readonly", "requests:create")).toBe(true);
  });

  it("allows accountable staff to work on financial drafts", () => {
    expect(can("estate_admin", "finance:write")).toBe(true);
    expect(can("accountant", "finance:write")).toBe(true);
  });
});
