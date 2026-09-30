import { describe, expect, it } from "vitest";
import { context, fixture } from "./test-fixture";
import { createRequest, listRequests } from "./requests";
describe("live requests", () => {
  it.each(["platform_admin", "estate_admin", "accountant"] as const)(
    "reads organization requests as %s without client-side owner restriction",
    async (role) => {
      const { client, calls } = fixture([{ data: [] }]);
      expect(await listRequests(client, { ...context, role }, 1)).toEqual({
        rows: [],
        hasNext: false,
      });
      expect(calls[0].url.searchParams.get("organization_id")).toBe(
        "eq.qa-org",
      );
      expect(calls[0].url.searchParams.has("requested_by")).toBe(false);
      expect(calls[0].url.searchParams.get("offset")).toBe("25");
    },
  );
  it("restricts owner reads to self as well as active organization", async () => {
    const { client, calls } = fixture([{ data: [] }]);
    await listRequests(client, { ...context, role: "owner_readonly" });
    expect(calls[0].url.searchParams.get("requested_by")).toBe("eq.qa-user");
    expect(calls[0].url.searchParams.get("organization_id")).toBe("eq.qa-org");
  });
  it.each(["platform_admin", "estate_admin", "owner_readonly"] as const)(
    "creates pending request for authenticated %s, never arbitrary requester",
    async (role) => {
      const { client, calls } = fixture([{ data: { id: "qa-request" } }]);
      expect(
        await createRequest(client, { ...context, role }, " QA adjustment "),
      ).toBe("qa-request");
      expect(calls[0].body).toEqual({
        organization_id: "qa-org",
        requested_by: "qa-user",
        request_type: "adjustment",
        status: "pending_review",
        details: { resumen: "QA adjustment", origen: "ui" },
      });
    },
  );
  it("preserves accountant read-only permissions", async () => {
    const { client, calls } = fixture();
    await expect(
      createRequest(client, { ...context, role: "accountant" }, "QA"),
    ).rejects.toThrow("permiso");
    expect(calls).toHaveLength(0);
  });
  it("rejects blank detail before HTTP", async () => {
    const { client, calls } = fixture();
    await expect(createRequest(client, context, " \n ")).rejects.toThrow(
      "detalle",
    );
    expect(calls).toHaveLength(0);
  });
  it("does not mask read errors as empty records", async () => {
    const { client } = fixture([
      { data: { code: "42501", message: "QA" }, status: 403 },
    ]);
    await expect(listRequests(client, context)).rejects.toMatchObject({
      code: "42501",
    });
  });
  it("propagates rejected writes", async () => {
    const { client } = fixture([
      { data: { code: "42501", message: "QA" }, status: 403 },
    ]);
    await expect(createRequest(client, context, "QA")).rejects.toMatchObject({
      code: "42501",
    });
  });
  it("requires an insert confirmation", async () => {
    const { client } = fixture([{ data: null }]);
    await expect(createRequest(client, context, "QA")).rejects.toThrow();
  });
});
