"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModuleIcon } from "@/components/icons";
import { navigationGroups } from "@/lib/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav aria-label="Rutas principales" className="grid gap-5">
      {navigationGroups.map((group) => (
        <div className="grid gap-1.5" key={group.title}>
          <p className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-atria-mint/80">
            {group.title}
          </p>
          <ul className="grid gap-1.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`focus-ring flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-bold transition ${
                      active
                        ? "bg-atria-mint text-atria-forest shadow-soft"
                        : "text-white/85 hover:bg-white/12 hover:text-white"
                    }`}
                    href={item.href}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-atria-forest/12 text-atria-forest"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <ModuleIcon className="h-5 w-5" name={item.icon} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
