"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon } from "@/components/icons";
import { SectionPanel } from "@/components/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  isPasswordRecoveryEvent,
  minimumPasswordLength,
  updateRecoveredPassword,
} from "@/lib/auth/password-recovery";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) {
        setError(sessionError.message);
      }
      setReady(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        if (isPasswordRecoveryEvent(event)) {
          setReady(Boolean(session));
          setError(null);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await updateRecoveredPassword(
        createSupabaseBrowserClient(),
        password,
        confirmPassword,
      );
      setSuccess("Contraseña actualizada. Ya puedes volver a iniciar sesión.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la contraseña.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid gap-3 lg:grid-cols-[1fr_20rem]">
      <SectionPanel>
        <div className="flex items-center gap-3 border-b border-atria-edge pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-atria-violet/15 text-atria-lavender">
            <LockIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-atria-fog">
              Definir nueva contraseña
            </h2>
            <p className="text-xs text-atria-mist">
              Usa el enlace seguro enviado por Supabase Auth.
            </p>
          </div>
        </div>

        <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
          <div>
            <label
              className="block text-xs font-semibold text-atria-fog"
              htmlFor="new-password"
            >
              Nueva contraseña
            </label>
            <input
              autoComplete="new-password"
              className="focus-ring mt-1.5 w-full rounded-lg border border-atria-edge bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!ready || submitting || Boolean(success)}
              id="new-password"
              minLength={minimumPasswordLength}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-atria-fog"
              htmlFor="confirm-password"
            >
              Confirmar contraseña
            </label>
            <input
              autoComplete="new-password"
              className="focus-ring mt-1.5 w-full rounded-lg border border-atria-edge bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!ready || submitting || Boolean(success)}
              id="confirm-password"
              minLength={minimumPasswordLength}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              value={confirmPassword}
            />
          </div>

          {!ready && !success ? (
            <p className="rounded-lg border border-atria-amber/25 bg-atria-amber/10 px-3 py-2 text-xs font-medium text-atria-amber">
              Abre esta pantalla desde el enlace de recuperación más reciente.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-lg border border-atria-rose/25 bg-atria-rose/10 px-3 py-2 text-xs font-medium text-atria-rose">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-lg border border-atria-emerald/25 bg-atria-emerald/10 px-3 py-2 text-xs font-medium text-atria-emerald">
              {success}
            </p>
          ) : null}

          <button
            className="focus-ring mt-1 w-full rounded-full bg-atria-violet px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-atria-lavender hover:text-atria-carbon disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!ready || submitting || Boolean(success)}
            type="submit"
          >
            {submitting ? "Actualizando..." : "Actualizar contraseña"}
          </button>
          <button
            className="focus-ring w-full rounded-full border border-atria-edge bg-atria-elevated px-4 py-2.5 text-sm font-semibold text-atria-mist transition hover:text-atria-fog"
            disabled={submitting}
            onClick={() => router.push("/login")}
            type="button"
          >
            Volver a login
          </button>
        </form>
      </SectionPanel>

      <SectionPanel className="bg-gradient-to-br from-atria-violet/15 to-atria-graphite">
        <h2 className="text-sm font-semibold text-atria-fog">
          Acceso protegido
        </h2>
        <p className="mt-3 text-xs leading-relaxed text-atria-mist">
          ATRIA no guarda ni muestra tu contraseña. La actualización se realiza
          directamente con la sesión segura de Supabase Auth.
        </p>
      </SectionPanel>
    </section>
  );
}
