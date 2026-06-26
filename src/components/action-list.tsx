export function ActionList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          className="flex gap-3 rounded-2xl border border-atria-line bg-white p-5 text-lg leading-relaxed text-atria-ink shadow-soft"
          key={item}
        >
          <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-atria-mint text-xs font-black text-atria-forest">
            OK
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
