import { AppShell } from "@/components/app-shell";
import { MetricCard, SectionPanel, StatusPill } from "@/components/ui";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function LiquidationPage() {
  return (
    <AppShell
      title="Liquidacion mensual"
      description="Resultado del periodo con datos de prueba y supuestos provisionales."
      icon="liquidacion"
    >
      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Recaudos" value={formatCop(demoLiquidation.totalCollectionsCop)} helper="Total del periodo." tone="success" icon="recaudos" />
        <MetricCard label="Gastos por propiedad" value={formatCop(demoLiquidation.totalPropertyExpensesCop)} helper="Reparaciones y otros." icon="propiedades" />
        <MetricCard label="Gastos globales" value={formatCop(demoLiquidation.totalGlobalExpensesCop)} helper="Administracion y contador." icon="gastos" />
      </section>

      <section className="overflow-hidden rounded-xl border border-white/10 bg-atria-graphite shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-atria-fog">Resultado por participante</h2>
            <p className="mt-0.5 text-xs text-atria-mist">Valores de ejemplo. No usar para pagos.</p>
          </div>
          <StatusPill tone="warning">Borrador</StatusPill>
        </div>

        <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2 text-2xs font-semibold uppercase tracking-wide text-atria-mist md:grid">
          <span>Participante</span>
          <span>Participacion</span>
          <span>Saldo acumulado</span>
          <span className="text-right">Valor a pagar</span>
        </div>

        <div>
          {demoLiquidation.participants.map((participant) => (
            <article
              className="grid gap-1.5 border-b border-white/10 px-4 py-3 last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-center md:gap-3"
              key={participant.participantId}
            >
              <strong className="text-sm font-semibold text-atria-fog">{participant.displayName}</strong>
              <span className="text-xs text-atria-mist md:text-sm">
                <span className="text-atria-mist md:hidden">Participacion: </span>
                {formatCop(participant.totalParticipationCop)}
              </span>
              <span className="text-xs text-atria-mist md:text-sm">
                <span className="md:hidden">Saldo: </span>
                {formatCop(participant.accumulatedBalanceCop)}
              </span>
              <span className="text-sm font-semibold text-atria-lavender md:text-right">
                <span className="font-normal text-atria-mist md:hidden">Valor a pagar: </span>
                {formatCop(participant.amountToPayCop)}
              </span>
            </article>
          ))}
        </div>
      </section>

      <SectionPanel>
        <h2 className="text-sm font-semibold text-atria-fog">Supuestos provisionales</h2>
        <ul className="mt-3 grid gap-2">
          {demoLiquidation.assumptions.map((assumption) => (
            <li className="rounded-lg bg-atria-elevated px-3.5 py-2.5 text-xs leading-relaxed text-atria-mist" key={assumption}>
              {assumption}
            </li>
          ))}
        </ul>
      </SectionPanel>
    </AppShell>
  );
}
