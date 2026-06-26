// Iconos inline ATRIA. Trazo suave, redondeado y calido, sin dependencias externas.
// Sirven para ayudar a reconocer cada modulo de un vistazo, especialmente a personas mayores.

type IconProps = {
  className?: string;
};

function Svg({
  children,
  className = "h-6 w-6",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6 10.5V19h12v-8.5" />
      <path d="M10 19v-4.5h4V19" />
    </Svg>
  );
}

export function LoginIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8l4 4-4 4" />
      <path d="M14 12H4" />
    </Svg>
  );
}

export function AdminIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </Svg>
  );
}

export function AccountantIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect height="16" rx="2" width="12" x="6" y="4" />
      <path d="M9 8h6" />
      <path d="M9 12h2M13 12h2M9 16h2M13 16h2" />
    </Svg>
  );
}

export function OwnerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4l8 4v4c0 4.5-3.2 7-8 8-4.8-1-8-3.5-8-8V8z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </Svg>
  );
}

export function PropertiesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20V9l5-3 5 3" />
      <path d="M14 20V11l5 3v6" />
      <path d="M7.5 12h0M7.5 15.5h0" />
      <path d="M4 20h16" />
    </Svg>
  );
}

export function ParticipantsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="9" r="2.6" />
      <path d="M4 18a5 5 0 0 1 10 0" />
      <circle cx="16.5" cy="8.5" r="2.1" />
      <path d="M15 13.5a4.5 4.5 0 0 1 5 4.5" />
    </Svg>
  );
}

export function CollectionsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10" />
      <path d="M14.5 9.2c-.6-.8-1.6-1.2-2.6-1.2-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2 2.6.8 2.6 2-1.1 2-2.6 2c-1 0-2-.4-2.6-1.2" />
    </Svg>
  );
}

export function ExpensesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect height="13" rx="2" width="17" x="3.5" y="6" />
      <path d="M3.5 10h17" />
      <path d="M7 15h4" />
    </Svg>
  );
}

export function LiquidationIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4v16" />
      <path d="M7 7l-2.5 5h5z" />
      <path d="M17 7l2.5 5h-5z" />
      <path d="M7 7h10" />
      <path d="M8.5 20h7" />
    </Svg>
  );
}

export function RequestsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5h14v10H9l-4 4z" />
      <path d="M9 9h6M9 12h4" />
    </Svg>
  );
}

export function AuditIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 4h8l4 4v12H6z" />
      <path d="M14 4v4h4" />
      <path d="M9 13l1.6 1.6L14 11" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4 4 10-10" />
    </Svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5l7 3v5c0 4.2-3 6.7-7 7.8-4-1.1-7-3.6-7-7.8v-5z" />
      <path d="M9 11.5l2 2 4-4" />
    </Svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect height="10" rx="2" width="13" x="5.5" y="11" />
      <path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
      <path d="M12 15v2.5" />
    </Svg>
  );
}

export const moduleIcons = {
  home: HomeIcon,
  login: LoginIcon,
  admin: AdminIcon,
  contador: AccountantIcon,
  propietario: OwnerIcon,
  propiedades: PropertiesIcon,
  participantes: ParticipantsIcon,
  recaudos: CollectionsIcon,
  gastos: ExpensesIcon,
  liquidacion: LiquidationIcon,
  solicitudes: RequestsIcon,
  auditoria: AuditIcon,
} as const;

export type ModuleIconName = keyof typeof moduleIcons;

export function ModuleIcon({
  name,
  className,
}: {
  name: ModuleIconName;
  className?: string;
}) {
  const Icon = moduleIcons[name];
  return <Icon className={className} />;
}
