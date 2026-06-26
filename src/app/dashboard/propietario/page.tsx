import { AppShell } from "@/components/app-shell";
import {
  MetricCard,
  QuickAction,
  SectionPanel,
  StatusPill,
} from "@/components/ui";
import { Donut } from "@/components/viz";
import { demoLiquidation, demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function OwnerDashboardPage() {
  const firstParticipant = demoLiquidation.participants[0];
  const rule = demoLiquidationInput.participationRules.find(
    (r) =>
      r.participantId === firstParticipant.participantId &&
      r.propertyId === null,
  );
  const participacion = rule ? Math.round(rule.basisPoints / 100) : 0;

  return (
    <AppShell
      title="Mi resumen"
      description="Vista de solo lectura para propietarios. Aquí no se editan cifras."
      icon="propietario"
    >
      <section className="grid gap-3 lg:grid-cols-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
          <MetricCard
            label="Saldo acumulado"
            value={formatCop(firstParticipant.accumulatedBalanceCop)}
            helper="Calculado con reglas provisionales."
            badge="Ejemplo"
            icon="propietario"
          />
          <MetricCard
            label="Valor del periodo"
            value={formatCop(firstParticipant.amountToPayCop)}
            helper="Pendiente de validación final."
            tone="success"
            badge="Estimado"
            icon="recaudos"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-br from-atria-indigo/50 to-atria-graphite p-4 shadow-card">
          <h3 className="self-start text-sm font-semibold text-atria-fog">
            Mi participación
          </h3>
          <Donut
            value={participacion}
            center={`${participacion}%`}
            tone="primary"
            caption="del total"
          />
        </div>
      </section>

      <SectionPanel className="bg-gradient-to-br from-atria-violet/15 to-atria-graphite">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-atria-fog">
              Tu información está protegida
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-atria-mist">
              Si algo no coincide, puedes pedir una revisión. Las cifras no se
              modifican desde esta vista.
            </p>
          </div>
          <StatusPill tone="success">Solo lectura</StatusPill>
        </div>
      </SectionPanel>

      <section className="grid gap-2.5 md:grid-cols-2">
        <QuickAction
          href="/liquidacion"
          label="Ver mi cierre"
          helper="Distribución del periodo."
          icon="liquidacion"
        />
        <QuickAction
          href="/solicitudes"
          label="Pedir una revisión"
          helper="Solicita un cambio o aclaración."
          icon="solicitudes"
        />
      </section>
    </AppShell>
  );
}
