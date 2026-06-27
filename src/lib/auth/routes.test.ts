import { describe, expect, it } from "vitest";
import { canAccessRoute, isProtectedRoute } from "./routes";

describe("protected route policy", () => {
  it("leaves login public and protects product routes", () => {
    expect(isProtectedRoute("/login")).toBe(false);
    expect(isProtectedRoute("/dashboard/admin")).toBe(true);
    expect(isProtectedRoute("/propiedades")).toBe(true);
  });

  it("blocks anonymous access to protected product routes", () => {
    expect(canAccessRoute(null, "/propiedades")).toBe(false);
    expect(canAccessRoute(null, "/dashboard/propietario")).toBe(false);
    expect(canAccessRoute(null, "/login")).toBe(true);
  });

  it("limits owner users to read and request workflows", () => {
    expect(canAccessRoute("owner_readonly", "/dashboard/propietario")).toBe(
      true,
    );
    expect(canAccessRoute("owner_readonly", "/propiedades")).toBe(true);
    expect(canAccessRoute("owner_readonly", "/solicitudes")).toBe(true);
    expect(canAccessRoute("owner_readonly", "/dashboard/admin")).toBe(false);
    expect(canAccessRoute("owner_readonly", "/auditoria")).toBe(false);
  });

  it("lets administrative staff access operational routes", () => {
    expect(canAccessRoute("estate_admin", "/dashboard/admin")).toBe(true);
    expect(canAccessRoute("estate_admin", "/liquidacion")).toBe(true);
    expect(canAccessRoute("accountant", "/dashboard/contador")).toBe(true);
    expect(canAccessRoute("accountant", "/propiedades")).toBe(true);
  });
});
