import { AppShell } from "@/components/app-shell";
import { demoLiquidationInput } from "@/lib/demo-data";

export default function ParticipantsPage() {
  return (
    <AppShell
      title="Herederos y participantes"
      description="Participantes demo separados de usuarios autenticados y membresias."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {demoLiquidationInput.participants.map((participant) => (
          <article
            className="rounded-lg border border-atria-line bg-white p-5 shadow-soft"
            key={participant.id}
          >
            <h2 className="text-2xl font-bold">{participant.displayName}</h2>
            <p className="mt-3 text-slate-700">{participant.roleLabel}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
