import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/app-config";

export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();

  if (!config.isConfigured || !config.url || !config.publishableKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para modo live.",
    );
  }

  return createClient(config.url, config.publishableKey);
}
