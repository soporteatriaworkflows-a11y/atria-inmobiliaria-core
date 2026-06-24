import { AppShell } from "@/components/app-shell";
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
          <article
            className="rounded-lg border border-atria-line bg-white p-5 shadow-soft"
            key={collection.id}
          >
            <h2 className="text-2xl font-bold">
              {formatCop(collection.amountCop)}
            </h2>
            <p className="mt-2 text-slate-700">
              Propiedad: {collection.propertyId}
            </p>
            <p className="mt-1 text-slate-700">Estado: publicado demo</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
