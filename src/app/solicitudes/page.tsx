import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";

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
    </AppShell>
  );
}
