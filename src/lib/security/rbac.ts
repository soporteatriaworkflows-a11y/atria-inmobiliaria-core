export const roles = [
  "platform_admin",
  "estate_admin",
  "accountant",
  "owner_readonly",
] as const;

export type AppRole = (typeof roles)[number];

const permissions = {
  platform_admin: [
    "finance:read",
    "finance:write",
    "requests:review",
    "audit:read",
  ],
  estate_admin: [
    "finance:read",
    "finance:write",
    "requests:review",
    "audit:read",
  ],
  accountant: ["finance:read", "finance:write", "audit:read"],
  owner_readonly: ["finance:read", "requests:create"],
} satisfies Record<AppRole, string[]>;

export function can(role: AppRole, permission: string): boolean {
  return permissions[role].includes(permission);
}
