import { AppShell } from "@/components/app-shell";
import { CheckIcon, LockIcon } from "@/components/icons";
import { Badge, SectionPanel, StatusPill } from "@/components/ui";

const trustPoints = [
  "No pedimos claves, cuentas bancarias ni cedulas reales en esta version.",
  "Cuando Auth real este listo, respetara roles y permisos por organizacion.",
  "Cada ingreso quedara registrado para mayor tranquilidad.",
];

export default function LoginPage() {
  return (
    <AppShell
      title="Ingreso seguro"
      description="Preparado para Supabase Auth. En esta etapa no se solicitan claves reales ni se habilitan sesiones productivas."
      icon="login"
    >
      <section className="grid gap-5 lg:grid-cols-[1fr_24rem]">
        <SectionPanel>
          <div className="flex flex-wrap gap-2">
            <Badge tone="warning">Auth pendiente</Badge>
            <Badge tone="success">Sin datos reales</Badge>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-atria-mint text-atria-forest">
              <LockIcon className="h-7 w-7" />
            </span>
            <p className="text-lg leading-relaxed text-atria-muted">
              Entra con calma. Esta pantalla todavia es una vista de ejemplo.
            </p>
          </div>

          <label className="mt-6 block text-lg font-bold text-atria-ink" htmlFor="email">
            Correo de acceso
          </label>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-atria-line bg-atria-pearl px-5 py-4 text-lg text-atria-ink placeholder:text-atria-muted"
            id="email"
            placeholder="usuario.demo@atria.local"
            type="email"
          />

          <label className="mt-5 block text-lg font-bold text-atria-ink" htmlFor="password">
            Contrasena
          </label>
          <input
            className="focus-ring mt-2 w-full rounded-2xl border border-atria-line bg-atria-pearl px-5 py-4 text-lg text-atria-ink placeholder:text-atria-muted disabled:cursor-not-allowed disabled:opacity-70"
            disabled
            id="password"
            placeholder="Disponible cuando se active el ingreso real"
            type="password"
          />

          <button className="focus-ring mt-6 w-full rounded-2xl bg-atria-forest px-6 py-4 text-xl font-bold text-white shadow-soft transition hover:bg-atria-ink">
            Continuar de forma segura
          </button>
          <p className="mt-4 leading-relaxed text-atria-muted">
            Cuando Auth real este listo, este ingreso respetara roles y permisos
            por organizacion.
          </p>
        </SectionPanel>

        <SectionPanel className="bg-atria-cream">
          <StatusPill tone="success">Cuidado ATRIA</StatusPill>
          <h2 className="mt-4 font-display text-2xl font-semibold text-atria-ink">
            Antes de entrar
          </h2>
          <ul className="mt-4 grid gap-3">
            {trustPoints.map((point) => (
              <li className="flex items-start gap-3 text-base leading-relaxed text-atria-muted" key={point}>
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-atria-mint text-atria-forest">
                  <CheckIcon className="h-4 w-4" />
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
