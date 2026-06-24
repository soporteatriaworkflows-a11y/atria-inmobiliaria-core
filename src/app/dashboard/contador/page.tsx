import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";

export default function AccountantDashboardPage() {
  return (
    <AppShell
      title="Panel contador"
      description="Herramientas demo para revisar cifras, ajustes y borradores de liquidacion."
    >
      <ActionList
        items={[
          "Validar gastos globales configurados del mes.",
          "Revisar ajustes manuales con soporte y auditoria.",
          "Marcar el cierre como listo para revision.",
        ]}
      />
    </AppShell>
  );
}
