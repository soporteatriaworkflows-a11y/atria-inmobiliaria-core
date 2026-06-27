import {
  getSupabasePublicConfig,
  isDevMode,
  isLiveMode,
} from "@/lib/app-config";
import { type ModuleIconName, ShieldIcon } from "@/components/icons";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { AtriaIconTile } from "@/components/ui";
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
  const modeLabel = isLiveMode
    ? "Producción activa"
    : isDevMode
      ? "Entorno de pruebas"
      : "Vista de demostración";

  return (
    <main className="min-h-screen px-3 py-3 text-atria-fog sm:px-5 sm:py-5 lg:px-6">
      <div className="mx-auto grid w-full max-w-[78rem] gap-4 lg:grid-cols-[15.5rem_1fr]">
        <aside className="atria-sidebar scroll-slim rounded-2xl border border-white/15 p-3.5 shadow-sidebar ring-1 ring-white/10 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-y-auto">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-center gap-2.5 px-1 pt-1">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-atria-violet to-atria-lavender font-display text-lg font-bold text-white shadow-glow ring-1 ring-white/20">
                A
              </span>
              <span className="leading-tight">
                <span className="block font-display text-base font-semibold text-white">
                  ATRIA
                </span>
                <span className="atria-sidebar-muted block text-2xs font-medium uppercase tracking-[0.18em]">
                  Inmobiliaria
                </span>
              </span>
            </div>

            <SidebarNav />

            <div className="mt-auto grid gap-2.5">
              <ThemeToggle />
              <div className="atria-sidebar-panel flex items-start gap-2.5 rounded-xl border p-3">
                <ShieldIcon className="atria-sidebar-muted mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">
                    Informacion protegida
                  </p>
                  <p className="atria-sidebar-muted mt-0.5 text-2xs leading-relaxed">
                    Sin datos reales. Los cambios financieros pasan por
                    revision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <header className="atria-panel atria-panel-accent px-4 py-3.5 shadow-soft backdrop-blur-sm sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                {icon ? <AtriaIconTile icon={icon} size="lg" /> : null}
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold leading-tight tracking-tight text-atria-fog sm:text-2xl">
                    {title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-atria-mist">
                    {description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start rounded-full border border-atria-edge bg-atria-elevated/70 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:self-auto">
                <span className="relative flex h-2 w-2 shrink-0">
                  {isLiveMode ? (
                    <span
                      aria-hidden="true"
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-atria-violet opacity-60"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="relative inline-flex h-2 w-2 rounded-full bg-atria-violet"
                  />
                </span>
                <span className="text-2xs font-medium text-atria-fog">
                  {modeLabel}
                </span>
                <span aria-hidden="true" className="h-3 w-px bg-atria-edge" />
                <span className="text-2xs text-atria-mist">
                  Datos de prueba
                </span>
              </div>
            </div>

            {isLiveMode && !supabaseConfig.isConfigured ? (
              <div className="mt-3 rounded-lg border border-atria-rose/30 bg-atria-rose/10 px-3 py-2 text-xs font-semibold text-atria-rose">
                Falta configurar la conexion segura del sistema.
              </div>
            ) : null}
          </header>

          <div className="grid gap-4">{children}</div>

          <footer className="px-1 pb-4 pt-1 text-2xs leading-relaxed text-atria-mist">
            ATRIA Inmobiliaria · Administracion de patrimonios · Version tecnica
            con datos de prueba.
          </footer>
        </div>
      </div>
    </main>
  );
}
