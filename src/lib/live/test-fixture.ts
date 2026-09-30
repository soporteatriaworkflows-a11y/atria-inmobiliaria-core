import { createClient } from "@supabase/supabase-js";
import type { LiveContext } from "./shared";

// Synthetic HTTP boundary: no network and no real credentials.
export const context: LiveContext = {
  organizationId: "qa-org",
  userId: "qa-user",
  role: "platform_admin",
};
export function fixture(responses: { data: unknown; status?: number }[] = []) {
  const calls: {
    url: URL;
    method: string;
    body: Record<string, unknown> | null;
  }[] = [];
  const client = createClient("https://qa.invalid", "qa-public-fixture", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (input, init) => {
        calls.push({
          url: new URL(String(input)),
          method: init?.method ?? "GET",
          body: init?.body ? JSON.parse(String(init.body)) : null,
        });
        const next = responses.shift();
        if (!next) throw new Error("Unexpected fixture request");
        return new Response(JSON.stringify(next.data), {
          status: next.status ?? 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  });
  return { client, calls };
}
