// Primitivas visuales ATRIA (dark tech). SVG/CSS puro, sin dependencias.
// No son graficos enganosos: representan los valores demo de forma proporcional.

export type VizTone =
  | "primary"
  | "lavender"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

const barColor: Record<VizTone, string> = {
  primary: "bg-atria-violet",
  lavender: "bg-atria-lavender",
  success: "bg-atria-emerald",
  warning: "bg-atria-amber",
  danger: "bg-atria-rose",
  neutral: "bg-atria-mist",
};

// CSS vars theme-aware (definidas en globals.css por :root / html.dark).
const strokeColor: Record<VizTone, string> = {
  primary: "var(--viz-primary)",
  lavender: "var(--viz-lavender)",
  success: "var(--viz-success)",
  warning: "var(--viz-warning)",
  danger: "var(--viz-danger)",
  neutral: "var(--viz-neutral)",
};

function pct(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

export function ProgressBar({
  value,
  max = 100,
  tone = "primary",
  className = "",
  ariaLabel,
}: {
  value: number;
  max?: number;
  tone?: VizTone;
  className?: string;
  ariaLabel?: string;
}) {
  const p = pct(value, max);
  return (
    <div
      aria-label={ariaLabel}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={Math.max(0, Math.min(value, max))}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-atria-edge ${className}`}
      role="progressbar"
    >
      <div
        className={`h-full rounded-full ${barColor[tone]} transition-all`}
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

export function LabeledBar({
  label,
  caption,
  value,
  max,
  tone = "primary",
}: {
  label: string;
  caption: string;
  value: number;
  max: number;
  tone?: VizTone;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-atria-fog">{label}</span>
        <span className="text-xs font-semibold text-atria-mist">{caption}</span>
      </div>
      <ProgressBar
        ariaLabel={`${label}: ${caption}`}
        value={value}
        max={max}
        tone={tone}
      />
    </div>
  );
}

export function Donut({
  value,
  max = 100,
  tone = "primary",
  center,
  caption,
  size = 92,
}: {
  value: number;
  max?: number;
  tone?: VizTone;
  center: string;
  caption?: string;
  size?: number;
}) {
  const p = pct(value, max);
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (p / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          aria-hidden="true"
          className="-rotate-90"
          height={size}
          width={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={r}
            stroke="rgb(var(--c-edge))"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={r}
            stroke={strokeColor[tone]}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth={stroke}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-semibold text-atria-fog">
            {center}
          </span>
        </div>
      </div>
      {caption ? (
        <span className="text-2xs font-medium uppercase tracking-wide text-atria-mist">
          {caption}
        </span>
      ) : null}
    </div>
  );
}

export function TimelineItem({
  date,
  actor,
  action,
  tone = "primary",
  last = false,
}: {
  date: string;
  actor: string;
  action: string;
  tone?: VizTone;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-atria-edge"
          style={{ backgroundColor: strokeColor[tone] }}
        />
        {!last ? (
          <span
            aria-hidden="true"
            className="mt-1 w-px flex-1 bg-atria-elevated"
          />
        ) : null}
      </div>
      <div className="pb-0.5">
        <p className="text-2xs font-semibold uppercase tracking-wide text-atria-mist">
          {date}
        </p>
        <p className="mt-0.5 text-sm text-atria-fog">
          <span className="font-semibold text-atria-lavender">{actor}</span>{" "}
          {action}
        </p>
      </div>
    </li>
  );
}
