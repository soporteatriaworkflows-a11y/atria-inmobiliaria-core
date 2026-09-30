"use client";
import { useCallback, useState } from "react";
import { SectionPanel, Badge } from "@/components/ui";
import { canRole } from "@/lib/auth/rbac";
import { type LiveContext } from "@/lib/live/shared";
import { createRequest, listRequests } from "@/lib/live/requests";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LiveModule,
  LiveFeedback,
  ListControls,
  useLiveCreate,
  useLiveResource,
  fieldClass,
  buttonClass,
} from "./live-state";
const statusLabels: Record<string, string> = {
  pending_review: "Pendiente de revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
};
export function RequestsLivePanel() {
  return (
    <LiveModule permission="requests:read">
      {(context) => <RequestsContent context={context} />}
    </LiveModule>
  );
}
function RequestsContent({ context }: { context: LiveContext }) {
  const [page, setPage] = useState(0);
  const load = useCallback(
    () => listRequests(createSupabaseBrowserClient(), context, page),
    [context, page],
  );
  const resource = useLiveResource(load);
  const write = useLiveCreate(resource.reload);
  const [detail, setDetail] = useState("");
  const canCreate = canRole(context.role, "requests:create");
  const disabled = resource.loading || write.saving;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      await write.save(
        () => createRequest(createSupabaseBrowserClient(), context, detail),
        "Solicitud guardada, pendiente de revisión.",
      )
    ) {
      setDetail("");
      setPage(0);
    }
  }
  return (
    <SectionPanel>
      <div className="grid gap-4">
        <h2 className="text-base font-semibold">
          {context.role === "owner_readonly"
            ? "Mis solicitudes"
            : "Solicitudes registradas"}
        </h2>
        <LiveFeedback
          {...resource}
          success={write.success}
          writeError={write.error}
          empty={!resource.data?.rows.length}
          emptyText="No hay solicitudes disponibles para tu acceso en esta organización."
        />
        {!resource.loading && resource.data ? (
          <ul className="grid gap-3">
            {resource.data.rows.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-atria-edge bg-atria-elevated/60 p-3"
              >
                <p className="whitespace-pre-wrap break-words font-semibold">
                  {typeof row.details?.resumen === "string"
                    ? row.details.resumen
                    : row.request_type}
                </p>
                <p className="text-sm text-atria-mist">
                  {row.requested_by === context.userId
                    ? "Creada por ti"
                    : "Solicitud de la organización"}{" "}
                  · {new Date(row.created_at).toLocaleString("es-CO")}
                </p>
                <Badge>{statusLabels[row.status] ?? row.status}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
        <ListControls
          page={page}
          hasNext={resource.data?.hasNext ?? false}
          disabled={disabled}
          onPage={setPage}
          reload={resource.reload}
        />
        {canCreate ? (
          <form
            onSubmit={submit}
            className="grid gap-3 border-t border-atria-edge pt-4"
          >
            <h3 className="font-semibold">Nueva solicitud de ajuste</h3>
            <p className="text-sm text-atria-mist">
              Enviar la solicitud no modifica los registros financieros. Quedará
              pendiente de revisión.
            </p>
            <label className="grid gap-1 text-sm">
              Detalle de la solicitud de ajuste
              <textarea
                aria-label="Detalle de la solicitud de ajuste"
                required
                className={fieldClass + " min-h-24"}
                value={detail}
                disabled={disabled}
                onChange={(e) => setDetail(e.target.value)}
              />
            </label>
            <button
              className={buttonClass}
              type="submit"
              disabled={disabled || Boolean(resource.error) || !detail.trim()}
            >
              {write.saving ? "Guardando..." : "Crear solicitud"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-atria-mist">
            Tu acceso permite consultar solicitudes.
          </p>
        )}
      </div>
    </SectionPanel>
  );
}
