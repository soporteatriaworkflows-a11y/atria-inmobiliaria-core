import { AppShell } from "@/components/app-shell";
import { SummaryCard } from "@/components/summary-card";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function OwnerDashboardPage() {
  const firstParticipant = demoLiquidation.participants[0];

  return (
    <AppShell
      title="Mi resumen"
      description="Vista solo lectura para propietario o heredero. No permite editar recaudos, gastos ni cierres."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          label="Saldo acumulado demo"
          value={formatCop(firstParticipant.accumulatedBalanceCop)}
          helper="Valor calculado con reglas provisionales."
        />
        <SummaryCard
          label="Valor a pagar demo"
          value={formatCop(firstParticipant.amountToPayCop)}
          helper="Pendiente de validacion con documentos privados fuera del repo."
        />
      </section>
    </AppShell>
  );
}
