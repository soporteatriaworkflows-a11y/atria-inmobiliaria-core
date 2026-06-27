import { can as legacyCan, type AppRole as DbRole } from "@/lib/security/rbac";

export type AppRole = DbRole;

export type ProductRole = "super_admin" | "admin" | "accountant" | "owner";

export const roleLabels: Record<AppRole, string> = {
  platform_admin: "Soporte ATRIA",
  estate_admin: "Administracion",
  accountant: "Gestion contable",
  owner_readonly: "Propietario",
};

export const productRoleByDbRole: Record<AppRole, ProductRole> = {
  platform_admin: "super_admin",
  estate_admin: "admin",
  accountant: "accountant",
  owner_readonly: "owner",
};

export type Permission =
  | "properties:read"
  | "properties:write"
  | "owners:read"
  | "owners:write"
  | "income:read"
  | "income:write"
  | "expenses:read"
  | "expenses:write"
  | "closings:read"
  | "closings:prepare"
  | "requests:read"
  | "requests:create"
  | "requests:review"
  | "audit:read";

const rolePermissions: Record<AppRole, Permission[]> = {
  platform_admin: [
    "properties:read",
    "properties:write",
    "owners:read",
    "owners:write",
    "income:read",
    "income:write",
    "expenses:read",
    "expenses:write",
    "closings:read",
    "closings:prepare",
    "requests:read",
    "requests:create",
    "requests:review",
    "audit:read",
  ],
  estate_admin: [
    "properties:read",
    "properties:write",
    "owners:read",
    "owners:write",
    "income:read",
    "income:write",
    "expenses:read",
    "expenses:write",
    "closings:read",
    "closings:prepare",
    "requests:read",
    "requests:create",
    "requests:review",
    "audit:read",
  ],
  accountant: [
    "properties:read",
    "owners:read",
    "income:read",
    "income:write",
    "expenses:read",
    "expenses:write",
    "closings:read",
    "closings:prepare",
    "requests:read",
    "audit:read",
  ],
  owner_readonly: [
    "properties:read",
    "owners:read",
    "income:read",
    "expenses:read",
    "closings:read",
    "requests:read",
    "requests:create",
  ],
};

export function canRole(
  role: AppRole | null | undefined,
  permission: Permission,
) {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}

export function canLegacy(role: AppRole, permission: string) {
  return legacyCan(role, permission);
}
