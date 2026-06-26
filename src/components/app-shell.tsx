import {
  getSupabasePublicConfig,
  isDemoMode,
  isDevMode,
  isLiveMode,
} from "@/lib/app-config";
import { ModuleIcon, type ModuleIconName, ShieldIcon } from "@/components/icons";
import { SidebarNav } from "@/components/sidebar-nav";
import { StatusPill } from "@/components/ui";

export function AppShell({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon?: ModuleIconName;
  children: React.ReactNode;
}) {
  const supabaseConfig = getSupabasePublicConfig();

  return (
    <main className="min-h-screen px-4 py-4 text-atria-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[19rem_1fr]">
        <aside className="rounded-3xl border border-atria-line bg-atria-forest p-5 text-white shadow-panel lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-y-auto">
          <div className="flex h-full flex-col gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-atria-mint text-2xl font-black text-atria-forest font-display">
                  A
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.22em] text-atria-mint">
                    ATRIA
                  </span>
                  <span className="block font-display text-2xl font-semibold leading-tight">
                    Inmobiliaria
                  </span>
                </span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-white/80">
                Administracion clara para patrimonios, propiedades y cierres
                mensuales en familia.
              </p>
            </div>

            <SidebarNav />

            <div className="mt-auto flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <ShieldIcon className="mt-0.5 h-6 w-6 shrink-0 text-atria-mint" />
              <div>
                <p className="text-base font-bold">Base segura</p>
                <p className="mt-1 text-sm leading-relaxed text-white/78">
                  Sin datos reales. Los cambios financieros requieren auditoria
                  y revision.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <header className="rounded-3xl border border-atria-line bg-white/90 p-5 shadow-soft sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  {isDemoMode ? (
                    <StatusPill tone="warning">Modo demostracion</StatusPill>
                  ) : null}
                  {isDevMode ? <StatusPill tone="warning">Entorno de pruebas</StatusPill> : null}
                  {isLiveMode ? (
                    <StatusPill tone="success">Produccion conectada</StatusPill>
                  ) : null}
                  <StatusPill tone="neutral">Datos de ejemplo</StatusPill>
                </div>
                <div className="mt-4 flex items-start gap-4">
                  {icon ? (
                    <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-atria-mint text-atria-forest sm:flex">
                      <ModuleIcon className="h-8 w-8" name={icon} />
                    </span>
                  ) : null}
                  <div>
                    <h2 className="font-display text-3xl font-semibold leading-tight text-atria-ink sm:text-[2.75rem]">
                      {title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-xl leading-relaxed text-atria-muted">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {isLiveMode && !supabaseConfig.isConfigured ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-base font-semibold text-red-900">
                  Faltan variables publicas de Supabase para modo live.
                </div>
              ) : null}
            </div>
          </header>

          <div className="grid gap-5">{children}</div>

          <footer className="px-2 pb-6 pt-1 text-sm leading-relaxed text-atria-muted">
            ATRIA Inmobiliaria · Administracion familiar de patrimonios ·
            Version tecnica con datos de ejemplo.
          </footer>
        </div>
      </div>
    </main>
  );
}
