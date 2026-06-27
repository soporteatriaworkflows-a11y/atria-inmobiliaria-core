import { describe, expect, it } from "vitest";
import { canRole, productRoleByDbRole, roleLabels } from "./rbac";

describe("product RBAC mapping", () => {
  it("maps database roles to visible product roles", () => {
    expect(productRoleByDbRole.platform_admin).toBe("super_admin");
    expect(productRoleByDbRole.estate_admin).toBe("admin");
    expect(productRoleByDbRole.accountant).toBe("accountant");
    expect(productRoleByDbRole.owner_readonly).toBe("owner");
    expect(roleLabels.accountant).toBe("Gestion contable");
  });

  it("keeps owner access read-oriented with adjustment requests only", () => {
    expect(canRole("owner_readonly", "properties:read")).toBe(true);
    expect(canRole("owner_readonly", "requests:create")).toBe(true);
    expect(canRole("owner_readonly", "income:write")).toBe(false);
    expect(canRole("owner_readonly", "expenses:write")).toBe(false);
  });

  it("allows accountants to work on financial drafts without property administration", () => {
    expect(canRole("accountant", "income:write")).toBe(true);
    expect(canRole("accountant", "expenses:write")).toBe(true);
    expect(canRole("accountant", "closings:prepare")).toBe(true);
    expect(canRole("accountant", "properties:write")).toBe(false);
  });
});
