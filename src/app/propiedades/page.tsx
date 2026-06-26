import { AppShell } from "@/components/app-shell";
import { ModuleIcon } from "@/components/icons";
import { Badge, EmptyState } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";

export default function PropertiesPage() {
  return (
    <AppShell
      title="Propiedades"
      description="Inventario de ejemplo, sin direcciones reales ni informacion personal."
      icon="propiedades"
    >
      <section className="grid gap-3 md:grid-cols-2">
        {demoLiquidationInput.properties.map((property) => (
          <article
            className="flex items-start gap-3 rounded-xl border border-atria-line/80 bg-white p-4 shadow-card transition hover:shadow-panel"
            key={property.id}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-atria-mint/60 text-atria-forest">
              <ModuleIcon className="h-5 w-5" name="propiedades" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-atria-ink">{property.name}</h2>
                <Badge tone="success">Activa</Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-atria-muted">
                Preparada para la liquidacion del periodo. La direccion real no se guarda aqui.
              </p>
            </div>
          </article>
        ))}
      </section>

      <EmptyState
        title="Documentos pendientes"
        description="Los soportes y documentos se conectaran despues, con almacenamiento seguro y revision."
      />
    </AppShell>
  );
}
