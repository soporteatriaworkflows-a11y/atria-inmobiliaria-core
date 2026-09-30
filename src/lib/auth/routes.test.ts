import { describe, expect, it } from "vitest";
import {
  canAccessRoute,
  getDefaultRouteForRole,
  isProtectedRoute,
} from "./routes";
import { navigationGroups } from "@/lib/navigation";
import type { AppRole } from "./rbac";

// Expected access is explicit: adding an administrative route must not expand
// accountant or owner access as a side effect.
const routeMatrix: Array<[string, boolean, boolean, boolean, boolean]> = [
  ["/dashboard/admin", true, true, false, false],
  ["/dashboard/contador", true, true, true, false],
  ["/dashboard/propietario", true, true, true, true],
  ["/propiedades", true, true, true, false],
  ["/herederos", true, true, true, false],
  ["/recaudos", true, true, true, false],
  ["/gastos", true, true, true, false],
  ["/solicitudes", true, true, true, true],
  ["/liquidacion", true, true, true, false],
  ["/auditoria", true, true, true, false],
];

const matrixRoles: AppRole[] = [
  "platform_admin",
  "estate_admin",
  "accountant",
  "owner_readonly",
];

describe("protected route policy", () => {
  it.each(routeMatrix)(
    "keeps the complete role matrix for %s",
    (route, ...allowedRoles) => {
      for (const [index, role] of matrixRoles.entries()) {
        expect(canAccessRoute(role, route), `${role}: ${route}`).toBe(
          allowedRoles[index],
        );
      }
      expect(canAccessRoute(null, route)).toBe(false);
    },
  );

  it.each(matrixRoles)(
    "uses route access as the only permission filter for the %s sidebar",
    (role) => {
      const visibleRoutes = navigationGroups.flatMap((group) =>
        group.items
          .filter((item) => canAccessRoute(role, item.href))
          .map((item) => item.href),
      );
      const roleIndex = matrixRoles.indexOf(role);
      for (const [route, ...allowedRoles] of routeMatrix) {
        expect(visibleRoutes.includes(route), `${role}: ${route}`).toBe(
          allowedRoles[roleIndex],
        );
      }
      expect(canAccessRoute(role, getDefaultRouteForRole(role))).toBe(true);
    },
  );

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
