import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction } from "@/components/ui";

export default function AdminDashboardPage() {
  return (
    <AppShell
      title="Panel administrador"
      description="Una vista simple para cuidar el cierre mensual, revisar pendientes y mantener trazabilidad."
      icon="admin"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pendientes" value="3" helper="Tareas de ejemplo antes de publicar un cierre." tone="warning" badge="Por revisar" />
        <MetricCard label="Solicitudes" value="3" helper="Cambios que deben quedar registrados." />
        <MetricCard label="Datos" value="De ejemplo" helper="Sin informacion real en esta etapa." tone="success" badge="Protegido" />
      </section>
      <ActionList
        variant="step"
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
