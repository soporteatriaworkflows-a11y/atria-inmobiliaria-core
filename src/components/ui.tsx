import Link from "next/link";
import { type ModuleIconName, ModuleIcon } from "@/components/icons";

const toneClasses = {
  danger: "border-red-200 bg-red-50 text-red-700",
  neutral: "border-atria-line bg-atria-surface text-atria-muted",
  success: "border-atria-mint bg-atria-mint/70 text-atria-forest",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

// Tinte suave para iconos/acentos por tono.
const toneSoft = {
  danger: "bg-red-50 text-atria-rose",
  neutral: "bg-atria-mint/50 text-atria-leaf",
  success: "bg-atria-mint text-atria-forest",
  warning: "bg-amber-50 text-atria-amber",
} as const;

const toneDot = {
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
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneDot[tone]}`} />
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
      className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}
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
      className={`rounded-xl border border-atria-line/80 bg-white p-4 shadow-card sm:p-5 ${className}`}
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
    <div className="flex flex-col gap-3 rounded-xl border border-atria-line/80 bg-atria-surface p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-3xl items-start gap-3">
        {icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-atria-forest shadow-soft">
            <ModuleIcon className="h-5 w-5" name={icon} />
          </span>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-atria-leaf">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-0.5 text-lg font-semibold leading-snug text-atria-ink sm:text-xl">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-atria-muted">
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
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  tone?: Tone;
  badge?: string;
  icon?: ModuleIconName;
}) {
  return (
    <section className="group rounded-xl border border-atria-line/80 bg-white p-4 shadow-card transition hover:shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneSoft[tone]}`}>
              <ModuleIcon className="h-4 w-4" name={icon} />
            </span>
          ) : (
            <span className={`h-2 w-2 rounded-full ${toneDot[tone]}`} />
          )}
          <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-atria-muted">
            {label}
          </p>
        </div>
        {badge ? <StatusPill tone={tone}>{badge}</StatusPill> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-atria-ink">
        {value}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-atria-muted">{helper}</p>
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
    <div className="rounded-xl border border-dashed border-atria-line bg-atria-surface/60 p-6 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-white text-atria-leaf shadow-soft">
        <svg
          aria-hidden="true"
          className="h-5 w-5"
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
      <p className="mt-3 text-base font-semibold text-atria-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-xl text-sm leading-relaxed text-atria-muted">
        {description}
      </p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function QuickAction({
  href,
  label,
  helper,
  icon,
}: {
  href: string;
  label: string;
  helper: string;
  icon?: ModuleIconName;
}) {
  return (
    <Link
      className="focus-ring group flex items-center gap-3 rounded-xl border border-atria-line/80 bg-white p-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-atria-leaf hover:shadow-panel"
      href={href}
    >
      {icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-atria-mint/60 text-atria-forest transition group-hover:bg-atria-forest group-hover:text-white">
          <ModuleIcon className="h-5 w-5" name={icon} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-atria-ink group-hover:text-atria-forest">
          {label}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-atria-muted">
          {helper}
        </span>
      </span>
      <svg
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-atria-line transition group-hover:translate-x-0.5 group-hover:text-atria-forest"
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
    </Link>
  );
}
