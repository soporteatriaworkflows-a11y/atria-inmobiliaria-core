import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { EmptyState, QuickAction } from "@/components/ui";

export default function RequestsPage() {
  return (
    <AppShell
      title="Solicitudes"
      description="Los cambios de propietarios, herederos o permisos entran por solicitud trazable."
    >
      <ActionList
        items={[
          "Solicitud demo: actualizar participacion desde el proximo mes.",
          "Solicitud demo: pedir revision de soporte de un gasto.",
          "Solicitud demo: cambiar acceso de lectura a una propiedad.",
        ]}
      />
      <EmptyState
        title="Flujo real pendiente"
        description="Cuando Auth este conectado, cada solicitud tendra responsable, estado, comentarios y auditoria."
        action={<QuickAction href="/auditoria" label="Ver auditoria" helper="Revisar trazabilidad demo." />}
      />
    </AppShell>
  );
}
