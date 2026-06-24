import Link from "next/link";
import { mainNavigation } from "@/lib/navigation";

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8">
      <header className="flex flex-col gap-5 rounded-lg border border-atria-line bg-white/85 p-5 shadow-soft">
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold uppercase tracking-wide text-atria-forest">
            ATRIA Inmobiliaria Core
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-xl leading-relaxed text-slate-700">
            {description}
          </p>
        </div>
        <nav aria-label="Rutas principales" className="flex flex-wrap gap-3">
          {mainNavigation.map((item) => (
            <Link
              className="focus-ring rounded-md border border-atria-line bg-atria-sand px-4 py-3 text-base font-semibold text-atria-ink hover:bg-atria-mint"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </main>
  );
}
