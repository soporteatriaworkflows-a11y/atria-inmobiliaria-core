import { AppShell } from "@/components/app-shell";
import { EmptyState, QuickAction, StatusPill, type Tone } from "@/components/ui";

const requests: { title: string; meta: string; state: string; tone: Tone }[] = [
  { title: "Actualizar participacion desde el proximo periodo", meta: "Propietario · hoy", state: "En revision", tone: "warning" },
  { title: "Revisar el soporte de un gasto", meta: "Contador · ayer", state: "Recibida", tone: "neutral" },
  { title: "Cambiar acceso de lectura a una propiedad", meta: "Administrador · esta semana", state: "Aprobada", tone: "success" },
];

export default function RequestsPage() {
  return (
    <AppShell
      title="Solicitudes"
      description="Los cambios de propietarios, herederos o permisos entran por una solicitud que queda registrada."
      icon="solicitudes"
    >
      <section className="overflow-hidden rounded-xl border border-white/10 bg-atria-graphite shadow-card">
        {requests.map((request) => (
          <article
            className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 last:border-b-0"
            key={request.title}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-atria-fog">{request.title}</p>
              <p className="mt-0.5 text-2xs uppercase tracking-wide text-atria-mist">{request.meta}</p>
            </div>
            <StatusPill tone={request.tone}>{request.state}</StatusPill>
          </article>
        ))}
      </section>

      <EmptyState
        title="Flujo completo pendiente"
        description="Al activar el ingreso, cada solicitud tendra responsable, estado, comentarios e historial."
        action={<QuickAction href="/auditoria" label="Ver auditoria" helper="Revisar el historial de cambios." icon="auditoria" />}
      />
    </AppShell>
  );
}
