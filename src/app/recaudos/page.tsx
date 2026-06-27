import { AppShell } from "@/components/app-shell";
import { CollectionsCrudPanel } from "@/components/crud/live-crud-panels";
import { Badge, MetricCard } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

const propertyName = new Map(
  demoLiquidationInput.properties.map((p) => [p.id, p.name]),
);

export default function CollectionsPage() {
  const total = demoLiquidationInput.collections.reduce(
    (sum, c) => sum + c.amountCop,
    0,
  );
  const pagadas = demoLiquidationInput.collections.length;
  const totalProps = demoLiquidationInput.properties.length;

  return (
    <AppShell
      title="Ingresos"
      description="Estado de pago por propiedad. Los registros se corrigen con ajustes, nunca se borran."
      icon="recaudos"
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Total cobrado"
          value={formatCop(total)}
          helper="Ingresos del periodo."
          tone="success"
          icon="recaudos"
        />
        <MetricCard
          label="Propiedades al dÃ­a"
          value={`${pagadas}/${totalProps}`}
          helper="Con pago registrado."
          tone="primary"
          icon="propiedades"
        />
        <MetricCard
          label="Pendientes"
          value="0"
          helper="Sin pagos por confirmar."
          tone="neutral"
          icon="auditoria"
        />
      </section>

      <section className="atria-panel overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_auto] gap-3 border-b border-atria-edge bg-atria-elevated px-4 py-2 text-2xs font-semibold uppercase tracking-wide text-atria-mist sm:grid">
          <span>Propiedad</span>
          <span>Monto</span>
          <span className="text-right">Estado de pago</span>
        </div>
        {demoLiquidationInput.collections.map((collection) => (
          <article
            className="flex flex-col gap-2 border-b border-atria-edge px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:gap-3"
            key={collection.id}
          >
            <p className="text-sm font-semibold text-atria-fog">
              {propertyName.get(collection.propertyId) ?? collection.propertyId}
            </p>
            <span className="text-base font-semibold text-atria-fog">
              {formatCop(collection.amountCop)}
            </span>
            <span className="sm:text-right">
              <Badge tone="success">Pagado</Badge>
            </span>
          </article>
        ))}
      </section>
      <CollectionsCrudPanel />
    </AppShell>
  );
}
