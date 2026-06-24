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
    <section className="rounded-lg border border-atria-line bg-white p-5 shadow-soft">
      <p className="text-base font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-atria-ink">{value}</p>
      <p className="mt-3 leading-relaxed text-slate-700">{helper}</p>
    </section>
  );
}
