import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { SectionPanel, StatusPill } from "@/components/ui";

export default function AuditPage() {
  return (
    <AppShell
      title="Auditoria"
      description="Registro append-only preparado para cambios financieros, cierres y solicitudes."
    >
      <SectionPanel className="bg-atria-cream">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-atria-ink">Historial protegido</h2>
            <p className="mt-3 text-lg leading-relaxed text-atria-muted">
              Esta vista muestra eventos demo. En operacion real, la auditoria no se actualiza ni se borra.
            </p>
          </div>
          <StatusPill tone="success">Append-only</StatusPill>
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
