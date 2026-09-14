"use client";

import { useEffect, useState } from "react";
import { getSupabasePublicConfig, isLiveMode } from "@/lib/app-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { type Tone, StatusPill } from "@/components/ui";

type Status =
  | { kind: "idle"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "warning"; message: string }
  | { kind: "error"; message: string };

const dotByTone: Record<Tone, string> = {
  primary: "bg-atria-violet",
  danger: "bg-atria-rose",
  neutral: "bg-atria-lavender",
  success: "bg-atria-emerald",
  warning: "bg-atria-amber",
};

const labelByKind: Record<Status["kind"], string> = {
  idle: "Verificando",
  ok: "Conectado",
  warning: "En revisión",
  error: "Sin conexión",
};

export function SupabaseLiveStatus() {
  const config = getSupabasePublicConfig();
  const [status, setStatus] = useState<Status>({
    kind: "idle",
    message: isLiveMode
      ? "Verificando la conexión del sistema."
      : "Vista segura con datos de prueba y sin información real.",
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
          message: "Falta configurar la conexión del sistema.",
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
            message: "Conexión activa. La información sigue protegida.",
          });
          return;
        }

        if (
          error.code === "42501" ||
          error.message.toLowerCase().includes("permission")
        ) {
          setStatus({
            kind: "ok",
            message:
              "Conexión activa. La información se habilita al iniciar sesión.",
          });
          return;
        }

        setStatus({
          kind: "warning",
          message:
            "El sistema respondió; inicia sesión para ver datos protegidos.",
        });
      } catch {
        if (!cancelled) {
          setStatus({
            kind: "error",
            message: "No se pudo verificar la conexión en este momento.",
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
    <section className="atria-panel atria-panel-accent flex items-center gap-3 px-4 py-3.5">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-atria-violet/20 bg-atria-violet/[0.08]">
        {status.kind === "ok" ? (
          <span
            aria-hidden="true"
            className={`absolute h-2.5 w-2.5 animate-ping rounded-full ${dotByTone[tone]} opacity-45`}
          />
        ) : null}
        <span
          aria-hidden="true"
          className={`relative h-2.5 w-2.5 rounded-full ${dotByTone[tone]}`}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-atria-lavender">
          Estado del entorno
        </p>
        <p className="mt-0.5 text-sm font-medium leading-relaxed text-atria-fog">
          {status.message}
        </p>
      </div>
      <div className="hidden shrink-0 sm:block">
        <StatusPill tone={tone}>{labelByKind[status.kind]}</StatusPill>
      </div>
    </section>
  );
}
