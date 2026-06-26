import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui";

import { demoLiquidationInput } from "@/lib/demo-data";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ParticipantsPage() {
  return (
    <AppShell
      title="Herederos y participantes"
      description="Participantes de ejemplo. Los cambios entran como solicitud, no como edicion directa."
      icon="participantes"
    >
      <section className="grid gap-3 md:grid-cols-3">
        {demoLiquidationInput.participants.map((participant) => (
          <article
            className="rounded-xl border border-white/10 bg-atria-graphite p-4 shadow-card transition hover:shadow-panel"
            key={participant.id}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-atria-violet text-sm font-semibold text-white">
                {initials(participant.displayName)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-atria-fog">{participant.displayName}</h2>
                <Badge>{participant.roleLabel}</Badge>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-atria-mist">
              Los cambios de participacion se solicitan y quedan registrados.
            </p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
