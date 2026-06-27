import { describe, expect, it } from "vitest";
import { isPositiveCopAmount } from "./crud-validation";

describe("CRUD validation", () => {
  it("accepts positive integer COP amounts", () => {
    expect(isPositiveCopAmount("1")).toBe(true);
    expect(isPositiveCopAmount("250000")).toBe(true);
  });

  it("rejects empty, zero, negative, decimal and non numeric amounts", () => {
    expect(isPositiveCopAmount("")).toBe(false);
    expect(isPositiveCopAmount("0")).toBe(false);
    expect(isPositiveCopAmount("-1")).toBe(false);
    expect(isPositiveCopAmount("1.5")).toBe(false);
    expect(isPositiveCopAmount("demo")).toBe(false);
  });
});
