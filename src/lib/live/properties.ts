import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PAGE_SIZE,
  readPage,
  requiredText,
  requirePermission,
  type LiveContext,
} from "./shared";

export type PropertyRow = {
  id: string;
  code: string;
  display_name: string;
  status: string;
};

export function propertyInput(name: string, code: string) {
  return {
    display_name: requiredText(name, "el nombre de la propiedad"),
    code: requiredText(code, "el código"),
  };
}

export async function listProperties(
  client: SupabaseClient,
  context: LiveContext,
  page = 0,
) {
  requirePermission(context, "properties:read");
  return readPage<PropertyRow>(
    client
      .from("properties")
      .select("id, code, display_name, status")
      .eq("organization_id", context.organizationId)
      .order("display_name")
      .order("id")
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
  );
}

export async function createProperty(
  client: SupabaseClient,
  context: LiveContext,
  name: string,
  code: string,
) {
  requirePermission(context, "properties:write");
  const input = propertyInput(name, code);
  const { data, error } = await client
    .from("properties")
    .insert({
      ...input,
      organization_id: context.organizationId,
      status: "active",
    })
    .select("id")
    .single();
  if (error) throw error;
  if (!data?.id) throw new Error("Unconfirmed insert");
  return data.id as string;
}
