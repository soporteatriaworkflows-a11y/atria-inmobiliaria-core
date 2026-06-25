import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SummaryCard } from "@/components/summary-card";
import { SupabaseLiveStatus } from "@/components/supabase-live-status";
import { isLiveMode } from "@/lib/app-config";
import { demoLiquidation } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

export default function HomePage() {
  const title = isLiveMode
    ? "Produccion conectada"
    : "Fundacion tecnica demo";
  const description = isLiveMode
    ? "Base funcional conectada a Supabase. Aun no se cargan datos reales financieros ni personales."
    : "Base segura para revisar avance visual con datos sanitizados. No hay conexion a produccion ni datos reales.";
  const nextAction = isLiveMode
    ? "Siguiente paso: habilitar Auth y flujos de lectura/escritura por rol antes de cargar cualquier dato real."
    : "Conectar manualmente Supabase DEV y Vercel Preview cuando lint, tests y build pasen. Las claves reales van en `.env.local` o variables de Vercel, nunca en Git.";

  return (
    <AppShell title={title} description={description}>
      <SupabaseLiveStatus />
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Recaudos demo"
          value={formatCop(demoLiquidation.totalCollectionsCop)}
          helper="Valores enteros COP. Datos sanitizados."
        />
        <SummaryCard
          label="Gastos globales"
          value={formatCop(demoLiquidation.totalGlobalExpensesCop)}
          helper="Incluye administracion y contador demo."
        />
        <SummaryCard
          label="Participantes"
          value="3 demo"
          helper="Separados de usuarios autenticados."
        />
      </section>
      <section className="rounded-lg border border-atria-line bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold">Siguiente accion segura</h2>
        <p className="mt-3 text-xl leading-relaxed text-slate-700">
          {nextAction}
        </p>
        <Link
          className="focus-ring mt-5 inline-flex rounded-md bg-atria-forest px-6 py-4 text-lg font-bold text-white hover:bg-atria-ink"
          href="/liquidacion"
        >
          Ver liquidacion demo
        </Link>
      </section>
    </AppShell>
  );
}
