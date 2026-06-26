import { CheckIcon } from "@/components/icons";

export function ActionList({
  items,
  variant = "check",
}: {
  items: string[];
  // "check" para confirmaciones; "step" para pasos guiados numerados.
  variant?: "check" | "step";
}) {
  return (
    <ul className="grid gap-3">
      {items.map((item, index) => (
        <li
          className="flex items-start gap-4 rounded-2xl border border-atria-line bg-white p-5 text-lg leading-relaxed text-atria-ink shadow-soft"
          key={item}
        >
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-atria-mint font-bold text-atria-forest">
            {variant === "step" ? (
              index + 1
            ) : (
              <CheckIcon className="h-5 w-5" />
            )}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
