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
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-atria-violet/15 text-atria-lavender">
              <LockIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-atria-fog">
                Entrar a ATRIA
              </h2>
              <p className="text-xs text-atria-mist">
                Vista de ejemplo · ingreso real pendiente
              </p>
            </div>
            <span className="ml-auto">
              <Badge tone="warning">Pendiente</Badge>
            </span>
          </div>

          <div className="mt-4 grid gap-4">
            <div>
              <label
                className="block text-xs font-semibold text-atria-fog"
                htmlFor="email"
              >
                Correo de acceso
              </label>
              <input
                className="focus-ring mt-1.5 w-full rounded-lg border border-white/10 bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70"
                id="email"
                placeholder="usuario@atria.local"
                type="email"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-atria-fog"
                htmlFor="password"
              >
                Contrasena
              </label>
              <input
                className="focus-ring mt-1.5 w-full rounded-lg border border-white/10 bg-atria-elevated px-3.5 py-2.5 text-sm text-atria-fog placeholder:text-atria-mist/70 disabled:cursor-not-allowed disabled:opacity-60"
                disabled
                id="password"
                placeholder="Disponible al activar el ingreso real"
                type="password"
              />
            </div>

            <button className="focus-ring mt-1 w-full rounded-lg bg-atria-violet px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-atria-lavender hover:text-atria-carbon">
              Continuar
            </button>
            <p className="text-xs leading-relaxed text-atria-mist">
              Al activarse, el ingreso respetara roles y permisos por
              organizacion.
            </p>
          </div>
        </SectionPanel>

        <SectionPanel className="bg-gradient-to-br from-atria-violet/15 to-atria-graphite">
          <h2 className="text-sm font-semibold text-atria-fog">
            Antes de entrar
          </h2>
          <ul className="mt-3 grid gap-2.5">
            {trustPoints.map((point) => (
              <li
                className="flex items-start gap-2.5 text-xs leading-relaxed text-atria-mist"
                key={point}
              >
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-atria-violet/15 text-atria-lavender">
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
