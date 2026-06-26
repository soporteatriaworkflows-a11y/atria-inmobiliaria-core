import Link from "next/link";
import {
  getSupabasePublicConfig,
  isDemoMode,
  isDevMode,
  isLiveMode,
} from "@/lib/app-config";
import { mainNavigation } from "@/lib/navigation";
import { StatusPill } from "@/components/ui";

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const supabaseConfig = getSupabasePublicConfig();

  return (
    <main className="min-h-screen px-4 py-4 text-atria-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[18rem_1fr]">
        <aside className="rounded-3xl border border-atria-line bg-atria-forest p-5 text-white shadow-panel lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
          <div className="flex h-full flex-col gap-6">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-atria-mint text-xl font-black text-atria-forest">
                A
              </div>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-atria-mint">
                ATRIA
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight">
                Inmobiliaria
              </h1>
              <p className="mt-3 text-base leading-relaxed text-white/78">
                Administracion clara para patrimonios, propiedades y cierres mensuales.
              </p>
            </div>

            <nav aria-label="Rutas principales" className="grid gap-2">
              {mainNavigation.map((item) => (
                <Link
                  className="focus-ring rounded-2xl px-4 py-3 text-base font-bold text-white/88 transition hover:bg-white/12 hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-base font-bold">Base segura</p>
              <p className="mt-2 text-sm leading-relaxed text-white/76">
                Sin datos reales. Los cambios financieros requieren auditoria y revision.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <header className="rounded-3xl border border-atria-line bg-white/90 p-5 shadow-soft sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  {isDemoMode ? (
                    <StatusPill tone="warning">Demo seguro</StatusPill>
                  ) : null}
                  {isDevMode ? <StatusPill tone="warning">DEV seguro</StatusPill> : null}
                  {isLiveMode ? (
                    <StatusPill tone="success">Produccion conectada</StatusPill>
                  ) : null}
                  <StatusPill tone="neutral">Datos sanitizados</StatusPill>
                </div>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-atria-ink sm:text-5xl">
                  {title}
                </h2>
                <p className="mt-4 max-w-3xl text-xl leading-relaxed text-atria-muted">
                  {description}
                </p>
              </div>

              {isLiveMode && !supabaseConfig.isConfigured ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-base font-semibold text-red-900">
                  Faltan variables publicas de Supabase para modo live.
                </div>
              ) : null}
            </div>
          </header>

          <div className="grid gap-5 pb-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
