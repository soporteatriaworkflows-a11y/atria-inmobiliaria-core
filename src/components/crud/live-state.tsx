"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { canRole, type Permission } from "@/lib/auth/rbac";
import { operationError, type LiveContext } from "@/lib/live/shared";

export const fieldClass =
  "focus-ring w-full rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm text-atria-fog disabled:opacity-60";
export const buttonClass =
  "focus-ring rounded-full bg-atria-violet px-4 py-2 text-sm font-semibold text-white disabled:opacity-50";

export function LiveModule({
  permission,
  children,
}: {
  permission: Permission;
  children: (context: LiveContext) => React.ReactNode;
}) {
  const auth = useAuth();
  if (auth.loading) return <p role="status">Cargando sesión...</p>;
  if (!auth.isAuthEnabled || !auth.user || !auth.organizationId || !auth.role) {
    return (
      <p role="alert">
        Inicia sesión con una organización asignada para consultar estos datos.
      </p>
    );
  }
  if (!canRole(auth.role, permission))
    return (
      <p role="alert">No tienes permiso para consultar esta información.</p>
    );
  const context = {
    organizationId: auth.organizationId,
    userId: auth.user.id,
    role: auth.role,
  };
  return (
    <Fragment
      key={[context.organizationId, context.userId, context.role].join(":")}
    >
      {children(context)}
    </Fragment>
  );
}

export function useLiveResource<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const version = useRef(0);
  const reload = useCallback(async () => {
    const current = ++version.current;
    setLoading(true);
    setError(null);
    try {
      const next = await load();
      if (current === version.current) setData(next);
    } catch (cause) {
      if (current === version.current) {
        setData(null);
        setError(operationError(cause, "read"));
      }
    } finally {
      if (current === version.current) setLoading(false);
    }
  }, [load]);
  useEffect(() => {
    void reload();
    return () => {
      ++version.current;
    };
  }, [reload]);
  return { data, loading, error, reload };
}

export function useLiveCreate(reload: () => Promise<void>) {
  const locked = useRef(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  async function save(operation: () => Promise<unknown>, message: string) {
    if (locked.current) return false;
    locked.current = true;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await operation();
      setSuccess(message);
      await reload();
      return true;
    } catch (cause) {
      setError(operationError(cause, "create"));
      return false;
    } finally {
      locked.current = false;
      setSaving(false);
    }
  }
  return { saving, error, success, save };
}

export function LiveFeedback({
  loading,
  error,
  success,
  writeError,
  empty,
  emptyText,
  reload,
}: {
  loading: boolean;
  error: string | null;
  success: string | null;
  writeError: string | null;
  empty: boolean;
  emptyText: string;
  reload: () => Promise<void>;
}) {
  return (
    <div className="grid gap-2 text-sm" aria-live="polite">
      {loading ? <p role="status">Cargando registros...</p> : null}
      {success ? (
        <p role="status" className="text-atria-emerald">
          {success}
        </p>
      ) : null}
      {writeError ? (
        <p role="alert" className="text-atria-rose">
          {writeError}
        </p>
      ) : null}
      {error ? (
        <div role="alert" className="grid gap-2 text-atria-rose">
          <p>{error}</p>
          <button
            type="button"
            className={buttonClass}
            onClick={() => void reload()}
          >
            Reintentar consulta
          </button>
        </div>
      ) : null}
      {!loading && !error && empty ? <p>{emptyText}</p> : null}
    </div>
  );
}

export function ListControls({
  page,
  hasNext,
  disabled,
  onPage,
  reload,
}: {
  page: number;
  hasNext: boolean;
  disabled: boolean;
  onPage: (page: number) => void;
  reload: () => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <button
        type="button"
        className={buttonClass}
        disabled={disabled}
        onClick={() => void reload()}
      >
        Actualizar listado
      </button>
      <button
        type="button"
        className={buttonClass}
        disabled={disabled || page === 0}
        onClick={() => onPage(page - 1)}
      >
        Anterior
      </button>
      <span>Página {page + 1}</span>
      <button
        type="button"
        className={buttonClass}
        disabled={disabled || !hasNext}
        onClick={() => onPage(page + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}
