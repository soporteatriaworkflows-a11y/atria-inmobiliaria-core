import { describe, expect, it } from "vitest";
import {
  canAccessRoute,
  getDefaultRouteForRole,
  isProtectedRoute,
} from "./routes";

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

  it("routes each role to the right landing page", () => {
    expect(getDefaultRouteForRole("platform_admin")).toBe("/dashboard/admin");
    expect(getDefaultRouteForRole("estate_admin")).toBe("/dashboard/admin");
    expect(getDefaultRouteForRole("accountant")).toBe("/dashboard/contador");
    expect(getDefaultRouteForRole("owner_readonly")).toBe(
      "/dashboard/propietario",
    );
  });

  it("limits owner users to owner dashboard and adjustment requests", () => {
    expect(canAccessRoute("owner_readonly", "/dashboard/propietario")).toBe(
      true,
    );
    expect(canAccessRoute("owner_readonly", "/solicitudes")).toBe(true);
    expect(canAccessRoute("owner_readonly", "/propiedades")).toBe(false);
    expect(canAccessRoute("owner_readonly", "/recaudos")).toBe(false);
    expect(canAccessRoute("owner_readonly", "/gastos")).toBe(false);
    expect(canAccessRoute("owner_readonly", "/liquidacion")).toBe(false);
    expect(canAccessRoute("owner_readonly", "/dashboard/admin")).toBe(false);
    expect(canAccessRoute("owner_readonly", "/dashboard/contador")).toBe(false);
    expect(canAccessRoute("owner_readonly", "/auditoria")).toBe(false);
  });

  it("lets administrative staff access operational routes", () => {
    expect(canAccessRoute("estate_admin", "/dashboard/admin")).toBe(true);
    expect(canAccessRoute("estate_admin", "/liquidacion")).toBe(true);
    expect(canAccessRoute("accountant", "/dashboard/contador")).toBe(true);
    expect(canAccessRoute("accountant", "/propiedades")).toBe(true);
    expect(canAccessRoute("accountant", "/dashboard/admin")).toBe(false);
  });
});
