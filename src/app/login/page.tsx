import { AppShell } from "@/components/app-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AppShell
      title="Ingreso"
      description="Acceso seguro con Supabase Auth y permisos por rol."
      icon="login"
      requireAuth={false}
    >
      <LoginForm />
    </AppShell>
  );
}
