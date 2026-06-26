import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function CollectionsPage() {
  return (
    <AppShell
      title="Recaudos"
      description="Ingresos del periodo. Los registros se corrigen con ajustes, nunca se borran."
      icon="recaudos"
    >
      <section className="overflow-hidden rounded-xl border border-atria-line/80 bg-white shadow-card">
        <div className="hidden grid-cols-[auto_1fr_auto] gap-3 border-b border-atria-line/70 bg-atria-surface/60 px-4 py-2 text-2xs font-semibold uppercase tracking-wide text-atria-muted sm:grid">
          <span>Monto</span>
          <span>Propiedad</span>
          <span className="text-right">Estado</span>
        </div>
        {demoLiquidationInput.collections.map((collection) => (
          <article
            className="flex flex-col gap-2 border-b border-atria-line/60 px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-3"
            key={collection.id}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-semibold text-atria-ink">{formatCop(collection.amountCop)}</span>
              <Badge tone="success">Registrado</Badge>
            </div>
            <p className="text-sm text-atria-muted">Propiedad: {collection.propertyId}</p>
            <span className="text-2xs font-medium uppercase tracking-wide text-atria-muted sm:text-right">
              Queda en el historial
            </span>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
