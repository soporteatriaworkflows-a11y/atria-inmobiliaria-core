import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atria: {
          // ===== Identidad de marca ATRIA (dark tech, premium) =====
          carbon: "#0A0A0F", // fondo base
          graphite: "#13131B", // superficies / paneles
          indigo: "#1B1240", // acento profundo / capa de sidebar
          violet: "#7C3AED", // acento primario
          lavender: "#B68CFF", // glow / highlights
          fog: "#F2F2F7", // texto claro principal
          // Derivados de marca (provisionales, para profundidad y jerarquia).
          elevated: "#181826", // superficie elevada / hover
          mist: "#9D9BB8", // texto secundario sobre oscuro
          edge: "#2A2740", // bordes sutiles indigo

          // ===== Estados (no identidad) =====
          amber: "#f5b54a", // warning sobre oscuro
          rose: "#f0788f", // danger sobre oscuro
          emerald: "#34d39a", // success discreto

          // ===== Legacy (conservados para compatibilidad puntual) =====
          ink: "#16231f",
          forest: "#245448",
          leaf: "#3f7a68",
          mint: "#dff2e8",
          sand: "#f7f3eb",
          cream: "#fffaf1",
          pearl: "#fbf8f1",
          line: "#d8ded8",
          muted: "#65756e",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }], // 11px
      },
      boxShadow: {
        // Sombras profundas para tema oscuro + glow violeta de marca.
        soft: "0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.28)",
        card: "0 1px 2px rgba(0, 0, 0, 0.35), 0 10px 24px rgba(0, 0, 0, 0.34)",
        panel: "0 2px 8px rgba(0, 0, 0, 0.4), 0 22px 48px rgba(0, 0, 0, 0.45)",
        sidebar: "0 20px 60px rgba(0, 0, 0, 0.5)",
        glow: "0 0 0 1px rgba(124, 58, 237, 0.35), 0 8px 30px rgba(124, 58, 237, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
