"use client";

import { useState } from "react";
import { CheckIcon, LockIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/auth-provider";
import { getDefaultRouteForRole } from "@/lib/auth/routes";
import {
  getPasswordRecoveryRedirect,
  requestPasswordReset,
} from "@/lib/auth/password-recovery";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge, SectionPanel } from "@/components/ui";

const trustPoints = [
  "No pedimos claves, cuentas bancarias ni documentos reales en esta versión.",
  "El ingreso real usa Supabase Auth y respeta roles por organización.",
  "Cada cambio operativo queda preparado para trazabilidad y auditoría.",
];

export function LoginForm() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

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
        err instanceof Error ? err.message : "No se pudo iniciar sesión.",
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

  async function onRequestPasswordReset(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!auth.isAuthEnabled) return;
    setResetSubmitting(true);
    setLocalError(null);
    setResetMessage(null);
    try {
      await requestPasswordReset(
        createSupabaseBrowserClient(),
        resetEmail,
        getPasswordRecoveryRedirect(window.location.origin),
      );
      setResetMessage(
        "Te enviamos un enlace para restablecer la contraseña si el correo está registrado.",
      );
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el correo de recuperación.",
      );
    } finally {
      setResetSubmitting(false);
    }
  }

  const disabled = !auth.isAuthEnabled || submitting;
  const recoveryDisabled = !auth.isAuthEnabled || resetSubmitting;

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
                : "Vista de prueba sin sesión real"}
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
              Sesión iniciada
            </p>
            <p className="text-xs leading-relaxed text-atria-mist">
              {auth.user?.email ?? "Usuario autenticado"} · {auth.roleLabel}
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
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : showRecovery ? (
          <form className="mt-4 grid gap-4" onSubmit={onRequestPasswordReset}>
            <div>
              <label
                className="block text-xs font-semibold text-atria-fog"
                htmlFor="reset-email"
              >
                Correo de acceso
              </label>
              <input
                autoComplete="email"
                className="focus-ring mt-1.5 w-full rounded-lg border border-atria-edge bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={recoveryDisabled}
                id="reset-email"
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="usuario@atria.local"
                type="email"
                value={resetEmail}
              />
            </div>

            {localError || auth.error ? (
              <p className="rounded-lg border border-atria-rose/25 bg-atria-rose/10 px-3 py-2 text-xs font-medium text-atria-rose">
                {localError ?? auth.error}
              </p>
            ) : null}
            {resetMessage ? (
              <p className="rounded-lg border border-atria-emerald/25 bg-atria-emerald/10 px-3 py-2 text-xs font-medium text-atria-emerald">
                {resetMessage}
              </p>
            ) : null}

            <button
              className="focus-ring mt-1 w-full rounded-full bg-atria-violet px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-atria-lavender hover:text-atria-carbon disabled:cursor-not-allowed disabled:opacity-60"
              disabled={recoveryDisabled || !resetEmail}
              type="submit"
            >
              {resetSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>
            <button
              className="focus-ring w-full rounded-full border border-atria-edge bg-atria-elevated px-4 py-2.5 text-sm font-semibold text-atria-mist transition hover:text-atria-fog"
              disabled={resetSubmitting}
              onClick={() => {
                setShowRecovery(false);
                setLocalError(null);
                setResetMessage(null);
              }}
              type="button"
            >
              Volver al ingreso
            </button>
          </form>
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
                Contraseña
              </label>
              <input
                autoComplete="current-password"
                className="focus-ring mt-1.5 w-full rounded-lg border border-atria-edge bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  auth.isAuthEnabled ? "Contraseña" : "Disponible en modo live"
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
            <button
              className="focus-ring w-fit text-xs font-semibold text-atria-lavender transition hover:text-atria-fog disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!auth.isAuthEnabled || submitting}
              onClick={() => {
                setShowRecovery(true);
                setResetEmail(email);
                setLocalError(null);
                setResetMessage(null);
              }}
              type="button"
            >
              Olvidé mi contraseña
            </button>
            <p className="text-xs leading-relaxed text-atria-mist">
              {auth.isAuthEnabled
                ? "El acceso usa la sesión de Supabase y aplica permisos por rol."
                : "Activa modo live y variables públicas de Supabase para usar Auth real."}
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
