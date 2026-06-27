import Link from "next/link";
import { type ModuleIconName, ModuleIcon } from "@/components/icons";

const toneClasses = {
  primary:
    "border-atria-violet/25 bg-atria-violet/[0.06] text-atria-lavender shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  danger:
    "border-atria-rose/25 bg-transparent text-atria-rose shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  neutral:
    "border-atria-edge bg-atria-elevated/55 text-atria-mist shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  success:
    "border-atria-emerald/20 bg-transparent text-atria-emerald shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  warning:
    "border-atria-amber/20 bg-transparent text-atria-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
} as const;

const toneDot = {
  primary: "bg-atria-violet",
  danger: "bg-atria-rose",
  neutral: "bg-atria-lavender",
  success: "bg-atria-emerald",
  warning: "bg-atria-amber",
} as const;

export type Tone = keyof typeof toneClasses;

export function AtriaIconTile({
  icon,
  size = "md",
  className = "",
}: {
  icon: ModuleIconName;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 rounded-lg"
      : size === "lg"
        ? "h-11 w-11 rounded-xl"
        : "h-10 w-10 rounded-xl";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${sizeClass} bg-gradient-to-br from-atria-violet/18 via-atria-lavender/10 to-atria-elevated text-atria-lavender ring-1 ring-atria-violet/25 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-1 top-0 h-px bg-atria-lavender/45"
      />
      <span
        aria-hidden="true"
        className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-atria-violet/15 blur-md"
      />
      <ModuleIcon className={iconSize} name={icon} />
    </span>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-medium leading-none tracking-tight ${toneClasses[tone]}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${toneDot[tone]} shadow-[0_0_0_3px_rgba(124,58,237,0.08)]`}
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
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none ${toneClasses[tone]}`}
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
    <section className={`atria-panel p-4 sm:p-5 ${className}`}>
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
    <div className="atria-panel atria-panel-accent flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-3xl items-start gap-3">
        {icon ? <AtriaIconTile icon={icon} size="lg" /> : null}
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
    <section className="atria-panel group p-4 transition hover:-translate-y-0.5 hover:border-atria-violet/35 hover:shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon ? (
            <AtriaIconTile icon={icon} size="sm" />
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
      <div className="mt-4 border-t border-atria-edge/70 pt-3">
        <p className="text-2xl font-semibold tracking-tight text-atria-fog">
          {value}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-atria-mist">
          {helper}
        </p>
      </div>
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
    <div className="atria-panel atria-panel-accent p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-atria-violet/30 bg-atria-violet/[0.06] text-atria-lavender">
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
      className="focus-ring atria-panel group flex items-center gap-3 p-3.5 transition hover:-translate-y-0.5 hover:border-atria-violet/40 hover:shadow-panel"
      href={href}
    >
      {icon ? <AtriaIconTile icon={icon} size="sm" /> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-atria-fog group-hover:text-atria-lavender">
          {label}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-atria-mist">
          {helper}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-atria-edge bg-atria-elevated text-atria-mist/70 transition group-hover:border-atria-violet/35 group-hover:text-atria-lavender"
      >
        <svg
          className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
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
