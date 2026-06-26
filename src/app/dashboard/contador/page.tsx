import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction } from "@/components/ui";

export default function AccountantDashboardPage() {
  return (
    <AppShell
      title="Panel del contador"
      description="Trabajo del periodo: ingresos, gastos, conciliación y cierre."
      icon="contador"
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ingresos"
          value="Revisados"
          helper="Pagos del periodo conciliados."
          tone="success"
          badge="Listo"
          icon="recaudos"
        />
        <MetricCard
          label="Gastos"
          value="En revisión"
          helper="Globales y por propiedad."
          tone="warning"
          badge="Revisar"
          icon="gastos"
        />
        <MetricCard
          label="Conciliación"
          value="Parcial"
          helper="Faltan soportes por confirmar."
          tone="warning"
          badge="Por conciliar"
          icon="auditoria"
        />
        <MetricCard
          label="Cierre"
          value="Borrador"
          helper="No publicar sin validación."
          tone="primary"
          badge="Pendiente"
          icon="liquidacion"
        />
      </section>

      <div className="rounded-xl border border-white/10 bg-atria-graphite p-4 shadow-card">
        <h3 className="mb-3 text-sm font-semibold text-atria-fog">
          Pasos sugeridos
        </h3>
        <ActionList
          variant="step"
          items={[
            "Validar los gastos globales del periodo.",
            "Revisar ajustes manuales con su soporte.",
            "Marcar el cierre como listo para revisión.",
          ]}
        />
      </div>

      <section className="grid gap-2.5 md:grid-cols-3">
        <QuickAction
          href="/liquidacion"
          label="Abrir cierre"
          helper="Distribución por propietario."
          icon="liquidacion"
        />
        <QuickAction
          href="/gastos"
          label="Revisar gastos"
          helper="Montos del periodo."
          icon="gastos"
        />
        <QuickAction
          href="/recaudos"
          label="Revisar ingresos"
          helper="Pagos del periodo."
          icon="recaudos"
        />
      </section>
    </AppShell>
  );
}
