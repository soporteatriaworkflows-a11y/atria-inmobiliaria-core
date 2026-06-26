// Primitivas visuales ATRIA (dark tech). SVG/CSS puro, sin dependencias.
// No son graficos engañosos: representan los valores demo de forma proporcional.

export type VizTone = "primary" | "lavender" | "success" | "warning" | "danger" | "neutral";

const barColor: Record<VizTone, string> = {
  primary: "bg-atria-violet",
  lavender: "bg-atria-lavender",
  success: "bg-atria-emerald",
  warning: "bg-atria-amber",
  danger: "bg-atria-rose",
  neutral: "bg-atria-mist",
};

const strokeColor: Record<VizTone, string> = {
  primary: "#7C3AED",
  lavender: "#B68CFF",
  success: "#34D39A",
  warning: "#F5B54A",
  danger: "#F0788F",
  neutral: "#9D9BB8",
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
}: {
  value: number;
  max?: number;
  tone?: VizTone;
  className?: string;
}) {
  const p = pct(value, max);
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08] ${className}`}>
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
      <ProgressBar value={value} max={max} tone={tone} />
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
        <svg className="-rotate-90" height={size} width={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={r}
            stroke="rgba(255,255,255,0.08)"
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
          <span className="text-base font-semibold text-atria-fog">{center}</span>
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
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white/[0.04]"
          style={{ backgroundColor: strokeColor[tone] }}
        />
        {!last ? <span aria-hidden="true" className="mt-1 w-px flex-1 bg-white/10" /> : null}
      </div>
      <div className="pb-0.5">
        <p className="text-2xs font-semibold uppercase tracking-wide text-atria-mist">{date}</p>
        <p className="mt-0.5 text-sm text-atria-fog">
          <span className="font-semibold text-atria-lavender">{actor}</span> {action}
        </p>
      </div>
    </li>
  );
}
