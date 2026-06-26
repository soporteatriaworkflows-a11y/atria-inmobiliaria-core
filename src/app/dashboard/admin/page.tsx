import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { MetricCard, QuickAction } from "@/components/ui";

export default function AdminDashboardPage() {
  return (
    <AppShell
      title="Panel del administrador"
      description="Centro de control del cierre mensual: pendientes, solicitudes y trazabilidad."
      icon="admin"
    >
      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Pendientes" value="3" helper="Tareas antes de publicar el cierre." tone="warning" badge="Por revisar" icon="auditoria" />
        <MetricCard label="Solicitudes" value="3" helper="Cambios que quedan registrados." icon="solicitudes" />
        <MetricCard label="Estado de datos" value="De prueba" helper="Sin informacion real en esta etapa." tone="success" badge="Protegido" icon="propietario" />
      </section>

      <div className="rounded-xl border border-white/10 bg-atria-graphite p-4 shadow-card">
        <h3 className="mb-3 text-sm font-semibold text-atria-fog">Pasos para el cierre</h3>
        <ActionList
          variant="step"
          items={[
            "Revisar recaudos y gastos pendientes antes del cierre.",
            "Enviar solicitudes de cambio cuando haya novedades de participantes.",
            "Publicar cierres solo despues de la revision contable.",
          ]}
        />
      </div>

      <section className="grid gap-2.5 md:grid-cols-3">
        <QuickAction href="/recaudos" label="Ver recaudos" helper="Entradas del periodo." icon="recaudos" />
        <QuickAction href="/gastos" label="Ver gastos" helper="Globales y por propiedad." icon="gastos" />
        <QuickAction href="/auditoria" label="Ver auditoria" helper="Historial de cambios." icon="auditoria" />
      </section>
    </AppShell>
  );
}
