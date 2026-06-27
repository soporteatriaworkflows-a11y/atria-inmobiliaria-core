import { AppShell } from "@/components/app-shell";
import { ExpensesCrudPanel } from "@/components/crud/live-crud-panels";
import { Badge, MetricCard, type Tone } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

const propertyName = new Map(
  demoLiquidationInput.properties.map((p) => [p.id, p.name]),
);

// Estado de revisiÃ³n contable (demo): los globales requieren mÃ¡s control.
function reviewState(category: string): { label: string; tone: Tone } {
  return category === "global"
    ? { label: "Por revisar", tone: "warning" }
    : { label: "Registrado", tone: "success" };
}

export default function ExpensesPage() {
  const total = demoLiquidationInput.expenses.reduce(
    (s, e) => s + e.amountCop,
    0,
  );
  const globales = demoLiquidationInput.expenses
    .filter((e) => e.category === "global")
    .reduce((s, e) => s + e.amountCop, 0);
  const porPropiedad = total - globales;

  return (
    <AppShell
      title="Gastos"
      description="Egresos del periodo por categorÃ­a, con su estado de revisiÃ³n contable."
      icon="gastos"
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Total gastos"
          value={formatCop(total)}
          helper="Egresos del periodo."
          tone="warning"
          icon="gastos"
        />
        <MetricCard
          label="Por propiedad"
          value={formatCop(porPropiedad)}
          helper="Reparaciones y mantenimiento."
          tone="primary"
          icon="propiedades"
        />
        <MetricCard
          label="Globales"
          value={formatCop(globales)}
          helper="AdministraciÃ³n y contador."
          tone="neutral"
          icon="admin"
        />
      </section>

      <section className="atria-panel overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_auto_auto_auto] gap-3 border-b border-atria-edge bg-atria-elevated px-4 py-2 text-2xs font-semibold uppercase tracking-wide text-atria-mist sm:grid">
          <span>Referencia</span>
          <span>CategorÃ­a</span>
          <span>Monto</span>
          <span className="text-right">RevisiÃ³n</span>
        </div>
        {demoLiquidationInput.expenses.map((expense) => {
          const state = reviewState(expense.category);
          return (
            <article
              className="flex flex-col gap-2 border-b border-atria-edge px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[1.4fr_auto_auto_auto] sm:items-center sm:gap-3"
              key={expense.id}
            >
              <p className="text-sm font-semibold text-atria-fog">
                {expense.propertyId
                  ? propertyName.get(expense.propertyId)
                  : "AdministraciÃ³n general"}
              </p>
              <span className="sm:justify-self-start">
                <Badge
                  tone={expense.category === "global" ? "primary" : "neutral"}
                >
                  {expense.category === "global" ? "Global" : "Por propiedad"}
                </Badge>
              </span>
              <span className="text-base font-semibold text-atria-fog">
                {formatCop(expense.amountCop)}
              </span>
              <span className="sm:text-right">
                <Badge tone={state.tone}>{state.label}</Badge>
              </span>
            </article>
          );
        })}
      </section>
      <ExpensesCrudPanel />
    </AppShell>
  );
}
