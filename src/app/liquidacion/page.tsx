import { AppShell } from "@/components/app-shell";
import { MetricCard, SectionPanel, StatusPill } from "@/components/ui";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function LiquidationPage() {
  return (
    <AppShell
      title="Liquidacion mensual"
      description="Resultado inicial con fixture sanitizado y supuestos provisionales documentados."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Recaudos" value={formatCop(demoLiquidation.totalCollectionsCop)} helper="Total demo del mes." tone="success" />
        <MetricCard label="Gastos por propiedad" value={formatCop(demoLiquidation.totalPropertyExpensesCop)} helper="Reparaciones y otros demo." />
        <MetricCard label="Gastos globales" value={formatCop(demoLiquidation.totalGlobalExpensesCop)} helper="Administracion + contador." />
      </section>

      <section className="overflow-hidden rounded-2xl border border-atria-line bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-atria-line bg-atria-cream p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-atria-ink">Resultado por participante</h2>
            <p className="mt-2 text-base text-atria-muted">Valores demo. No usar para pagos reales.</p>
          </div>
          <StatusPill tone="warning">Borrador</StatusPill>
        </div>
        <div className="grid gap-0">
          {demoLiquidation.participants.map((participant) => (
            <article
              className="grid gap-3 border-b border-atria-line p-5 last:border-b-0 md:grid-cols-4"
              key={participant.participantId}
            >
              <strong className="text-xl text-atria-ink">{participant.displayName}</strong>
              <span className="text-atria-muted">Participacion: {formatCop(participant.totalParticipationCop)}</span>
              <span className="text-atria-muted">Saldo acumulado: {formatCop(participant.accumulatedBalanceCop)}</span>
              <span className="font-bold text-atria-forest">Valor a pagar: {formatCop(participant.amountToPayCop)}</span>
            </article>
          ))}
        </div>
      </section>

      <SectionPanel>
        <h2 className="text-2xl font-bold text-atria-ink">Supuestos provisionales</h2>
        <ul className="mt-4 grid gap-3">
          {demoLiquidation.assumptions.map((assumption) => (
            <li className="rounded-xl bg-atria-pearl p-4 text-lg leading-relaxed text-atria-muted" key={assumption}>
              {assumption}
            </li>
          ))}
        </ul>
      </SectionPanel>
    </AppShell>
  );
}
