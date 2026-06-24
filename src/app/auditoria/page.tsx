import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";

export default function AuditPage() {
  return (
    <AppShell
      title="Auditoria"
      description="Registro append-only preparado para cambios financieros, cierres y solicitudes."
    >
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
