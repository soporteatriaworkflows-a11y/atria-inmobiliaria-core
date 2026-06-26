import { AppShell } from "@/components/app-shell";
import { Badge, SectionPanel } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function CollectionsPage() {
  return (
    <AppShell
      title="Recaudos"
      description="Recaudos de ejemplo del mes. Los registros publicados se corrigen con ajustes, nunca se borran."
      icon="recaudos"
    >
      <section className="grid gap-4">
        {demoLiquidationInput.collections.map((collection) => (
          <SectionPanel key={collection.id}>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
              <div>
                <Badge tone="success">Registrado</Badge>
                <h2 className="mt-3 text-3xl font-bold text-atria-ink">{formatCop(collection.amountCop)}</h2>
              </div>
              <p className="text-lg leading-relaxed text-atria-muted">Propiedad de ejemplo: {collection.propertyId}</p>
              <p className="rounded-2xl bg-atria-pearl px-4 py-3 text-base font-bold text-atria-muted">Queda en el historial</p>
            </div>
          </SectionPanel>
        ))}
      </section>
    </AppShell>
  );
}
