"use client";

import { useEffect, useState } from "react";
import { getSupabasePublicConfig, isLiveMode } from "@/lib/app-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { SectionPanel, StatusPill, type Tone } from "@/components/ui";

type Status =
  | { kind: "idle"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "warning"; message: string }
  | { kind: "error"; message: string };

export function SupabaseLiveStatus() {
  const config = getSupabasePublicConfig();
  const [status, setStatus] = useState<Status>({
    kind: "idle",
    message: isLiveMode
      ? "Estamos comprobando la conexion segura."
      : "Puedes revisar la interfaz sin conectar Supabase.",
  });

  useEffect(() => {
    let cancelled = false;

    async function checkConnection() {
      if (!isLiveMode) {
        return;
      }

      if (!config.isConfigured) {
        setStatus({
          kind: "error",
          message:
            "Faltan variables publicas de Supabase para trabajar en modo live.",
        });
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase
          .from("organizations")
          .select("id", { count: "exact", head: true })
          .limit(1);

        if (cancelled) {
          return;
        }

        if (!error) {
          setStatus({
            kind: "ok",
            message: "Supabase conectado. La vista sigue sin datos reales.",
          });
          return;
        }

        if (error.code === "42501" || error.message.toLowerCase().includes("permission")) {
          setStatus({
            kind: "ok",
            message:
              "Supabase conectado. Los datos estan protegidos hasta habilitar inicio de sesion.",
          });
          return;
        }

        setStatus({
          kind: "warning",
          message:
            "Supabase respondio, pero esta vista aun no tiene lectura publica habilitada.",
        });
      } catch {
        if (!cancelled) {
          setStatus({
            kind: "error",
            message: "No se pudo comprobar Supabase desde el navegador.",
          });
        }
      }
    }

    void checkConnection();

    return () => {
      cancelled = true;
    };
  }, [config.isConfigured]);

  const toneByStatus: Record<Status["kind"], Tone> = {
    error: "danger",
    idle: "neutral",
    ok: "success",
    warning: "warning",
  };

  return (
    <SectionPanel className="bg-atria-cream">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-bold text-atria-muted">Estado del sistema</p>
          <h2 className="mt-2 text-2xl font-bold text-atria-ink">
            Plataforma conectada con cuidado
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-atria-muted">
            {status.message}
          </p>
          {isLiveMode ? (
            <p className="mt-3 text-base leading-relaxed text-atria-muted">
              Backend ATRIA en Supabase. Sin claves secretas en frontend y sin datos reales en esta etapa.
            </p>
          ) : null}
        </div>
        <StatusPill tone={toneByStatus[status.kind]}>
          {status.kind === "ok" ? "Supabase conectado" : "Revision"}
        </StatusPill>
      </div>
    </SectionPanel>
  );
}
