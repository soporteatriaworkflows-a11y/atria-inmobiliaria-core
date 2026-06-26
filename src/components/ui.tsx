import Link from "next/link";

const toneClasses = {
  danger: "border-red-200 bg-red-50 text-red-900",
  neutral: "border-atria-line bg-atria-pearl text-atria-muted",
  success: "border-atria-mint bg-atria-mint text-atria-forest",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
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
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-atria-line bg-atria-cream p-5 shadow-soft sm:p-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-atria-forest">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-bold leading-tight text-atria-ink sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-atria-muted">
          {description}
        </p>
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
}: {
  label: string;
  value: string;
  helper: string;
  tone?: Tone;
}) {
  return (
    <section className="rounded-2xl border border-atria-line bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-bold text-atria-muted">{label}</p>
        <StatusPill tone={tone}>{tone === "neutral" ? "Demo" : "OK"}</StatusPill>
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
    <div className="rounded-2xl border border-dashed border-atria-line bg-atria-pearl p-6 text-center">
      <p className="text-xl font-bold text-atria-ink">{title}</p>
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
      className="focus-ring group rounded-2xl border border-atria-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-atria-forest hover:shadow-panel"
      href={href}
    >
      <span className="text-lg font-bold text-atria-ink group-hover:text-atria-forest">
        {label}
      </span>
      <span className="mt-2 block text-base leading-relaxed text-atria-muted">
        {helper}
      </span>
    </Link>
  );
}
