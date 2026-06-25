export type AppMode = "demo" | "dev";

function normalizePublicEnv(value: string | undefined) {
  return value?.replace(/^(["'])(.*)\1$/, "$2");
}

const rawAppMode = normalizePublicEnv(process.env.NEXT_PUBLIC_APP_MODE);

export const appMode: AppMode = rawAppMode === "dev" ? "dev" : "demo";

export const isDemoMode = appMode === "demo";
export const isDevMode = appMode === "dev";

export function getSupabasePublicConfig() {
  const url = normalizePublicEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = normalizePublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  return {
    isConfigured: Boolean(url && publishableKey),
    publishableKey,
    url,
  };
}
