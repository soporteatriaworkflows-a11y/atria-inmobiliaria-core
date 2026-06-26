import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction } from "@/components/ui";

export default function AdminDashboardPage() {
  return (
    <AppShell
      title="Panel administrador"
      description="Una vista simple para cuidar el cierre mensual, revisar pendientes y mantener trazabilidad."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pendientes" value="3" helper="Tareas demo antes de publicar un cierre." tone="warning" />
        <MetricCard label="Solicitudes" value="3 demo" helper="Cambios que deben quedar trazados." />
        <MetricCard label="Modo datos" value="Sanitizado" helper="Sin informacion real en esta etapa." tone="success" />
      </section>
      <ActionList
        items={[
          "Revisar recaudos y gastos pendientes antes del cierre.",
          "Enviar solicitudes de cambio cuando haya novedades de participantes.",
          "Publicar cierres solo despues de revision contable.",
        ]}
      />
      <section className="grid gap-4 md:grid-cols-3">
        <QuickAction href="/recaudos" label="Ver recaudos" helper="Entradas demo del mes." />
        <QuickAction href="/gastos" label="Ver gastos" helper="Globales y por propiedad." />
        <QuickAction href="/auditoria" label="Ver auditoria" helper="Historial append-only preparado." />
      </section>
    </AppShell>
  );
}
