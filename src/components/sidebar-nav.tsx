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
    <nav aria-label="Rutas principales" className="grid gap-4">
      {navigationGroups.map((group) => (
        <div className="grid gap-1" key={group.title}>
          <p className="px-2 pb-0.5 text-2xs font-semibold uppercase tracking-[0.16em] text-atria-mist/50">
            {group.title}
          </p>
          <ul className="grid gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`focus-ring relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.8125rem] font-medium transition ${
                      active
                        ? "bg-atria-violet/15 font-semibold text-atria-fog ring-1 ring-atria-violet/30"
                        : "text-atria-mist hover:bg-white/[0.04] hover:text-atria-fog"
                    }`}
                    href={item.href}
                  >
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-atria-lavender"
                      />
                    ) : null}
                    <ModuleIcon
                      className={`h-4 w-4 shrink-0 ${active ? "text-atria-lavender" : "text-atria-mist/70"}`}
                      name={item.icon}
                    />
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
