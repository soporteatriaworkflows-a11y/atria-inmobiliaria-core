import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/ui";

const events = [
  { date: "01 jun 2026", text: "Se creo el borrador de cierre." },
  { date: "02 jun 2026", text: "El contador reviso los gastos globales." },
  { date: "03 jun 2026", text: "El administrador envio el cierre a revision." },
];

export default function AuditPage() {
  return (
    <AppShell
      title="Auditoria"
      description="Historial que guarda cada cambio, cierre y solicitud. La informacion no se modifica ni se borra."
      icon="auditoria"
    >
      <section className="rounded-xl border border-atria-line/80 bg-white p-4 shadow-card sm:p-5">
        <div className="flex items-center justify-between border-b border-atria-line/70 pb-3">
          <h2 className="text-sm font-semibold text-atria-ink">Historial de cambios</h2>
          <StatusPill tone="success">Solo se agrega</StatusPill>
        </div>

        <ol className="mt-4 grid gap-0">
          {events.map((event, index) => (
            <li className="relative flex gap-3 pb-5 last:pb-0" key={event.text}>
              <div className="flex flex-col items-center">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-atria-forest ring-4 ring-atria-mint/50" />
                {index < events.length - 1 ? (
                  <span aria-hidden="true" className="mt-1 w-px flex-1 bg-atria-line" />
                ) : null}
              </div>
              <div className="pb-1">
                <p className="text-2xs font-semibold uppercase tracking-wide text-atria-muted">{event.date}</p>
                <p className="mt-0.5 text-sm text-atria-ink">{event.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
