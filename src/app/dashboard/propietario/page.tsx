import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction, SectionPanel, StatusPill } from "@/components/ui";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function OwnerDashboardPage() {
  const firstParticipant = demoLiquidation.participants[0];

  return (
    <AppShell
      title="Mi resumen"
      description="Vista de solo lectura para propietarios y herederos. Aqui no se editan cifras."
      icon="propietario"
    >
      <section className="grid gap-3 md:grid-cols-2">
        <MetricCard
          label="Saldo acumulado"
          value={formatCop(firstParticipant.accumulatedBalanceCop)}
          helper="Calculado con reglas provisionales."
          badge="Ejemplo"
          icon="propietario"
        />
        <MetricCard
          label="Valor a pagar"
          value={formatCop(firstParticipant.amountToPayCop)}
          helper="Pendiente de validacion final."
          tone="success"
          badge="Estimado"
          icon="recaudos"
        />
      </section>

      <SectionPanel className="bg-gradient-to-br from-atria-violet/15 to-atria-graphite">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-atria-fog">Tu informacion esta protegida</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-atria-mist">
              Si algo no coincide, puedes pedir una revision. Las cifras no se
              modifican desde esta vista.
            </p>
          </div>
          <StatusPill tone="success">Solo lectura</StatusPill>
        </div>
      </SectionPanel>

      <section className="grid gap-2.5 md:grid-cols-2">
        <QuickAction href="/liquidacion" label="Ver mi liquidacion" helper="Resumen del periodo." icon="liquidacion" />
        <QuickAction href="/solicitudes" label="Pedir una revision" helper="Solicita un cambio o aclaracion." icon="solicitudes" />
      </section>
    </AppShell>
  );
}
