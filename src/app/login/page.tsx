import { AppShell } from "@/components/app-shell";
import { CheckIcon, LockIcon } from "@/components/icons";
import { Badge, SectionPanel } from "@/components/ui";

const trustPoints = [
  "No pedimos claves, cuentas bancarias ni documentos reales en esta version.",
  "Cuando el ingreso real este activo, respetara roles y permisos por organizacion.",
  "Cada ingreso quedara registrado para mayor tranquilidad.",
];

export default function LoginPage() {
  return (
    <AppShell
      title="Ingreso"
      description="Acceso preparado para activarse. Por ahora es una vista de ejemplo, sin claves reales ni sesiones."
      icon="login"
    >
      <section className="grid gap-3 lg:grid-cols-[1fr_20rem]">
        <SectionPanel>
          <div className="flex items-center gap-3 border-b border-atria-line/70 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-atria-mint/70 text-atria-forest">
              <LockIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-atria-ink">Entrar a ATRIA</h2>
              <p className="text-xs text-atria-muted">Vista de ejemplo · ingreso real pendiente</p>
            </div>
            <span className="ml-auto">
              <Badge tone="warning">Pendiente</Badge>
            </span>
          </div>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-atria-ink" htmlFor="email">
                Correo de acceso
              </label>
              <input
                className="focus-ring mt-1.5 w-full rounded-lg border border-atria-line bg-atria-surface px-3.5 py-2.5 text-sm text-atria-ink placeholder:text-atria-muted/70"
                id="email"
                placeholder="usuario@atria.local"
                type="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-atria-ink" htmlFor="password">
                Contrasena
              </label>
              <input
                className="focus-ring mt-1.5 w-full rounded-lg border border-atria-line bg-atria-surface px-3.5 py-2.5 text-sm text-atria-ink placeholder:text-atria-muted/70 disabled:cursor-not-allowed disabled:opacity-60"
                disabled
                id="password"
                placeholder="Disponible al activar el ingreso real"
                type="password"
              />
            </div>

            <button className="focus-ring mt-1 w-full rounded-lg bg-atria-forest px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-atria-ink">
              Continuar
            </button>
            <p className="text-xs leading-relaxed text-atria-muted">
              Al activarse, el ingreso respetara roles y permisos por organizacion.
            </p>
          </div>
        </SectionPanel>

        <SectionPanel className="bg-gradient-to-br from-atria-mint/40 to-atria-surface">
          <h2 className="text-sm font-semibold text-atria-ink">Antes de entrar</h2>
          <ul className="mt-3 grid gap-2.5">
            {trustPoints.map((point) => (
              <li className="flex items-start gap-2.5 text-xs leading-relaxed text-atria-muted" key={point}>
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-atria-mint text-atria-forest">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </SectionPanel>
      </section>
    </AppShell>
  );
}
