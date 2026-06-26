import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction, SectionPanel, StatusPill } from "@/components/ui";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function OwnerDashboardPage() {
  const firstParticipant = demoLiquidation.participants[0];

  return (
    <AppShell
      title="Mi resumen"
      description="Vista de lectura para propietario o heredero. Aqui no se editan recaudos, gastos ni cierres."
      icon="propietario"
    >
      <section className="grid gap-4 md:grid-cols-2">
        <MetricCard
          label="Saldo acumulado"
          value={formatCop(firstParticipant.accumulatedBalanceCop)}
          helper="Valor calculado con reglas provisionales."
          badge="Ejemplo"
        />
        <MetricCard
          label="Valor a pagar"
          value={formatCop(firstParticipant.amountToPayCop)}
          helper="Pendiente de validacion con documentos privados fuera del repo."
          tone="success"
          badge="Estimado"
        />
      </section>
      <SectionPanel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-atria-ink">Solo lectura</h2>
            <p className="mt-3 text-lg leading-relaxed text-atria-muted">
              Si algo no coincide, el camino correcto es crear una solicitud. No se modifican cifras directamente desde esta vista.
            </p>
          </div>
          <StatusPill tone="success">Protegido</StatusPill>
        </div>
      </SectionPanel>
      <section className="grid gap-4 md:grid-cols-2">
        <QuickAction href="/liquidacion" label="Ver liquidacion" helper="Consultar el resumen demo del mes." />
        <QuickAction href="/solicitudes" label="Pedir revision" helper="Preparado para cambios trazables." />
      </section>
    </AppShell>
  );
}
