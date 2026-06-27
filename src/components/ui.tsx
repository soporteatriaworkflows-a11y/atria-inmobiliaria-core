import Link from "next/link";
import { type ModuleIconName, ModuleIcon } from "@/components/icons";

// Identidad ATRIA: violeta/lavanda. Verde/ámbar/rose SOLO como estado semántico,
// con tratamiento sobrio (chips outline, sin uppercase ruidoso).
const toneClasses = {
  primary: "border-atria-violet/25 bg-atria-violet/10 text-atria-lavender",
  danger: "border-atria-rose/25 bg-atria-rose/10 text-atria-rose",
  neutral: "border-atria-edge bg-transparent text-atria-mist",
  success: "border-atria-emerald/25 bg-atria-emerald/10 text-atria-emerald",
  warning: "border-atria-amber/25 bg-atria-amber/10 text-atria-amber",
} as const;

// Acento monocromo violeta para iconos (mismo para todas las métricas).
const iconAccent =
  "bg-atria-violet/12 text-atria-lavender ring-1 ring-atria-violet/20";

const toneDot = {
  primary: "bg-atria-violet",
  danger: "bg-atria-rose",
  neutral: "bg-atria-lavender",
  success: "bg-atria-emerald",
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
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-2xs font-medium tracking-tight ${toneClasses[tone]}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${toneDot[tone]}`}
      />
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
      className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
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
      className={`rounded-xl border border-atria-edge bg-atria-graphite p-4 shadow-card sm:p-5 ${className}`}
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
    <div className="flex flex-col gap-3 rounded-xl border border-atria-edge bg-gradient-to-br from-atria-indigo/50 to-atria-graphite p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-3xl items-start gap-3">
        {icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-atria-violet/15 text-atria-lavender ring-1 ring-atria-violet/30">
            <ModuleIcon className="h-5 w-5" name={icon} />
          </span>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-atria-lavender">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-0.5 text-lg font-semibold leading-snug text-atria-fog sm:text-xl">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-atria-mist">
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
    <section className="group rounded-xl border border-atria-edge bg-atria-graphite p-4 shadow-card transition hover:border-atria-violet/40 hover:shadow-glow">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconAccent}`}
            >
              <ModuleIcon className="h-4 w-4" name={icon} />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${toneDot[tone]}`}
            />
          )}
          <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-atria-mist">
            {label}
          </p>
        </div>
        {badge ? <StatusPill tone={tone}>{badge}</StatusPill> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-atria-fog">
        {value}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-atria-mist">{helper}</p>
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
    <div className="rounded-xl border border-dashed border-atria-edge bg-atria-elevated p-6 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-atria-violet/15 text-atria-lavender ring-1 ring-atria-violet/25">
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
      <p className="mt-3 text-base font-semibold text-atria-fog">{title}</p>
      <p className="mx-auto mt-1.5 max-w-xl text-sm leading-relaxed text-atria-mist">
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
      className="focus-ring group flex items-center gap-3 rounded-xl border border-atria-edge bg-atria-graphite p-3.5 shadow-card transition hover:-translate-y-0.5 hover:border-atria-violet/50 hover:shadow-glow"
      href={href}
    >
      {icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-atria-violet/15 text-atria-lavender ring-1 ring-atria-violet/25 transition group-hover:bg-atria-violet group-hover:text-white group-hover:ring-atria-violet">
          <ModuleIcon className="h-5 w-5" name={icon} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-atria-fog group-hover:text-atria-lavender">
          {label}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-atria-mist">
          {helper}
        </span>
      </span>
      <svg
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-atria-mist/50 transition group-hover:translate-x-0.5 group-hover:text-atria-lavender"
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
