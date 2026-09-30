import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PAGE_SIZE,
  readPage,
  requiredText,
  requirePermission,
  type LiveContext,
} from "./shared";
export type RequestRow = {
  id: string;
  requested_by: string | null;
  request_type: string;
  status: string;
  details: Record<string, unknown>;
  created_at: string;
};
export async function listRequests(
  client: SupabaseClient,
  context: LiveContext,
  page = 0,
) {
  requirePermission(context, "requests:read");
  let query = client
    .from("change_requests")
    .select("id, requested_by, request_type, status, details, created_at")
    .eq("organization_id", context.organizationId)
    .order("created_at", { ascending: false })
    .order("id")
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  if (context.role === "owner_readonly")
    query = query.eq("requested_by", context.userId);
  return readPage<RequestRow>(query);
}
export async function createRequest(
  client: SupabaseClient,
  context: LiveContext,
  detail: string,
) {
  requirePermission(context, "requests:create");
  const summary = requiredText(detail, "el detalle de la solicitud");
  const { data, error } = await client
    .from("change_requests")
    .insert({
      organization_id: context.organizationId,
      requested_by: context.userId,
      request_type: "adjustment",
      status: "pending_review",
      details: { resumen: summary, origen: "ui" },
    })
    .select("id")
    .single();
  if (error) throw error;
  if (!data?.id) throw new Error("Unconfirmed insert");
  return data.id as string;
}
