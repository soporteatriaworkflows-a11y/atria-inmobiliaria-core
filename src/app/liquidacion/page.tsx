import { AppShell } from "@/components/app-shell";
import { SummaryCard } from "@/components/summary-card";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function LiquidationPage() {
  return (
    <AppShell
      title="Liquidacion mensual"
      description="Calculo inicial con fixture sanitizado y supuestos provisionales documentados."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Recaudos"
          value={formatCop(demoLiquidation.totalCollectionsCop)}
          helper="Total demo del mes."
        />
        <SummaryCard
          label="Gastos por propiedad"
          value={formatCop(demoLiquidation.totalPropertyExpensesCop)}
          helper="Reparaciones y otros demo."
        />
        <SummaryCard
          label="Gastos globales"
          value={formatCop(demoLiquidation.totalGlobalExpensesCop)}
          helper="Administracion + contador."
        />
      </section>
      <section className="overflow-hidden rounded-lg border border-atria-line bg-white shadow-soft">
        <div className="border-b border-atria-line p-5">
          <h2 className="text-2xl font-bold">Resultado por participante</h2>
        </div>
        <div className="grid gap-0">
          {demoLiquidation.participants.map((participant) => (
            <article
              className="grid gap-3 border-b border-atria-line p-5 md:grid-cols-4"
              key={participant.participantId}
            >
              <strong className="text-xl">{participant.displayName}</strong>
              <span>
                Participacion: {formatCop(participant.totalParticipationCop)}
              </span>
              <span>
                Saldo acumulado: {formatCop(participant.accumulatedBalanceCop)}
              </span>
              <span>
                Valor a pagar: {formatCop(participant.amountToPayCop)}
              </span>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-atria-line bg-white p-5 shadow-soft">
        <h2 className="text-2xl font-bold">Supuestos provisionales</h2>
        <ul className="mt-4 grid gap-2">
          {demoLiquidation.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
