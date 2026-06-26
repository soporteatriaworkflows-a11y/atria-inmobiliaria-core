"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
    </svg>
  );
}

export function ThemeToggle() {
  // Evita mismatch de hidratacion: se sincroniza tras montar.
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem("atria-theme") as Theme | null;
      } catch {
        return null;
      }
    })();
    setTheme(
      document.documentElement.classList.contains("dark")
        ? "dark"
        : (stored ?? "light"),
    );
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("atria-theme", next);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  const isDark = theme === "dark";
  const label = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  const text = mounted ? (isDark ? "Modo oscuro" : "Modo claro") : "Tema";

  return (
    <button
      aria-label={label}
      className="focus-ring flex w-full items-center justify-between gap-2 rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-xs font-semibold text-atria-fog transition hover:border-atria-violet/40"
      onClick={toggle}
      type="button"
    >
      <span className="flex items-center gap-2" suppressHydrationWarning>
        <span className="text-atria-lavender">
          {mounted && isDark ? <MoonIcon /> : <SunIcon />}
        </span>
        {text}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 rounded-full transition ${isDark ? "bg-atria-violet" : "bg-atria-edge"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all ${isDark ? "left-3.5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}
