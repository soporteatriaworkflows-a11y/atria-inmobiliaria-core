import { AppShell } from "@/components/app-shell";
import { demoLiquidationInput } from "@/lib/demo-data";

export default function PropertiesPage() {
  return (
    <AppShell
      title="Propiedades"
      description="Inventario demo sin direcciones reales ni informacion personal."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {demoLiquidationInput.properties.map((property) => (
          <article
            className="rounded-lg border border-atria-line bg-white p-5 shadow-soft"
            key={property.id}
          >
            <h2 className="text-2xl font-bold">{property.name}</h2>
            <p className="mt-3 text-slate-700">
              Estado demo: activa para liquidacion mensual.
            </p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
