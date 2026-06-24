import { AppShell } from "@/components/app-shell";
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
          <article
            className="rounded-lg border border-atria-line bg-white p-5 shadow-soft"
            key={expense.id}
          >
            <h2 className="text-2xl font-bold">
              {formatCop(expense.amountCop)}
            </h2>
            <p className="mt-2 text-slate-700">
              Tipo: {expense.category === "global" ? "global" : "por propiedad"}
            </p>
            <p className="mt-1 text-slate-700">
              Referencia: {expense.propertyId ?? "todos los participantes"}
            </p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
