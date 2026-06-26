import type { ModuleIconName } from "@/components/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: ModuleIconName;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

// Agrupamos la navegacion por intencion para que cada rol encuentre su zona rapido.
export const navigationGroups: NavGroup[] = [
  {
    title: "Paneles",
    items: [
      { href: "/", label: "Inicio", icon: "home" },
      { href: "/dashboard/admin", label: "Administrador", icon: "admin" },
      { href: "/dashboard/contador", label: "Contador", icon: "contador" },
      { href: "/dashboard/propietario", label: "Propietario", icon: "propietario" },
    ],
  },
  {
    title: "Operacion",
    items: [
      { href: "/propiedades", label: "Propiedades", icon: "propiedades" },
      { href: "/herederos", label: "Participantes", icon: "participantes" },
      { href: "/recaudos", label: "Recaudos", icon: "recaudos" },
      { href: "/gastos", label: "Gastos", icon: "gastos" },
      { href: "/liquidacion", label: "Liquidacion", icon: "liquidacion" },
    ],
  },
  {
    title: "Control",
    items: [
      { href: "/solicitudes", label: "Solicitudes", icon: "solicitudes" },
      { href: "/auditoria", label: "Auditoria", icon: "auditoria" },
      { href: "/login", label: "Ingreso", icon: "login" },
    ],
  },
];

// Lista plana derivada, conservada por compatibilidad.
export const mainNavigation: NavItem[] = navigationGroups.flatMap(
  (group) => group.items,
);
