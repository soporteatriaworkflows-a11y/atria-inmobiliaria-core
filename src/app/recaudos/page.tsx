import { AppShell } from "@/components/app-shell";
import { Badge, SectionPanel } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function CollectionsPage() {
  return (
    <AppShell
      title="Recaudos"
      description="Recaudos demo del mes. Los registros publicados deben corregirse con ajustes, no borrarse."
    >
      <section className="grid gap-4">
        {demoLiquidationInput.collections.map((collection) => (
          <SectionPanel key={collection.id}>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
              <div>
                <Badge tone="success">Publicado demo</Badge>
                <h2 className="mt-3 text-3xl font-bold text-atria-ink">{formatCop(collection.amountCop)}</h2>
              </div>
              <p className="text-lg leading-relaxed text-atria-muted">Propiedad demo: {collection.propertyId}</p>
              <p className="rounded-2xl bg-atria-pearl px-4 py-3 text-base font-bold text-atria-muted">Append-only</p>
            </div>
          </SectionPanel>
        ))}
      </section>
    </AppShell>
  );
}
