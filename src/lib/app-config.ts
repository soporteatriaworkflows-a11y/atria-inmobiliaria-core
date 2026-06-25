export type AppMode = "demo" | "dev";

const rawAppMode = process.env.NEXT_PUBLIC_APP_MODE;

export const appMode: AppMode = rawAppMode === "dev" ? "dev" : "demo";

export const isDemoMode = appMode === "demo";
export const isDevMode = appMode === "dev";

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    isConfigured: Boolean(url && publishableKey),
    publishableKey,
    url,
  };
}
