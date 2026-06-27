"use client";

import { useState } from "react";
import { CheckIcon, LockIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/auth-provider";
import { getDefaultRouteForRole } from "@/lib/auth/routes";
import { Badge, SectionPanel } from "@/components/ui";

const trustPoints = [
  "No pedimos claves, cuentas bancarias ni documentos reales en esta version.",
  "El ingreso real usa Supabase Auth y respeta roles por organizacion.",
  "Cada cambio operativo queda preparado para trazabilidad y auditoria.",
];

export function LoginForm() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.isAuthEnabled) return;
    setSubmitting(true);
    setLocalError(null);
    try {
      const nextRole = await auth.signIn(email, password);
      window.location.assign(getDefaultRouteForRole(nextRole));
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "No se pudo iniciar sesion.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onSignOut() {
    setSubmitting(true);
    await auth.signOut();
    setSubmitting(false);
  }

  const disabled = !auth.isAuthEnabled || submitting;

  return (
    <section className="grid gap-3 lg:grid-cols-[1fr_20rem]">
      <SectionPanel>
        <div className="flex items-center gap-3 border-b border-atria-edge pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-atria-violet/15 text-atria-lavender">
            <LockIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-atria-fog">
              Entrar a ATRIA
            </h2>
            <p className="text-xs text-atria-mist">
              {auth.isAuthEnabled
                ? "Ingreso seguro activo"
                : "Vista de prueba sin sesion real"}
            </p>
          </div>
          <span className="ml-auto">
            <Badge tone={auth.isAuthEnabled ? "success" : "warning"}>
              {auth.isAuthEnabled ? "Activo" : "Prueba"}
            </Badge>
          </span>
        </div>

        {auth.session ? (
          <div className="mt-4 grid gap-3">
            <p className="text-sm font-medium text-atria-fog">
              Sesion iniciada
            </p>
            <p className="text-xs leading-relaxed text-atria-mist">
              {auth.user?.email ?? "Usuario autenticado"} � {auth.roleLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className="focus-ring rounded-full bg-atria-violet px-4 py-2 text-sm font-semibold text-white transition hover:bg-atria-lavender hover:text-atria-carbon"
                onClick={() =>
                  window.location.assign(getDefaultRouteForRole(auth.role))
                }
                type="button"
              >
                Ir al dashboard
              </button>
              <button
                className="focus-ring rounded-full border border-atria-edge bg-atria-elevated px-4 py-2 text-sm font-semibold text-atria-mist transition hover:text-atria-fog"
                disabled={submitting}
                onClick={onSignOut}
                type="button"
              >
                Cerrar sesion
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
            <div>
              <label
                className="block text-xs font-semibold text-atria-fog"
                htmlFor="email"
              >
                Correo de acceso
              </label>
              <input
                autoComplete="email"
                className="focus-ring mt-1.5 w-full rounded-lg border border-atria-edge bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@atria.local"
                type="email"
                value={email}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-atria-fog"
                htmlFor="password"
              >
                Contrasena
              </label>
              <input
                autoComplete="current-password"
                className="focus-ring mt-1.5 w-full rounded-lg border border-atria-edge bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  auth.isAuthEnabled ? "Contrasena" : "Disponible en modo live"
                }
                type="password"
                value={password}
              />
            </div>

            {localError || auth.error ? (
              <p className="rounded-lg border border-atria-rose/25 bg-atria-rose/10 px-3 py-2 text-xs font-medium text-atria-rose">
                {localError ?? auth.error}
              </p>
            ) : null}

            <button
              className="focus-ring mt-1 w-full rounded-full bg-atria-violet px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-atria-lavender hover:text-atria-carbon disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled || !email || !password}
              type="submit"
            >
              {auth.isAuthEnabled
                ? submitting
                  ? "Ingresando..."
                  : "Ingresar"
                : "Ingreso real no activo"}
            </button>
            <p className="text-xs leading-relaxed text-atria-mist">
              {auth.isAuthEnabled
                ? "El acceso usa la sesion de Supabase y aplica permisos por rol."
                : "Activa modo live y variables publicas de Supabase para usar Auth real."}
            </p>
          </form>
        )}
      </SectionPanel>

      <SectionPanel className="bg-gradient-to-br from-atria-violet/15 to-atria-graphite">
        <h2 className="text-sm font-semibold text-atria-fog">
          Antes de entrar
        </h2>
        <ul className="mt-3 grid gap-2.5">
          {trustPoints.map((point) => (
            <li
              className="flex items-start gap-2.5 text-xs leading-relaxed text-atria-mist"
              key={point}
            >
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-atria-violet/15 text-atria-lavender">
                <CheckIcon className="h-3 w-3" />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </SectionPanel>
    </section>
  );
}
