import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(() => ({ auth: {} })),
  getConfig: vi.fn(() => ({
    isConfigured: true,
    url: "https://fixture.supabase.test",
    publishableKey: "fixture-public-key",
  })),
}));

vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
vi.mock("@/lib/app-config", () => ({
  getSupabasePublicConfig: mocks.getConfig,
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

afterEach(() => vi.unstubAllGlobals());

describe("Supabase Auth client lifecycle", () => {
  it("reuses one browser client so membership refreshes cannot rebroadcast sign-in", async () => {
    vi.stubGlobal("window", {});
    const { createSupabaseBrowserClient } = await import("./client");
    const authClient = createSupabaseBrowserClient();
    for (let refresh = 0; refresh < 20; refresh++) {
      expect(createSupabaseBrowserClient()).toBe(authClient);
    }
    expect(mocks.createClient).toHaveBeenCalledTimes(1);
  });

  it("does not share a session-bearing client across server requests", async () => {
    const { createSupabaseBrowserClient } = await import("./client");
    expect(createSupabaseBrowserClient()).not.toBe(
      createSupabaseBrowserClient(),
    );
    expect(mocks.createClient).toHaveBeenCalledTimes(2);
  });

  it("rejects missing public configuration before creating a client", async () => {
    mocks.getConfig.mockReturnValueOnce({
      isConfigured: false,
      url: "",
      publishableKey: "",
    });
    const { createSupabaseBrowserClient } = await import("./client");
    expect(() => createSupabaseBrowserClient()).toThrow("Faltan NEXT_PUBLIC");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });
});
