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
    <ul className="grid gap-2.5">
      {items.map((item, index) => (
        <li
          className="atria-panel flex items-start gap-3 px-3.5 py-3 text-sm leading-relaxed text-atria-fog"
          key={item}
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-atria-violet/25 bg-atria-violet/[0.08] text-xs font-semibold text-atria-lavender">
            {variant === "step" ? (
              index + 1
            ) : (
              <CheckIcon className="h-3.5 w-3.5" />
            )}
          </span>
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}
