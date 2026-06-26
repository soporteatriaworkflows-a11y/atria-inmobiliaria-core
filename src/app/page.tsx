import { AppShell } from "@/components/app-shell";
import { SupabaseLiveStatus } from "@/components/supabase-live-status";
import { MetricCard, ModuleHeader, QuickAction, SectionPanel, StatusPill } from "@/components/ui";
import { isLiveMode } from "@/lib/app-config";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function HomePage() {
  const title = isLiveMode
    ? "Produccion conectada"
    : "Fundacion tecnica demo";
  const description = isLiveMode
    ? "ATRIA ya tiene una base funcional conectada a Supabase. Seguimos sin cargar datos reales hasta completar Auth, permisos y operacion segura."
    : "Base segura para revisar avance visual con datos sanitizados. No hay conexion a produccion ni datos reales.";

  return (
    <AppShell title={title} description={description}>
      <SupabaseLiveStatus />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Recaudos del mes"
          value={formatCop(demoLiquidation.totalCollectionsCop)}
          helper="Montos demo en COP enteros. Sin informacion real."
          tone="success"
        />
        <MetricCard
          label="Gastos globales"
          value={formatCop(demoLiquidation.totalGlobalExpensesCop)}
          helper="Administracion y contador del ejercicio sanitizado."
        />
        <MetricCard
          label="Participantes"
          value="3 demo"
          helper="Personas demo separadas de usuarios autenticados."
        />
      </section>

      <ModuleHeader
        eyebrow="Siguiente paso"
        title="Preparar la operacion real sin exponer datos"
        description="Antes de cargar informacion privada, ATRIA necesita Auth, permisos por rol, auditoria visible y un proceso claro de revision."
        action={<StatusPill tone="warning">Pendiente de seguridad</StatusPill>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <QuickAction
          href="/dashboard/admin"
          label="Administrar cierre"
          helper="Ver pendientes, solicitudes y accesos del mes."
        />
        <QuickAction
          href="/dashboard/contador"
          label="Revisar cifras"
          helper="Entrar a recaudos, gastos y liquidacion demo."
        />
        <QuickAction
          href="/dashboard/propietario"
          label="Vista de heredero"
          helper="Comprobar la experiencia solo lectura."
        />
      </section>

      <SectionPanel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-bold text-atria-ink">Regla de cuidado</p>
            <p className="mt-2 text-lg leading-relaxed text-atria-muted">
              Esta produccion tecnica esta conectada, pero permanece sin datos financieros o personales reales.
            </p>
          </div>
          <StatusPill tone="success">Seguro para revision</StatusPill>
        </div>
      </SectionPanel>
    </AppShell>
  );
}
