import { canRole, type AppRole, type Permission } from "@/lib/auth/rbac";

export type LiveContext = {
  organizationId: string;
  userId: string;
  role: AppRole;
};
export type Page<T> = { rows: T[]; hasNext: boolean };
export const PAGE_SIZE = 25;

export class InputError extends Error {}

export function requirePermission(
  context: LiveContext,
  permission: Permission,
) {
  if (
    !context.organizationId ||
    !context.userId ||
    !canRole(context.role, permission)
  ) {
    throw new InputError("No tienes permiso para realizar esta operación.");
  }
}

export function requiredText(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) throw new InputError("Completa " + label + ".");
  return trimmed;
}

export async function readPage<T>(
  query: PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<Page<T>> {
  const { data, error } = await query;
  if (error) throw error;
  const rows = data ?? [];
  return { rows: rows.slice(0, PAGE_SIZE), hasNext: rows.length > PAGE_SIZE };
}

export function operationError(error: unknown, action: "read" | "create") {
  if (error instanceof InputError) return error.message;
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  if (code === "23505")
    return "Ya existe un registro con ese código en esta organización.";
  if (code === "42501")
    return "Tu sesión no tiene permiso para esta operación. Verifica tu acceso.";
  if (code === "23503")
    return "El registro relacionado ya no está disponible. Actualiza el listado.";
  if (code === "23514" || code === "22003")
    return "Revisa los datos y el monto ingresado.";
  return action === "read"
    ? "No se pudo cargar el listado. Intenta actualizarlo."
    : "No se pudo confirmar el guardado. Actualiza el listado antes de volver a intentarlo.";
}
