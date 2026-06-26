import { AppShell } from "@/components/app-shell";
import { Badge, MetricCard, type Tone } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

const propertyName = new Map(
  demoLiquidationInput.properties.map((p) => [p.id, p.name]),
);

// Estado de revisión contable (demo): los globales requieren más control.
function reviewState(category: string): { label: string; tone: Tone } {
  return category === "global"
    ? { label: "Por revisar", tone: "warning" }
    : { label: "Registrado", tone: "success" };
}

export default function ExpensesPage() {
  const total = demoLiquidationInput.expenses.reduce((s, e) => s + e.amountCop, 0);
  const globales = demoLiquidationInput.expenses
    .filter((e) => e.category === "global")
    .reduce((s, e) => s + e.amountCop, 0);
  const porPropiedad = total - globales;

  return (
    <AppShell
      title="Gastos"
      description="Egresos del periodo por categoría, con su estado de revisión contable."
      icon="gastos"
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Total gastos" value={formatCop(total)} helper="Egresos del periodo." tone="warning" icon="gastos" />
        <MetricCard label="Por propiedad" value={formatCop(porPropiedad)} helper="Reparaciones y mantenimiento." tone="primary" icon="propiedades" />
        <MetricCard label="Globales" value={formatCop(globales)} helper="Administración y contador." tone="neutral" icon="admin" />
      </section>

      <section className="overflow-hidden rounded-xl border border-white/10 bg-atria-graphite shadow-card">
        <div className="hidden grid-cols-[1.4fr_auto_auto_auto] gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2 text-2xs font-semibold uppercase tracking-wide text-atria-mist sm:grid">
          <span>Referencia</span>
          <span>Categoría</span>
          <span>Monto</span>
          <span className="text-right">Revisión</span>
        </div>
        {demoLiquidationInput.expenses.map((expense) => {
          const state = reviewState(expense.category);
          return (
            <article
              className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[1.4fr_auto_auto_auto] sm:items-center sm:gap-3"
              key={expense.id}
            >
              <p className="text-sm font-semibold text-atria-fog">
                {expense.propertyId ? propertyName.get(expense.propertyId) : "Administración general"}
              </p>
              <span className="sm:justify-self-start">
                <Badge tone={expense.category === "global" ? "primary" : "neutral"}>
                  {expense.category === "global" ? "Global" : "Por propiedad"}
                </Badge>
              </span>
              <span className="text-base font-semibold text-atria-fog">{formatCop(expense.amountCop)}</span>
              <span className="sm:text-right">
                <Badge tone={state.tone}>{state.label}</Badge>
              </span>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
