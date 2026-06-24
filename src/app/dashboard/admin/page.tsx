import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";

export default function AdminDashboardPage() {
  return (
    <AppShell
      title="Panel administrador"
      description="Vista de control con pocas acciones y estados claros para operar el cierre mensual."
    >
      <ActionList
        items={[
          "Revisar recaudos y gastos pendientes antes del cierre.",
          "Enviar solicitudes de cambio cuando haya novedades de participantes.",
          "Publicar cierres solo despues de revision contable.",
        ]}
      />
    </AppShell>
  );
}
