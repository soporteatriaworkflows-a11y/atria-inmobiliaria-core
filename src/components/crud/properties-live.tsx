"use client";

import { useCallback, useState } from "react";
import { SectionPanel, Badge } from "@/components/ui";
import { canRole } from "@/lib/auth/rbac";
import { type LiveContext } from "@/lib/live/shared";
import { createProperty, listProperties } from "@/lib/live/properties";
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

export function PropertiesLivePanel() {
  return (
    <LiveModule permission="properties:read">
      {(context) => <PropertiesContent context={context} />}
    </LiveModule>
  );
}

function PropertiesContent({ context }: { context: LiveContext }) {
  const [page, setPage] = useState(0);
  const load = useCallback(
    () => listProperties(createSupabaseBrowserClient(), context, page),
    [context, page],
  );
  const resource = useLiveResource(load);
  const write = useLiveCreate(resource.reload);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const canWrite = canRole(context.role, "properties:write");
  const disabled = resource.loading || write.saving;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      await write.save(
        () =>
          createProperty(createSupabaseBrowserClient(), context, name, code),
        "Propiedad guardada correctamente.",
      )
    ) {
      setName("");
      setCode("");
    }
  }
  return (
    <SectionPanel>
      <div className="grid gap-4">
        <h2 className="text-base font-semibold">Propiedades registradas</h2>
        <LiveFeedback
          {...resource}
          success={write.success}
          writeError={write.error}
          empty={!resource.data?.rows.length}
          emptyText="No hay propiedades registradas en esta organización."
        />
        {!resource.loading && resource.data ? (
          <ul className="grid gap-3">
            {resource.data.rows.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-atria-edge bg-atria-elevated/60 p-3"
              >
                <p className="font-semibold">{row.display_name}</p>
                <p className="text-sm text-atria-mist">Código: {row.code}</p>
                <Badge>{row.status === "active" ? "Activa" : row.status}</Badge>
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
        {canWrite ? (
          <form
            onSubmit={submit}
            className="grid gap-3 border-t border-atria-edge pt-4"
          >
            <h3 className="font-semibold">Nueva propiedad</h3>
            <label className="grid gap-1 text-sm">
              Nombre de propiedad
              <input
                className={fieldClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={disabled}
              />
            </label>
            <label className="grid gap-1 text-sm">
              Código de propiedad
              <input
                className={fieldClass}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={disabled}
              />
            </label>
            <button
              className={buttonClass}
              type="submit"
              disabled={
                disabled ||
                Boolean(resource.error) ||
                !name.trim() ||
                !code.trim()
              }
            >
              {write.saving ? "Guardando..." : "Crear propiedad"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-atria-mist">
            Tu acceso permite consultar propiedades.
          </p>
        )}
      </div>
    </SectionPanel>
  );
}
