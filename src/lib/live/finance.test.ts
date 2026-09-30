import { describe, expect, it } from "vitest";
import { context, fixture } from "./test-fixture";
import {
  createFinance,
  financeInput,
  listFinance,
  propertyOptions,
  periodMonth,
} from "./finance";
const input = { amount: "250000", month: "2026-09", propertyId: "qa-property" };

describe("live finance", () => {
  it.each([
    "",
    "0",
    "-1",
    "1.1",
    "1e3",
    "0x10",
    "1,000",
    " 10 ",
    "100000000000000",
    "9007199254740993",
  ])("rejects invalid COP amount %s before HTTP", async (amount) => {
    const { client, calls } = fixture();
    await expect(
      createFinance(client, context, "income", { ...input, amount }),
    ).rejects.toThrow("monto");
    expect(calls).toHaveLength(0);
  });
  it("accepts maximum exact NUMERIC(14,0) COP", () => {
    expect(
      financeInput("income", { ...input, amount: "99999999999999" }).amount_cop,
    ).toBe(99999999999999);
  });
  it.each(["2026-00", "2026-13", "0000-01", "2026-09-02", "", "2026-9"])(
    "rejects invalid monthly period %s",
    (month) => {
      expect(() => periodMonth(month)).toThrow("periodo");
    },
  );
  it("uses the first day for the selected month", () => {
    expect(periodMonth("2026-09")).toBe("2026-09-01");
  });
  it.each(["platform_admin", "estate_admin", "accountant"] as const)(
    "allows %s draft income within active organization",
    async (role) => {
      const { client, calls } = fixture([
        { data: { id: "qa-property" } },
        { data: { id: "qa-income" } },
      ]);
      expect(
        await createFinance(client, { ...context, role }, "income", input),
      ).toBe("qa-income");
      expect(calls[0].url.searchParams.get("organization_id")).toBe(
        "eq.qa-org",
      );
      expect(calls[0].url.searchParams.get("id")).toBe("eq.qa-property");
      expect(calls[1].body).toEqual({
        organization_id: "qa-org",
        property_id: "qa-property",
        period_month: "2026-09-01",
        amount_cop: 250000,
        status: "draft",
        source: "manual",
      });
    },
  );
  it.each(["income", "expenses"] as const)(
    "blocks owner writes to %s",
    async (kind) => {
      const { client, calls } = fixture();
      await expect(
        createFinance(
          client,
          { ...context, role: "owner_readonly" },
          kind,
          input,
        ),
      ).rejects.toThrow("permiso");
      expect(calls).toHaveLength(0);
    },
  );
  it("requires explicit income property", () => {
    expect(() => financeInput("income", { ...input, propertyId: "" })).toThrow(
      "propiedad",
    );
  });
  it("rejects deleted, invisible or foreign organization property before insert", async () => {
    const { client, calls } = fixture([{ data: null }]);
    await expect(
      createFinance(client, context, "income", input),
    ).rejects.toThrow("organización");
    expect(calls).toHaveLength(1);
  });
  it.each(["income", "expenses"] as const)(
    "scopes and paginates %s reads",
    async (kind) => {
      const { client, calls } = fixture([{ data: [] }]);
      expect(await listFinance(client, context, kind, 1)).toEqual({
        rows: [],
        hasNext: false,
      });
      expect(calls[0].url.pathname).toContain(
        kind === "income" ? "rent_collections" : "expenses",
      );
      expect(calls[0].url.searchParams.get("organization_id")).toBe(
        "eq.qa-org",
      );
      expect(calls[0].url.searchParams.get("offset")).toBe("25");
    },
  );
  it("loads all property options across pages", async () => {
    const { client, calls } = fixture([
      { data: Array.from({ length: 100 }, (_, i) => ({ id: String(i) })) },
      { data: [{ id: "last" }] },
    ]);
    expect(await propertyOptions(client, context)).toHaveLength(101);
    expect(calls[1].url.searchParams.get("offset")).toBe("100");
    expect(
      calls.every(
        (c) => c.url.searchParams.get("organization_id") === "eq.qa-org",
      ),
    ).toBe(true);
  });
  it("creates global expense with null property despite stale selection", async () => {
    const { client, calls } = fixture([{ data: { id: "qa-expense" } }]);
    await createFinance(client, context, "expenses", {
      ...input,
      scope: "global",
      description: " QA global ",
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].body).toEqual({
      organization_id: "qa-org",
      property_id: null,
      period_month: "2026-09-01",
      amount_cop: 250000,
      status: "draft",
      category: "global",
      description: "QA global",
    });
  });
  it("creates property expense using existing category", async () => {
    const { client, calls } = fixture([
      { data: { id: "qa-property" } },
      { data: { id: "qa-expense" } },
    ]);
    await createFinance(
      client,
      { ...context, role: "accountant" },
      "expenses",
      { ...input, scope: "property", description: "QA property expense" },
    );
    expect(calls[1].body).toMatchObject({
      property_id: "qa-property",
      category: "property",
      status: "draft",
    });
  });
  it("validates description and expense scope", () => {
    expect(() =>
      financeInput("expenses", { ...input, scope: "global", description: " " }),
    ).toThrow("descripción");
    expect(() => financeInput("expenses", input)).toThrow("alcance");
    expect(() =>
      financeInput("expenses", {
        ...input,
        propertyId: "",
        scope: "property",
        description: "QA",
      }),
    ).toThrow("propiedad");
  });
  it.each(["income", "expenses"] as const)(
    "surfaces %s write and read errors",
    async (kind) => {
      const { client } = fixture([
        { data: { id: "qa-property" } },
        { data: { code: "42501", message: "QA" }, status: 403 },
        { data: { code: "42501", message: "QA" }, status: 403 },
      ]);
      await expect(
        createFinance(client, context, kind, {
          ...input,
          scope: "property",
          description: "QA",
        }),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(listFinance(client, context, kind)).rejects.toMatchObject({
        code: "42501",
      });
    },
  );
});
