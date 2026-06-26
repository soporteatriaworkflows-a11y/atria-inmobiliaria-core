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
    <ul className="grid gap-2">
      {items.map((item, index) => (
        <li
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-atria-graphite px-3.5 py-2.5 text-sm leading-relaxed text-atria-fog shadow-soft"
          key={item}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-atria-violet/15 text-xs font-semibold text-atria-lavender ring-1 ring-atria-violet/25">
            {variant === "step" ? (
              index + 1
            ) : (
              <CheckIcon className="h-3.5 w-3.5" />
            )}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
