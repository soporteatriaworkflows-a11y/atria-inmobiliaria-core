import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atria: {
          ink: "#16231f",
          forest: "#245448",
          mint: "#dff2e8",
          sand: "#f7f3eb",
          line: "#d8ded8",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 35, 31, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
