import { AppShell } from "@/components/app-shell";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <AppShell
      title="Nueva contraseña"
      description="Restablece tu acceso seguro a ATRIA."
      icon="login"
      requireAuth={false}
    >
      <UpdatePasswordForm />
    </AppShell>
  );
}
