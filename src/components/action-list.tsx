export function ActionList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          className="rounded-md border border-atria-line bg-white p-4 text-lg leading-relaxed"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
