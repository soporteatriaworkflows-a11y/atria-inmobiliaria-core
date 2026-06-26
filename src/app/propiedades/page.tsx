import { AppShell } from "@/components/app-shell";
import { Badge, EmptyState, SectionPanel } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";

export default function PropertiesPage() {
  return (
    <AppShell
      title="Propiedades"
      description="Inventario de ejemplo sin direcciones reales ni informacion personal."
      icon="propiedades"
    >
      <section className="grid gap-4 md:grid-cols-2">
        {demoLiquidationInput.properties.map((property) => (
          <SectionPanel key={property.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge tone="success">Activa para cierre</Badge>
                <h2 className="mt-4 text-2xl font-bold text-atria-ink">{property.name}</h2>
                <p className="mt-3 text-lg leading-relaxed text-atria-muted">
                  Propiedad demo preparada para liquidacion mensual. La direccion real no se guarda en el repo.
                </p>
              </div>
            </div>
          </SectionPanel>
        ))}
      </section>
      <EmptyState title="Adjuntos reales pendientes" description="Los soportes y documentos privados se conectaran despues, con almacenamiento seguro y revision manual." />
    </AppShell>
  );
}
