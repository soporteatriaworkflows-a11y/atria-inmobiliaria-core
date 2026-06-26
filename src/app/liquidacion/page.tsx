import { AppShell } from "@/components/app-shell";
import { MetricCard, SectionPanel, StatusPill } from "@/components/ui";
import { ProgressBar } from "@/components/viz";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function LiquidationPage() {
  const ingresos = demoLiquidation.totalCollectionsCop;
  const gastos =
    demoLiquidation.totalPropertyExpensesCop + demoLiquidation.totalGlobalExpensesCop;
  const saldo = ingresos - gastos;
  const maxPay = Math.max(
    1,
    ...demoLiquidation.participants.map((p) => p.amountToPayCop),
  );

  return (
    <AppShell
      title="Cierre mensual"
      description="Distribución del periodo con datos de prueba. Es el corazón financiero de la administración."
      icon="liquidacion"
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Ingresos" value={formatCop(ingresos)} helper="Total del periodo." tone="success" icon="recaudos" />
        <MetricCard label="Gastos" value={formatCop(gastos)} helper="Por propiedad y globales." tone="warning" icon="gastos" />
        <MetricCard label="Saldo a distribuir" value={formatCop(saldo)} helper="Ingresos menos gastos." tone="primary" icon="liquidacion" />
        <MetricCard label="Estado" value="Borrador" helper="Pendiente de revisión." tone="warning" badge="En proceso" icon="auditoria" />
      </section>

      <section className="overflow-hidden rounded-xl border border-white/10 bg-atria-graphite shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-atria-fog">Distribución por propietario</h2>
            <p className="mt-0.5 text-xs text-atria-mist">Valores de ejemplo. No usar para pagos.</p>
          </div>
          <StatusPill tone="warning">Borrador</StatusPill>
        </div>

        <div>
          {demoLiquidation.participants.map((participant) => (
            <article
              className="grid gap-2 border-b border-white/10 px-4 py-3.5 last:border-b-0 sm:grid-cols-[1.2fr_2fr] sm:items-center sm:gap-4"
              key={participant.participantId}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-atria-fog">{participant.displayName}</p>
                <p className="text-2xs uppercase tracking-wide text-atria-mist">
                  Saldo acumulado {formatCop(participant.accumulatedBalanceCop)}
                </p>
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-2xs font-medium uppercase tracking-wide text-atria-mist">Valor a pagar</span>
                  <span className="text-sm font-semibold text-atria-lavender">{formatCop(participant.amountToPayCop)}</span>
                </div>
                <ProgressBar value={participant.amountToPayCop} max={maxPay} tone="primary" />
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-atria-mist">Revisa la distribución antes de preparar el cierre.</p>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-atria-mist">
              Revisar distribución
            </span>
            <span className="inline-flex items-center rounded-lg bg-atria-violet px-3.5 py-2 text-sm font-semibold text-white shadow-glow">
              Preparar cierre
            </span>
          </div>
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
