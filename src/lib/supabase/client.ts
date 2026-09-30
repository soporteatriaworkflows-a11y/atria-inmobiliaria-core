import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/app-config";

let browserClient: SupabaseClient | undefined;

export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();

  if (!config.isConfigured || !config.url || !config.publishableKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para modo live.",
    );
  }

  // Share Auth state and its subscription channel within this browser only.
  // Server renders must never share an authenticated client across requests.
  if (typeof window !== "undefined" && browserClient) return browserClient;

  const client = createClient(config.url, config.publishableKey);
  if (typeof window !== "undefined") browserClient = client;
  return client;
}
