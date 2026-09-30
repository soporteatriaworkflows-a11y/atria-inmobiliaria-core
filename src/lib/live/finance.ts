import type { SupabaseClient } from "@supabase/supabase-js";
import { isPositiveCopAmount } from "@/lib/auth/crud-validation";
import {
  InputError,
  PAGE_SIZE,
  readPage,
  requiredText,
  requirePermission,
  type LiveContext,
} from "./shared";
import type { PropertyRow } from "./properties";

export type FinanceKind = "income" | "expenses";
export type FinanceRow = {
  id: string;
  property_id: string | null;
  period_month: string;
  amount_cop: number | string;
  status: string;
  description?: string;
  category?: string;
  properties: { display_name: string; code: string } | null;
};
export type FinanceInput = {
  amount: string;
  month: string;
  propertyId: string;
  description?: string;
  scope?: "global" | "property";
};
const tableFor = (kind: FinanceKind) =>
  kind === "income" ? "rent_collections" : "expenses";

export function periodMonth(month: string) {
  if (!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(month) || month.startsWith("0000"))
    throw new InputError("Selecciona un periodo válido.");
  return month + "-01";
}
export function currentMonth() {
  const date = new Date();
  return (
    String(date.getFullYear()) +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0")
  );
}
export function financeInput(kind: FinanceKind, input: FinanceInput) {
  if (!isPositiveCopAmount(input.amount))
    throw new InputError(
      "Ingresa un monto COP entero positivo, sin separadores, de hasta 14 dígitos.",
    );
  const base = {
    amount_cop: Number(input.amount),
    period_month: periodMonth(input.month),
  };
  if (kind === "income")
    return {
      ...base,
      property_id: requiredText(input.propertyId, "la propiedad"),
      source: "manual",
    };
  if (input.scope !== "global" && input.scope !== "property")
    throw new InputError("Selecciona el alcance del gasto.");
  return {
    ...base,
    property_id:
      input.scope === "property"
        ? requiredText(input.propertyId, "la propiedad")
        : null,
    category: input.scope,
    description: requiredText(
      input.description ?? "",
      "la descripción del gasto",
    ),
  };
}
export async function listFinance(
  client: SupabaseClient,
  context: LiveContext,
  kind: FinanceKind,
  page = 0,
) {
  requirePermission(
    context,
    kind === "income" ? "income:read" : "expenses:read",
  );
  const fields =
    "id, property_id, period_month, amount_cop, status, properties(display_name, code)" +
    (kind === "expenses" ? ", description, category" : "");
  return readPage<FinanceRow>(
    client
      .from(tableFor(kind))
      .select(fields)
      .eq("organization_id", context.organizationId)
      .order("created_at", { ascending: false })
      .order("id")
      .range(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE,
      ) as unknown as PromiseLike<{
      data: FinanceRow[] | null;
      error: unknown;
    }>,
  );
}
export async function propertyOptions(
  client: SupabaseClient,
  context: LiveContext,
) {
  requirePermission(context, "properties:read");
  // Keep selectors complete even when PostgREST caps each response.
  const rows: PropertyRow[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await client
      .from("properties")
      .select("id, code, display_name, status")
      .eq("organization_id", context.organizationId)
      .order("display_name")
      .order("id")
      .range(offset, offset + 99);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < 100) return rows;
  }
}
export async function createFinance(
  client: SupabaseClient,
  context: LiveContext,
  kind: FinanceKind,
  input: FinanceInput,
) {
  requirePermission(
    context,
    kind === "income" ? "income:write" : "expenses:write",
  );
  const payload = financeInput(kind, input);
  if (payload.property_id) {
    const { data, error } = await client
      .from("properties")
      .select("id")
      .eq("organization_id", context.organizationId)
      .eq("id", payload.property_id)
      .maybeSingle();
    if (error) throw error;
    if (!data)
      throw new InputError(
        "La propiedad ya no está disponible en esta organización. Actualiza el listado.",
      );
  }
  const { data, error } = await client
    .from(tableFor(kind))
    .insert({
      ...payload,
      organization_id: context.organizationId,
      status: "draft",
    })
    .select("id")
    .single();
  if (error) throw error;
  if (!data?.id) throw new Error("Unconfirmed insert");
  return data.id as string;
}
