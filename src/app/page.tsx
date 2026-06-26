import { AppShell } from "@/components/app-shell";
import { SupabaseLiveStatus } from "@/components/supabase-live-status";
import { MetricCard, QuickAction, StatusPill } from "@/components/ui";
import { Donut, LabeledBar, ProgressBar, TimelineItem } from "@/components/viz";
import { demoLiquidation, demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

const activity = [
  { date: "Hoy", actor: "Contador", action: "revisó los gastos del periodo.", tone: "warning" as const },
  { date: "Ayer", actor: "Administrador", action: "envió el cierre a revisión.", tone: "primary" as const },
  { date: "02 jun", actor: "Sistema", action: "registró 2 ingresos de propiedades.", tone: "success" as const },
];

export default function HomePage() {
  const ingresos = demoLiquidation.totalCollectionsCop;
  const gastos =
    demoLiquidation.totalPropertyExpensesCop + demoLiquidation.totalGlobalExpensesCop;
  const saldo = ingresos - gastos;
  const maxBar = Math.max(ingresos, gastos);
  const cierreProgreso = 60; // demo: avance del cierre del periodo

  return (
    <AppShell
      title="Dashboard"
      description="Centro de control de ATRIA con datos de prueba. Sin información real hasta activar el ingreso y los permisos."
      icon="home"
    >
      <SupabaseLiveStatus />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Ingresos del mes" value={formatCop(ingresos)} helper="Total de prueba del periodo." tone="success" icon="recaudos" />
        <MetricCard label="Gastos del mes" value={formatCop(gastos)} helper="Por propiedad y globales." tone="warning" icon="gastos" />
        <MetricCard label="Propiedades activas" value={String(demoLiquidationInput.properties.length)} helper="En administración este periodo." tone="primary" icon="propiedades" />
        <MetricCard label="Solicitudes" value="2" helper="Ajustes pendientes de revisión." tone="neutral" icon="solicitudes" />
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-atria-graphite p-4 shadow-card sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-atria-fog">Cierre mensual en curso</h3>
              <p className="mt-0.5 text-xs text-atria-mist">Periodo {demoLiquidationInput.month} · en revisión contable</p>
            </div>
            <StatusPill tone="warning">En proceso</StatusPill>
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-atria-mist">Avance del cierre</span>
              <span className="text-xs font-semibold text-atria-lavender">{cierreProgreso}%</span>
            </div>
            <ProgressBar value={cierreProgreso} tone="primary" />
          </div>

          <div className="grid gap-3 pt-1">
            <LabeledBar label="Ingresos" caption={formatCop(ingresos)} value={ingresos} max={maxBar} tone="success" />
            <LabeledBar label="Gastos" caption={formatCop(gastos)} value={gastos} max={maxBar} tone="warning" />
          </div>

          <a
            className="focus-ring mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-atria-violet px-3.5 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-atria-lavender hover:text-atria-carbon"
            href="/liquidacion"
          >
            Revisar distribución
          </a>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-atria-indigo/50 to-atria-graphite p-4 shadow-card sm:p-5">
          <h3 className="self-start text-sm font-semibold text-atria-fog">Saldo estimado</h3>
          <Donut value={saldo} max={ingresos} tone="primary" center={`${Math.round((saldo / ingresos) * 100)}%`} caption="del ingreso" />
          <p className="text-lg font-semibold text-atria-fog">{formatCop(saldo)}</p>
          <p className="text-center text-2xs text-atria-mist">Disponible para distribución tras gastos.</p>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-atria-graphite p-4 shadow-card sm:p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-atria-fog">Accesos rápidos</h3>
            <span className="text-2xs font-medium uppercase tracking-wide text-atria-mist">Por rol</span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <QuickAction href="/dashboard/admin" label="Administrar cierre" helper="Pendientes y solicitudes." icon="admin" />
            <QuickAction href="/dashboard/contador" label="Revisar cifras" helper="Ingresos, gastos y cierre." icon="contador" />
            <QuickAction href="/herederos" label="Propietarios" helper="Participación y resúmenes." icon="participantes" />
            <QuickAction href="/liquidacion" label="Cierre mensual" helper="Distribución por propietario." icon="liquidacion" />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-atria-graphite p-4 shadow-card sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-atria-fog">Actividad reciente</h3>
          <ol className="grid">
            {activity.map((item, index) => (
              <TimelineItem
                key={item.action}
                date={item.date}
                actor={item.actor}
                action={item.action}
                tone={item.tone}
                last={index === activity.length - 1}
              />
            ))}
          </ol>
        </div>
      </section>
    </AppShell>
  );
}
