import { AppShell } from "@/components/app-shell";
import { Badge, SectionPanel } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function ExpensesPage() {
  return (
    <AppShell
      title="Gastos"
      description="Gastos demo separados entre propiedad y globales. Montos en COP enteros."
    >
      <section className="grid gap-4">
        {demoLiquidationInput.expenses.map((expense) => (
          <SectionPanel key={expense.id}>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
              <div>
                <Badge tone={expense.category === "global" ? "warning" : "neutral"}>
                  {expense.category === "global" ? "Global" : "Por propiedad"}
                </Badge>
                <h2 className="mt-3 text-3xl font-bold text-atria-ink">{formatCop(expense.amountCop)}</h2>
              </div>
              <p className="text-lg leading-relaxed text-atria-muted">Referencia: {expense.propertyId ?? "todos los participantes"}</p>
              <p className="rounded-2xl bg-atria-pearl px-4 py-3 text-base font-bold text-atria-muted">Sin borrado fisico</p>
            </div>
          </SectionPanel>
        ))}
      </section>
    </AppShell>
  );
}
