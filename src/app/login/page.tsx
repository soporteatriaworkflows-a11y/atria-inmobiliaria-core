import { AppShell } from "@/components/app-shell";
import { Badge, SectionPanel, StatusPill } from "@/components/ui";

export default function LoginPage() {
  return (
    <AppShell
      title="Ingreso seguro"
      description="Preparado para Supabase Auth. En esta etapa no se solicitan claves reales ni se habilitan sesiones productivas."
    >
      <section className="grid gap-5 lg:grid-cols-[1fr_24rem]">
        <SectionPanel>
          <div className="flex flex-wrap gap-2">
            <Badge tone="warning">Auth pendiente</Badge>
            <Badge tone="success">Sin datos reales</Badge>
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
          <button className="focus-ring mt-5 w-full rounded-2xl bg-atria-forest px-6 py-4 text-xl font-bold text-white shadow-soft transition hover:bg-atria-ink">
            Continuar de forma segura
          </button>
          <p className="mt-4 leading-relaxed text-atria-muted">
            Cuando Auth real este listo, este ingreso respetara roles y permisos por organizacion.
          </p>
        </SectionPanel>
        <SectionPanel className="bg-atria-cream">
          <StatusPill tone="success">Cuidado ATRIA</StatusPill>
          <h2 className="mt-4 text-2xl font-bold text-atria-ink">Antes de entrar</h2>
          <p className="mt-3 text-lg leading-relaxed text-atria-muted">
            No pegues claves, cuentas bancarias, cedulas ni documentos reales en esta version tecnica.
          </p>
        </SectionPanel>
      </section>
    </AppShell>
  );
}
