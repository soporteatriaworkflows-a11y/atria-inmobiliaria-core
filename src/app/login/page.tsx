import { AppShell } from "@/components/app-shell";

export default function LoginPage() {
  return (
    <AppShell
      title="Ingreso demo"
      description="Pantalla preparada para Supabase Auth. No solicita claves reales en esta etapa."
    >
      <section className="max-w-xl rounded-lg border border-atria-line bg-white p-6 shadow-soft">
        <label className="block text-lg font-bold" htmlFor="email">
          Correo
        </label>
        <input
          className="focus-ring mt-2 w-full rounded-md border border-atria-line px-4 py-4 text-lg"
          id="email"
          placeholder="usuario.demo@atria.local"
          type="email"
        />
        <button className="focus-ring mt-5 w-full rounded-md bg-atria-forest px-6 py-4 text-xl font-bold text-white">
          Continuar de forma segura
        </button>
        <p className="mt-4 leading-relaxed text-slate-700">
          Autenticacion real pendiente de conectar a Supabase DEV separado.
        </p>
      </section>
    </AppShell>
  );
}
