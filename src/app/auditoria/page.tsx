import { AppShell } from "@/components/app-shell";
import { Badge, StatusPill, type Tone } from "@/components/ui";
import { type VizTone } from "@/components/viz";

const events: {
  date: string;
  actor: string;
  action: string;
  type: string;
  tone: VizTone;
  state: string;
  stateTone: Tone;
}[] = [
  {
    date: "03 jun · 16:20",
    actor: "Administrador",
    action: "envió el cierre a revisión.",
    type: "Cierre",
    tone: "primary",
    state: "Enviado",
    stateTone: "primary",
  },
  {
    date: "02 jun · 11:05",
    actor: "Contador",
    action: "revisó los gastos globales.",
    type: "Gasto",
    tone: "warning",
    state: "Revisado",
    stateTone: "warning",
  },
  {
    date: "02 jun · 09:30",
    actor: "Sistema",
    action: "registró 2 ingresos de propiedades.",
    type: "Ingreso",
    tone: "success",
    state: "Registrado",
    stateTone: "success",
  },
  {
    date: "01 jun · 08:00",
    actor: "Administrador",
    action: "creó el borrador del cierre.",
    type: "Cierre",
    tone: "neutral",
    state: "Borrador",
    stateTone: "neutral",
  },
];

export default function AuditPage() {
  return (
    <AppShell
      title="Historial"
      description="Registro de actividad: quién hizo qué y cuándo. La información no se modifica ni se borra."
      icon="auditoria"
    >
      <section className="rounded-xl border border-atria-edge bg-atria-graphite p-4 shadow-card sm:p-5">
        <div className="flex items-center justify-between border-b border-atria-edge pb-3">
          <h2 className="text-sm font-semibold text-atria-fog">
            Actividad reciente
          </h2>
          <StatusPill tone="success">Solo se agrega</StatusPill>
        </div>

        <ol className="mt-4 grid">
          {events.map((event, index) => (
            <li
              className="relative flex gap-3 pb-4 last:pb-0"
              key={`${event.date}-${event.action}`}
            >
              <div className="flex flex-col items-center">
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-atria-edge"
                  style={{
                    backgroundColor: {
                      primary: "var(--viz-primary)",
                      warning: "var(--viz-warning)",
                      success: "var(--viz-success)",
                      neutral: "var(--viz-neutral)",
                      lavender: "var(--viz-lavender)",
                      danger: "var(--viz-danger)",
                    }[event.tone],
                  }}
                />
                {index < events.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mt-1 w-px flex-1 bg-atria-elevated"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-1 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-wide text-atria-mist">
                    {event.date} · {event.type}
                  </p>
                  <p className="mt-0.5 text-sm text-atria-fog">
                    <span className="font-semibold text-atria-lavender">
                      {event.actor}
                    </span>{" "}
                    {event.action}
                  </p>
                </div>
                <Badge tone={event.stateTone}>{event.state}</Badge>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
