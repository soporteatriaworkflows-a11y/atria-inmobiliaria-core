import { type AppRole, canRole } from "@/lib/auth/rbac";

const routePermissions: Array<{
  prefix: string;
  permission: Parameters<typeof canRole>[1];
}> = [
  { prefix: "/propiedades", permission: "properties:read" },
  { prefix: "/herederos", permission: "owners:read" },
  { prefix: "/recaudos", permission: "income:read" },
  { prefix: "/gastos", permission: "expenses:read" },
  { prefix: "/liquidacion", permission: "closings:read" },
  { prefix: "/solicitudes", permission: "requests:read" },
  { prefix: "/auditoria", permission: "audit:read" },
  { prefix: "/dashboard/contador", permission: "income:write" },
  { prefix: "/dashboard/propietario", permission: "closings:read" },
  { prefix: "/dashboard/admin", permission: "properties:write" },
];

export function isProtectedRoute(pathname: string) {
  return pathname !== "/login";
}

export function getDefaultRouteForRole(role: AppRole | null | undefined) {
  if (role === "owner_readonly") return "/dashboard/propietario";
  if (role === "accountant") return "/dashboard/contador";
  if (role === "platform_admin" || role === "estate_admin") {
    return "/dashboard/admin";
  }
  return "/login";
}

export function canAccessRoute(
  role: AppRole | null | undefined,
  pathname: string,
) {
  if (pathname === "/login") return true;
  if (!role) return false;
  if (pathname === "/") return true;

  if (role === "owner_readonly") {
    return (
      pathname.startsWith("/dashboard/propietario") ||
      pathname.startsWith("/solicitudes")
    );
  }

  const match = routePermissions.find((item) =>
    pathname.startsWith(item.prefix),
  );
  return match ? canRole(role, match.permission) : true;
}
