"use client";

import { useEffect, useState } from "react";
import { getSupabasePublicConfig, isLiveMode } from "@/lib/app-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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
      ? "Verificando conexion segura con Supabase..."
      : "Modo demo: Supabase no es requerido para revisar la interfaz.",
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
            "Modo live requiere NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
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
            message: "Supabase conectado. No hay datos reales cargados en esta vista.",
          });
          return;
        }

        if (error.code === "42501" || error.message.toLowerCase().includes("permission")) {
          setStatus({
            kind: "ok",
            message:
              "Supabase conectado. RLS protege los datos; inicia sesion cuando Auth este habilitado.",
          });
          return;
        }

        setStatus({
          kind: "warning",
          message: `Supabase respondio, pero la comprobacion no pudo leer datos publicos: ${error.message}`,
        });
      } catch {
        if (!cancelled) {
          setStatus({
            kind: "error",
            message: "No se pudo comprobar la conexion con Supabase desde el navegador.",
          });
        }
      }
    }

    void checkConnection();

    return () => {
      cancelled = true;
    };
  }, [config.isConfigured]);

  const styles = {
    error: "border-red-300 bg-red-50 text-red-900",
    idle: "border-atria-line bg-white text-slate-700",
    ok: "border-atria-mint bg-atria-mint text-atria-forest",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
  } satisfies Record<Status["kind"], string>;

  return (
    <section className={`rounded-lg border p-5 shadow-soft ${styles[status.kind]}`}>
      <p className="text-base font-semibold">Estado de Supabase</p>
      <p className="mt-2 text-xl leading-relaxed">{status.message}</p>
      {isLiveMode ? (
        <p className="mt-3 text-base leading-relaxed">
          Backend: Supabase atria-inmobiliaria. Sin service role, sin claves
          secretas y sin datos reales en esta etapa.
        </p>
      ) : null}
    </section>
  );
}
