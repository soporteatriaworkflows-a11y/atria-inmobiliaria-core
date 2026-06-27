"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabasePublicConfig, isLiveMode } from "@/lib/app-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { canAccessRoute, getDefaultRouteForRole } from "@/lib/auth/routes";
import { type AppRole, roleLabels } from "@/lib/auth/rbac";

type Membership = {
  organization_id: string;
  role: AppRole;
};

type AuthState = {
  isAuthEnabled: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  organizationId: string | null;
  roleLabel: string;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AppRole | null>;
  signOut: () => Promise<void>;
  refreshMembership: () => Promise<AppRole | null>;
};

const AuthContext = createContext<AuthState | null>(null);

const rolePriority: Record<AppRole, number> = {
  platform_admin: 1,
  estate_admin: 2,
  accountant: 3,
  owner_readonly: 4,
};

function pickPrimaryMembership(rows: Membership[]) {
  return (
    [...rows].sort((a, b) => rolePriority[a.role] - rolePriority[b.role])[0] ??
    null
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const config = getSupabasePublicConfig();
  const isAuthEnabled = isLiveMode && config.isConfigured;
  const [loading, setLoading] = useState(isAuthEnabled);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshMembership() {
    if (!isAuthEnabled) return null;
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: membershipError } = await supabase
        .from("memberships")
        .select("organization_id, role")
        .limit(20);

      if (membershipError) throw membershipError;
      const primary = pickPrimaryMembership((data ?? []) as Membership[]);
      setRole(primary?.role ?? null);
      setOrganizationId(primary?.organization_id ?? null);
      return primary?.role ?? null;
    } catch (err) {
      setRole(null);
      setOrganizationId(null);
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el rol.",
      );
      return null;
    }
  }

  useEffect(() => {
    if (!isAuthEnabled) {
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session ?? null);
      if (data.session) await refreshMembership();
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession) {
          void refreshMembership();
        } else {
          setRole(null);
          setOrganizationId(null);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [isAuthEnabled]);

  const value = useMemo<AuthState>(
    () => ({
      isAuthEnabled,
      loading,
      session,
      user: session?.user ?? null,
      role,
      organizationId,
      roleLabel: role ? roleLabels[role] : "Sin rol asignado",
      error,
      async signIn(email, password) {
        setError(null);
        const supabase = createSupabaseBrowserClient();
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          throw signInError;
        }
        setSession(data.session ?? null);
        return await refreshMembership();
      },
      async signOut() {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        setSession(null);
        setRole(null);
        setOrganizationId(null);
      },
      refreshMembership,
    }),
    [error, isAuthEnabled, loading, organizationId, role, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}

export function AuthGate({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const auth = useAuth();
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (!auth.isAuthEnabled || auth.loading || !requireAuth) return;
    if (!auth.session) {
      window.location.replace("/login");
      return;
    }
    if (pathname === "/" && auth.role) {
      window.location.replace(getDefaultRouteForRole(auth.role));
      return;
    }
    if (!canAccessRoute(auth.role, pathname)) {
      window.location.replace(getDefaultRouteForRole(auth.role));
    }
  }, [
    auth.isAuthEnabled,
    auth.loading,
    auth.role,
    auth.session,
    pathname,
    requireAuth,
  ]);

  if (!auth.isAuthEnabled || !requireAuth) return <>{children}</>;

  if (auth.loading) {
    return (
      <div className="atria-panel p-5 text-sm text-atria-mist">
        Verificando sesion segura...
      </div>
    );
  }

  if (!auth.session) {
    return (
      <div className="atria-panel p-5 text-sm text-atria-mist">
        Redirigiendo al ingreso seguro...
      </div>
    );
  }

  if (!canAccessRoute(auth.role, pathname)) {
    return (
      <div className="atria-panel p-5 text-sm text-atria-mist">
        No tienes permisos para esta vista.
      </div>
    );
  }

  return <>{children}</>;
}
