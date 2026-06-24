import { calculateMonthlyLiquidation } from "@/lib/finance/calculate";
import type { LiquidationInput } from "@/lib/finance/types";

export const demoLiquidationInput: LiquidationInput = {
  month: "2026-06",
  participants: [
    {
      id: "ana-demo",
      displayName: "Participante Demo A",
      roleLabel: "Propietaria",
    },
    {
      id: "carlos-demo",
      displayName: "Participante Demo B",
      roleLabel: "Heredero",
    },
    {
      id: "lucia-demo",
      displayName: "Participante Demo C",
      roleLabel: "Heredera",
    },
  ],
  properties: [
    { id: "prop-demo-1", name: "Apartamento Demo Norte" },
    { id: "prop-demo-2", name: "Local Demo Centro" },
  ],
  collections: [
    {
      id: "rent-demo-1",
      propertyId: "prop-demo-1",
      amountCop: 3_000_000,
      status: "posted",
    },
    {
      id: "rent-demo-2",
      propertyId: "prop-demo-2",
      amountCop: 2_000_000,
      status: "posted",
    },
  ],
  expenses: [
    {
      id: "expense-demo-1",
      propertyId: "prop-demo-1",
      amountCop: 300_000,
      category: "property",
      status: "posted",
    },
    {
      id: "expense-demo-2",
      propertyId: "prop-demo-2",
      amountCop: 200_000,
      category: "property",
      status: "posted",
    },
    {
      id: "expense-demo-admin",
      propertyId: null,
      amountCop: 1_107_000,
      category: "global",
      status: "posted",
    },
    {
      id: "expense-demo-accountant",
      propertyId: null,
      amountCop: 922_500,
      category: "global",
      status: "posted",
    },
  ],
  participationRules: [
    { participantId: "ana-demo", propertyId: null, basisPoints: 5_000 },
    { participantId: "carlos-demo", propertyId: null, basisPoints: 3_000 },
    { participantId: "lucia-demo", propertyId: null, basisPoints: 2_000 },
  ],
  balances: [
    {
      participantId: "ana-demo",
      previousBalanceCop: 100_000,
      pendingPayableCop: 0,
      manualAdjustmentsCop: 0,
    },
    {
      participantId: "carlos-demo",
      previousBalanceCop: -50_000,
      pendingPayableCop: 25_000,
      manualAdjustmentsCop: 0,
    },
    {
      participantId: "lucia-demo",
      previousBalanceCop: 0,
      pendingPayableCop: 0,
      manualAdjustmentsCop: -10_000,
    },
  ],
};

export const demoLiquidation =
  calculateMonthlyLiquidation(demoLiquidationInput);
