import { describe, expect, it } from "vitest";
import { createProperty, listProperties, propertyInput } from "./properties";
import { context, fixture } from "./test-fixture";
import { operationError } from "./shared";

describe("live properties HTTP boundary", () => {
  it("reads only the active organization with stable pagination", async () => {
    const rows = Array.from({ length: 26 }, (_, i) => ({
      id: String(i),
      code: "QA",
      display_name: "QA",
      status: "active",
    }));
    const { client, calls } = fixture([{ data: rows }]);
    const result = await listProperties(client, context, 1);
    expect(result.rows).toHaveLength(25);
    expect(result.hasNext).toBe(true);
    expect(calls[0].url.searchParams.get("organization_id")).toBe("eq.qa-org");
    expect(calls[0].url.searchParams.get("offset")).toBe("25");
    expect(calls[0].url.searchParams.get("limit")).toBe("26");
    expect(calls[0].url.searchParams.get("order")).toBe(
      "display_name.asc,id.asc",
    );
  });
  it("represents an empty successful read", async () => {
    const { client } = fixture([{ data: [] }]);
    expect(await listProperties(client, context)).toEqual({
      rows: [],
      hasNext: false,
    });
  });
  it.each(["platform_admin", "estate_admin"] as const)(
    "allows %s to create and confirms the persisted id",
    async (role) => {
      const { client, calls } = fixture([{ data: { id: "qa-created" } }]);
      expect(
        await createProperty(
          client,
          { ...context, role },
          " QA property ",
          " QA-1 ",
        ),
      ).toBe("qa-created");
      expect(calls[0].method).toBe("POST");
      expect(calls[0].body).toEqual({
        display_name: "QA property",
        code: "QA-1",
        organization_id: "qa-org",
        status: "active",
      });
    },
  );
  it.each(["accountant", "owner_readonly"] as const)(
    "blocks %s writes before HTTP",
    async (role) => {
      const { client, calls } = fixture();
      await expect(
        createProperty(client, { ...context, role }, "QA", "QA"),
      ).rejects.toThrow("permiso");
      expect(calls).toHaveLength(0);
    },
  );
  it.each([
    [" ", "QA"],
    ["QA", " "],
  ])("rejects blank fields", (name, code) => {
    expect(() => propertyInput(name, code)).toThrow("Completa");
  });
  it("propagates read failures instead of reporting empty", async () => {
    const { client } = fixture([
      { data: { code: "42501", message: "fixture" }, status: 403 },
    ]);
    await expect(listProperties(client, context)).rejects.toMatchObject({
      code: "42501",
    });
  });
  it("propagates duplicates and never exposes database details", async () => {
    const { client } = fixture([
      {
        data: { code: "23505", message: "private fixture detail" },
        status: 409,
      },
    ]);
    try {
      await createProperty(client, context, "QA", "QA");
      throw new Error("expected failure");
    } catch (error) {
      expect(operationError(error, "create")).toContain("Ya existe");
      expect(operationError(error, "create")).not.toContain("private");
    }
  });
  it("does not claim success without a confirmed insert", async () => {
    const { client } = fixture([{ data: null }]);
    await expect(createProperty(client, context, "QA", "QA")).rejects.toThrow();
  });
  it("blocks missing session or organization", async () => {
    const { client, calls } = fixture();
    await expect(
      listProperties(client, { ...context, organizationId: "" }),
    ).rejects.toThrow("permiso");
    await expect(
      createProperty(client, { ...context, userId: "" }, "QA", "QA"),
    ).rejects.toThrow("permiso");
    expect(calls).toHaveLength(0);
  });
});
