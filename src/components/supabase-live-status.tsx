"use client";

import { useEffect, useState } from "react";
import { getSupabasePublicConfig, isLiveMode } from "@/lib/app-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { type Tone } from "@/components/ui";

type Status =
  | { kind: "idle"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "warning"; message: string }
  | { kind: "error"; message: string };

const dotByTone: Record<Tone, string> = {
  danger: "bg-atria-rose",
  neutral: "bg-atria-leaf",
  success: "bg-atria-forest",
  warning: "bg-atria-amber",
};

const labelByKind: Record<Status["kind"], string> = {
  idle: "Verificando",
  ok: "Conectado",
  warning: "Atencion",
  error: "Sin conexion",
};

export function SupabaseLiveStatus() {
  const config = getSupabasePublicConfig();
  const [status, setStatus] = useState<Status>({
    kind: "idle",
    message: isLiveMode
      ? "Verificando la conexion del sistema."
      : "Puedes revisar la interfaz sin conexion.",
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
          message: "Falta configurar la conexion del sistema.",
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
            message: "Sistema conectado. La informacion sigue protegida.",
          });
          return;
        }

        if (error.code === "42501" || error.message.toLowerCase().includes("permission")) {
          setStatus({
            kind: "ok",
            message:
              "Sistema conectado. La informacion esta protegida hasta iniciar sesion.",
          });
          return;
        }

        setStatus({
          kind: "warning",
          message: "El sistema respondio, pero esta vista aun no muestra registros.",
        });
      } catch {
        if (!cancelled) {
          setStatus({
            kind: "error",
            message: "No se pudo verificar la conexion en este momento.",
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

  const tone = toneByStatus[status.kind];

  return (
    <section className="flex items-center gap-3 rounded-xl border border-atria-line/80 bg-white px-4 py-3 shadow-card">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {status.kind === "ok" ? (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotByTone[tone]} opacity-60`} />
        ) : null}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotByTone[tone]}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-atria-muted">
          Estado del sistema
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-atria-ink">
          {status.message}
        </p>
      </div>
      <span
        className={`hidden shrink-0 rounded-full border px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide sm:inline-flex ${
          tone === "success"
            ? "border-atria-mint bg-atria-mint/70 text-atria-forest"
            : tone === "warning"
              ? "border-amber-200 bg-amber-50 text-atria-amber"
              : tone === "danger"
                ? "border-red-200 bg-red-50 text-atria-rose"
                : "border-atria-line bg-atria-surface text-atria-muted"
        }`}
      >
        {labelByKind[status.kind]}
      </span>
    </section>
  );
}
