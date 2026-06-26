import { AppShell } from "@/components/app-shell";
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
              className="flex flex-col gap-3 rounded-xl border border-atria-edge bg-atria-graphite p-4 shadow-card transition hover:border-atria-violet/40 hover:shadow-glow"
              key={participant.id}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-atria-violet to-atria-lavender text-sm font-semibold text-white">
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

              <div className="flex items-center justify-between rounded-lg bg-atria-elevated px-3 py-2">
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
                  className="focus-ring rounded-md border border-atria-violet/30 bg-atria-violet/10 px-2.5 py-1 text-xs font-semibold text-atria-lavender transition hover:bg-atria-violet hover:text-white"
                  href="/liquidacion"
                >
                  Ver resumen
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
