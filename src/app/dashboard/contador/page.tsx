import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction } from "@/components/ui";

export default function AccountantDashboardPage() {
  return (
    <AppShell
      title="Panel contador"
      description="Herramientas claras para revisar cifras, soportes pendientes y borradores de liquidacion."
      icon="contador"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Recaudos" value="Listos" helper="Ejemplo preparado para revision mensual." tone="success" badge="Al dia" />
        <MetricCard label="Gastos" value="En revision" helper="Separados entre globales y por propiedad." tone="warning" badge="Revisar" />
        <MetricCard label="Liquidacion" value="Borrador" helper="No publicar sin validacion." />
      </section>
      <ActionList
        variant="step"
        items={[
          "Validar gastos globales configurados del mes.",
          "Revisar ajustes manuales con soporte y auditoria.",
          "Marcar el cierre como listo para revision.",
        ]}
      />
      <section className="grid gap-4 md:grid-cols-3">
        <QuickAction href="/liquidacion" label="Abrir liquidacion" helper="Resultado demo por participante." />
        <QuickAction href="/gastos" label="Revisar gastos" helper="Montos en COP enteros." />
        <QuickAction href="/recaudos" label="Revisar recaudos" helper="Ingresos demo del mes." />
      </section>
    </AppShell>
  );
}
