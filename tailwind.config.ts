import type { Config } from "tailwindcss";

// Color theme-aware: el token usa una CSS var (triplete RGB) para soportar
// modificadores de opacidad (/10, /30...) y cambiar segun tema claro/oscuro.
function v(name: string) {
  return `rgb(var(--c-${name}) / <alpha-value>)`;
}

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atria: {
          // Acento de marca constante en ambos temas.
          violet: "#7C3AED",

          // Theme-aware (definidos en globals.css por :root / html.dark).
          carbon: v("carbon"), // base sidebar / fondo profundo
          graphite: v("graphite"), // superficies / paneles / cards
          indigo: v("indigo"), // capa de acento (sidebar, headers)
          elevated: v("elevated"), // superficie elevada / tracks
          edge: v("edge"), // bordes y divisores sutiles
          fog: v("fog"), // texto principal
          mist: v("mist"), // texto secundario
          lavender: v("lavender"), // acento de texto/icono (violeta en claro)
          emerald: v("emerald"), // success
          amber: v("amber"), // warning
          rose: v("rose"), // danger

          // Legacy (sin uso activo; conservados por compatibilidad).
          ink: "#16231f",
          forest: "#245448",
          mint: "#dff2e8",
          sand: "#f7f3eb",
          line: "#d8ded8",
          muted: "#65756e",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }], // 11px
      },
      boxShadow: {
        // Sombras theme-aware via CSS var + glow violeta de marca constante.
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        panel: "var(--shadow-panel)",
        sidebar: "var(--shadow-sidebar)",
        glow: "0 0 0 1px rgba(124, 58, 237, 0.30), 0 8px 30px rgba(124, 58, 237, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
