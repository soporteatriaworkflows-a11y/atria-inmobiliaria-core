import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  {
    ignores: [
      ".next/**",
      ".vercel/**",
      "out/**",
      "node_modules/**",
      "coverage/**",
      "next-env.d.ts",
      "supabase/.branches/**",
      "supabase/.temp/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
);

export default eslintConfig;
