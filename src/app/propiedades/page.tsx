import { AppShell } from "@/components/app-shell";
import { Badge, EmptyState, MetricCard } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

const incomeByProperty = new Map<string, number>();
for (const c of demoLiquidationInput.collections) {
  incomeByProperty.set(
    c.propertyId,
    (incomeByProperty.get(c.propertyId) ?? 0) + c.amountCop,
  );
}

export default function PropertiesPage() {
  const total = demoLiquidationInput.properties.length;

  return (
    <AppShell
      title="Propiedades"
      description="Inventario en administración, sin direcciones reales ni información personal."
      icon="propiedades"
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Propiedades activas"
          value={String(total)}
          helper="En administración este periodo."
          tone="primary"
          icon="propiedades"
        />
        <MetricCard
          label="Con ingreso"
          value={String(incomeByProperty.size)}
          helper="Pago del periodo registrado."
          tone="success"
          icon="recaudos"
        />
        <MetricCard
          label="Documentos"
          value="Pendiente"
          helper="Soportes por conectar."
          tone="neutral"
          badge="Próximo"
          icon="auditoria"
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {demoLiquidationInput.properties.map((property) => (
          <article
            className="atria-panel atria-panel-accent flex items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:border-atria-violet/35 hover:shadow-panel"
            key={property.id}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-atria-fog">
                  {property.name}
                </h2>
                <Badge tone="success">Activa</Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-atria-mist">
                En administración para el cierre del periodo. La dirección real
                no se guarda aquí.
              </p>
              <div className="mt-3 flex items-center justify-between rounded-lg border border-atria-edge bg-atria-elevated/65 px-3 py-2">
                <span className="text-2xs uppercase tracking-wide text-atria-mist">
                  Ingreso del periodo
                </span>
                <span className="text-sm font-semibold text-atria-fog">
                  {formatCop(incomeByProperty.get(property.id) ?? 0)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <EmptyState
        title="Documentos pendientes"
        description="Los soportes y documentos se conectarán después, con almacenamiento seguro y revisión."
      />
    </AppShell>
  );
}
