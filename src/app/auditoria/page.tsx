import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { SectionPanel, StatusPill } from "@/components/ui";

export default function AuditPage() {
  return (
    <AppShell
      title="Auditoria"
      description="Historial que registra cada cambio financiero, cierre y solicitud sin poder modificarse."
      icon="auditoria"
    >
      <SectionPanel className="bg-atria-cream">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-atria-ink">Historial protegido</h2>
            <p className="mt-3 text-lg leading-relaxed text-atria-muted">
              Esta vista muestra eventos de ejemplo. En operacion real, la auditoria no se actualiza ni se borra.
            </p>
          </div>
          <StatusPill tone="success">Solo se agrega</StatusPill>
        </div>
      </SectionPanel>
      <ActionList
        items={[
          "2026-06-01 demo: se creo borrador de cierre.",
          "2026-06-02 demo: contador reviso gastos globales.",
          "2026-06-03 demo: administrador envio cierre a revision.",
        ]}
      />
    </AppShell>
  );
}
