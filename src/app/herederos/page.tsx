import { AppShell } from "@/components/app-shell";
import { ParticipantsCrudPanel } from "@/components/crud/live-crud-panels";
import { Badge } from "@/components/ui";
import { ProgressBar } from "@/components/viz";
import { demoLiquidation, demoLiquidationInput } from "@/lib/demo-data";
import { formatCop } from "@/lib/money";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Participación (%) desde las reglas demo (basis points) y resultado del periodo.
const participationPct = new Map(
  demoLiquidationInput.participationRules
    .filter((rule) => rule.propertyId === null)
    .map((rule) => [rule.participantId, Math.round(rule.basisPoints / 100)]),
);

const resultByParticipant = new Map(
  demoLiquidation.participants.map((p) => [p.participantId, p]),
);

const lastUpdate = ["hace 2 días", "hace 5 días", "esta semana"];

export default function OwnersPage() {
  return (
    <AppShell
      title="Propietarios"
      description="Personas con participación o derecho de consulta dentro de la administración."
      icon="participantes"
    >
      <section className="grid gap-3 md:grid-cols-3">
        {demoLiquidationInput.participants.map((participant, index) => {
          const pct = participationPct.get(participant.id) ?? 0;
          const result = resultByParticipant.get(participant.id);
          return (
            <article
              className="atria-panel flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:border-atria-violet/35 hover:shadow-panel"
              key={participant.id}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-atria-violet to-atria-lavender text-sm font-semibold text-white shadow-glow ring-1 ring-white/20">
                  {initials(participant.displayName)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-atria-fog">
                    {participant.displayName}
                  </h2>
                  <Badge>{participant.roleLabel}</Badge>
                </div>
                <Badge tone="success">Activo</Badge>
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xs font-medium uppercase tracking-wide text-atria-mist">
                    Participación
                  </span>
                  <span className="text-sm font-semibold text-atria-lavender">
                    {pct}%
                  </span>
                </div>
                <ProgressBar
                  ariaLabel={`Participacion de ${participant.displayName}: ${pct}%`}
                  value={pct}
                  tone="primary"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-atria-edge bg-atria-elevated/65 px-3 py-2">
                <span className="text-2xs uppercase tracking-wide text-atria-mist">
                  Valor del periodo
                </span>
                <span className="text-sm font-semibold text-atria-fog">
                  {result ? formatCop(result.amountToPayCop) : "—"}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xs text-atria-mist">
                  Actualizado {lastUpdate[index] ?? "esta semana"}
                </span>
                <a
                  className="focus-ring rounded-full border border-atria-violet/25 bg-atria-violet/[0.08] px-3 py-1 text-xs font-semibold text-atria-lavender transition hover:bg-atria-violet hover:text-white"
                  href="/liquidacion"
                >
                  Ver resumen
                </a>
              </div>
            </article>
          );
        })}
      </section>

      <ParticipantsCrudPanel />
    </AppShell>
  );
}
