import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atria: {
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
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 35, 31, 0.08)",
        panel: "0 24px 60px rgba(22, 35, 31, 0.11)",
      },
    },
  },
  plugins: [],
};

export default config;
