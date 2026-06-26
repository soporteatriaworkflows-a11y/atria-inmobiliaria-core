export function SummaryCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <section className="rounded-2xl border border-atria-line bg-white p-5 shadow-soft">
      <p className="text-base font-bold text-atria-muted">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-atria-ink">
        {value}
      </p>
      <p className="mt-3 leading-relaxed text-atria-muted">{helper}</p>
    </section>
  );
}
