import { AppShell } from "@/components/app-shell";
import { Badge, SectionPanel } from "@/components/ui";
import { demoLiquidationInput } from "@/lib/demo-data";

export default function ParticipantsPage() {
  return (
    <AppShell
      title="Herederos y participantes"
      description="Participantes de ejemplo, separados de usuarios autenticados y membresias."
      icon="participantes"
    >
      <section className="grid gap-4 md:grid-cols-3">
        {demoLiquidationInput.participants.map((participant) => (
          <SectionPanel key={participant.id}>
            <Badge>Participante demo</Badge>
            <h2 className="mt-4 text-2xl font-bold text-atria-ink">{participant.displayName}</h2>
            <p className="mt-3 text-lg leading-relaxed text-atria-muted">{participant.roleLabel}</p>
            <p className="mt-4 text-base leading-relaxed text-atria-muted">
              Los cambios de participacion entran como solicitud trazable, no como edicion directa.
            </p>
          </SectionPanel>
        ))}
      </section>
    </AppShell>
  );
}
