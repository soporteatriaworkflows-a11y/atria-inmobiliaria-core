import { describe, expect, it } from "vitest";
import { calculateMonthlyLiquidation } from "./calculate";
import { demoLiquidationInput } from "@/lib/demo-data";

describe("calculateMonthlyLiquidation", () => {
  it("calculates the provisional sanitized golden case using integer COP", () => {
    const result = calculateMonthlyLiquidation(demoLiquidationInput);

    expect(result.totalCollectionsCop).toBe(5_000_000);
    expect(result.totalPropertyExpensesCop).toBe(500_000);
    expect(result.totalGlobalExpensesCop).toBe(2_029_500);
    expect(result.totalExpensesCop).toBe(2_529_500);

    expect(result.participants).toEqual([
      expect.objectContaining({
        participantId: "ana-demo",
        totalParticipationCop: 1_235_250,
        accumulatedBalanceCop: 1_335_250,
        amountToPayCop: 1_335_250,
      }),
      expect.objectContaining({
        participantId: "carlos-demo",
        totalParticipationCop: 741_150,
        accumulatedBalanceCop: 716_150,
        amountToPayCop: 716_150,
      }),
      expect.objectContaining({
        participantId: "lucia-demo",
        totalParticipationCop: 494_100,
        accumulatedBalanceCop: 484_100,
        amountToPayCop: 484_100,
      }),
    ]);
  });

  it("rejects unsafe decimal money amounts", () => {
    expect(() =>
      calculateMonthlyLiquidation({
        ...demoLiquidationInput,
        collections: [
          { ...demoLiquidationInput.collections[0], amountCop: 100.25 },
        ],
      }),
    ).toThrow("safe integer COP");
  });
});
