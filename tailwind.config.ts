import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atria: {
          // Paleta base ATRIA (fuente de verdad del repo).
          ink: "#16231f",
          forest: "#245448",
          leaf: "#3f7a68",
          mint: "#dff2e8",
          sand: "#f7f3eb",
          cream: "#fffaf1",
          pearl: "#fbf8f1",
          line: "#d8ded8",
          muted: "#65756e",
          amber: "#b56b1d",
          rose: "#b94a48",
          // Extensiones visuales PROVISIONALES para la capa moderna (sidebar
          // semi-dark y superficies neutras sofisticadas). Derivadas de ink/forest.
          night: "#101b18", // base profunda de la sidebar
          slate: "#1b2c27", // capa intermedia de la sidebar
          haze: "#eef1ea", // fondo neutro general (menos blanco puro)
          surface: "#f6f4ee", // superficie de paneles suaves
        },
      },
      fontSize: {
        // Escala controlada para un look compacto/premium.
        "2xs": ["0.6875rem", { lineHeight: "1rem" }], // 11px
      },
      boxShadow: {
        // Sombras finas y en capas (sin exageraciones).
        soft: "0 1px 2px rgba(16, 27, 24, 0.04), 0 4px 12px rgba(16, 27, 24, 0.05)",
        card: "0 1px 2px rgba(16, 27, 24, 0.05), 0 8px 20px rgba(16, 27, 24, 0.06)",
        panel: "0 2px 6px rgba(16, 27, 24, 0.06), 0 18px 40px rgba(16, 27, 24, 0.09)",
        sidebar: "0 12px 40px rgba(16, 27, 24, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
