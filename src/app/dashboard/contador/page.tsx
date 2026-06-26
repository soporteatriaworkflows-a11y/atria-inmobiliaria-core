import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction } from "@/components/ui";

export default function AccountantDashboardPage() {
  return (
    <AppShell
      title="Panel del contador"
      description="Trabajo del periodo: recaudos, gastos, conciliacion y borradores de liquidacion."
      icon="contador"
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Recaudos" value="Revisados" helper="Ingresos del periodo conciliados." tone="success" badge="Listo" icon="recaudos" />
        <MetricCard label="Gastos" value="En revision" helper="Globales y por propiedad." tone="warning" badge="Revisar" icon="gastos" />
        <MetricCard label="Conciliacion" value="Parcial" helper="Faltan soportes por confirmar." tone="warning" badge="Por conciliar" icon="auditoria" />
        <MetricCard label="Liquidacion" value="Borrador" helper="No publicar sin validacion." badge="Pendiente" icon="liquidacion" />
      </section>

      <div className="rounded-xl border border-atria-line/80 bg-white p-4 shadow-card">
        <h3 className="mb-3 text-sm font-semibold text-atria-ink">Pasos sugeridos</h3>
        <ActionList
          variant="step"
          items={[
            "Validar los gastos globales del periodo.",
            "Revisar ajustes manuales con su soporte.",
            "Marcar el cierre como listo para revision.",
          ]}
        />
      </div>

      <section className="grid gap-2.5 md:grid-cols-3">
        <QuickAction href="/liquidacion" label="Abrir liquidacion" helper="Resultado por participante." icon="liquidacion" />
        <QuickAction href="/gastos" label="Revisar gastos" helper="Montos del periodo." icon="gastos" />
        <QuickAction href="/recaudos" label="Revisar recaudos" helper="Ingresos del periodo." icon="recaudos" />
      </section>
    </AppShell>
  );
}
