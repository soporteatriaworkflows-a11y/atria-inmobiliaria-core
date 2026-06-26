import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function ExpensesPage() {
  return (
    <AppShell
      title="Gastos"
      description="Gastos del periodo, separados entre por propiedad y globales. Montos en pesos colombianos."
      icon="gastos"
    >
      <section className="overflow-hidden rounded-xl border border-atria-line/80 bg-white shadow-card">
        <div className="hidden grid-cols-[auto_1fr_auto] gap-3 border-b border-atria-line/70 bg-atria-surface/60 px-4 py-2 text-2xs font-semibold uppercase tracking-wide text-atria-muted sm:grid">
          <span>Monto</span>
          <span>Referencia</span>
          <span className="text-right">Tipo</span>
        </div>
        {demoLiquidationInput.expenses.map((expense) => (
          <article
            className="flex flex-col gap-2 border-b border-atria-line/60 px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-3"
            key={expense.id}
          >
            <span className="text-lg font-semibold text-atria-ink">{formatCop(expense.amountCop)}</span>
            <p className="text-sm text-atria-muted">
              {expense.propertyId ?? "Todos los participantes"}
            </p>
            <span className="sm:text-right">
              <Badge tone={expense.category === "global" ? "warning" : "neutral"}>
                {expense.category === "global" ? "Global" : "Por propiedad"}
              </Badge>
            </span>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
