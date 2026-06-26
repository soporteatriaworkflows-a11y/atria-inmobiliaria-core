import Link from "next/link";
import { type ModuleIconName, ModuleIcon } from "@/components/icons";

const toneClasses = {
  danger: "border-red-200 bg-red-50 text-red-900",
  neutral: "border-atria-line bg-atria-pearl text-atria-muted",
  success: "border-atria-mint bg-atria-mint text-atria-forest",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
} as const;

// Acento de color por tono para barras y puntos, sin texto tecnico redundante.
const toneAccent = {
  danger: "bg-atria-rose",
  neutral: "bg-atria-leaf",
  success: "bg-atria-forest",
  warning: "bg-atria-amber",
} as const;

export type Tone = keyof typeof toneClasses;

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-bold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex w-fit rounded-md border px-3 py-2 text-base font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-atria-line bg-white/92 p-5 shadow-soft sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function ModuleHeader({
  eyebrow,
  title,
  description,
  icon,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: ModuleIconName;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-atria-line bg-atria-cream p-5 shadow-soft sm:p-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-3xl items-start gap-4">
        {icon ? (
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-atria-forest shadow-soft sm:flex">
            <ModuleIcon className="h-7 w-7" name={icon} />
          </span>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-atria-forest">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-atria-ink sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-atria-muted">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="flex shrink-0">{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  helper,
  tone = "neutral",
  badge,
}: {
  label: string;
  value: string;
  helper: string;
  tone?: Tone;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-atria-line bg-white p-5 pl-6 shadow-soft">
      <span
        aria-hidden="true"
        className={`absolute inset-y-3 left-0 w-1.5 rounded-full ${toneAccent[tone]}`}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-bold text-atria-muted">{label}</p>
        {badge ? <StatusPill tone={tone}>{badge}</StatusPill> : null}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-atria-ink">
        {value}
      </p>
      <p className="mt-3 text-base leading-relaxed text-atria-muted">{helper}</p>
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-atria-line bg-atria-pearl p-7 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-atria-forest shadow-soft">
        <svg
          aria-hidden="true"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          viewBox="0 0 24 24"
        >
          <rect height="14" rx="2" width="16" x="4" y="6" />
          <path d="M4 10h16" />
          <path d="M9 14h6" />
        </svg>
      </span>
      <p className="mt-4 font-display text-xl font-semibold text-atria-ink">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-atria-muted">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function QuickAction({
  href,
  label,
  helper,
}: {
  href: string;
  label: string;
  helper: string;
}) {
  return (
    <Link
      className="focus-ring group flex items-start justify-between gap-3 rounded-2xl border border-atria-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-atria-forest hover:shadow-panel"
      href={href}
    >
      <span>
        <span className="text-lg font-bold text-atria-ink group-hover:text-atria-forest">
          {label}
        </span>
        <span className="mt-2 block text-base leading-relaxed text-atria-muted">
          {helper}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-atria-mint text-atria-forest transition group-hover:bg-atria-forest group-hover:text-white"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
