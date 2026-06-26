import { AppShell } from "@/components/app-shell";
import { SupabaseLiveStatus } from "@/components/supabase-live-status";
import { MetricCard, QuickAction, StatusPill } from "@/components/ui";
import { isLiveMode } from "@/lib/app-config";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function HomePage() {
  const title = isLiveMode ? "Resumen general" : "Resumen general";
  const description = isLiveMode
    ? "Vista operativa de ATRIA con datos de prueba. Sin informacion real hasta activar el ingreso y los permisos."
    : "Vista operativa con datos de prueba. Sin conexion a produccion ni informacion real.";

  return (
    <AppShell title={title} description={description} icon="home">
      <SupabaseLiveStatus />

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Recaudos del mes"
          value={formatCop(demoLiquidation.totalCollectionsCop)}
          helper="Total de ejemplo del periodo."
          tone="success"
          icon="recaudos"
        />
        <MetricCard
          label="Gastos globales"
          value={formatCop(demoLiquidation.totalGlobalExpensesCop)}
          helper="Administracion y contador del periodo."
          icon="gastos"
        />
        <MetricCard
          label="Participantes"
          value="3"
          helper="Propietarios y herederos registrados."
          icon="participantes"
        />
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-atria-graphite p-4 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-atria-fog">Accesos rapidos</h3>
            <span className="text-2xs font-medium uppercase tracking-wide text-atria-mist">
              Por rol
            </span>
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <QuickAction
              href="/dashboard/admin"
              label="Administrar cierre"
              helper="Pendientes, solicitudes y accesos."
              icon="admin"
            />
            <QuickAction
              href="/dashboard/contador"
              label="Revisar cifras"
              helper="Recaudos, gastos y liquidacion."
              icon="contador"
            />
            <QuickAction
              href="/dashboard/propietario"
              label="Vista de propietario"
              helper="Experiencia de solo lectura."
              icon="propietario"
            />
            <QuickAction
              href="/liquidacion"
              label="Ver liquidacion"
              helper="Resultado del periodo por participante."
              icon="liquidacion"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-atria-violet/15 to-atria-graphite p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-atria-fog">Proximo paso</h3>
            <StatusPill tone="warning">Pendiente</StatusPill>
          </div>
          <p className="text-sm leading-relaxed text-atria-mist">
            Antes de cargar informacion real, ATRIA habilitara el ingreso, los
            permisos por rol y el registro de cada cambio.
          </p>
          <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold text-atria-fog">Informacion protegida</p>
            <p className="mt-0.5 text-xs leading-relaxed text-atria-mist">
              Conectado y operativo, sin datos financieros o personales reales.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
