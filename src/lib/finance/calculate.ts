import { assertIntegerCop } from "@/lib/money";
import type {
  BasisPoints,
  LiquidationInput,
  LiquidationResult,
  ParticipantLiquidation,
  ParticipationRule,
} from "./types";

const FULL_SHARE_BASIS_POINTS = 10_000;

function allocateAmount(
  amountCop: number,
  shares: Array<{ id: string; basisPoints: BasisPoints }>,
) {
  assertIntegerCop(amountCop, "amountCop");

  const totalBasisPoints = shares.reduce(
    (sum, share) => sum + share.basisPoints,
    0,
  );
  if (totalBasisPoints !== FULL_SHARE_BASIS_POINTS) {
    throw new Error(
      `Participation rules must sum to ${FULL_SHARE_BASIS_POINTS} basis points`,
    );
  }

  const amount = BigInt(amountCop);
  const allocations = shares.map((share) => {
    const numerator = amount * BigInt(share.basisPoints);
    const allocated = numerator / BigInt(FULL_SHARE_BASIS_POINTS);
    const remainder = numerator % BigInt(FULL_SHARE_BASIS_POINTS);
    return {
      id: share.id,
      allocated,
      remainder,
    };
  });

  const zero = BigInt(0);
  const one = BigInt(1);
  let allocatedTotal = allocations.reduce(
    (sum, item) => sum + item.allocated,
    zero,
  );
  let remaining = amount - allocatedTotal;
  const sorted = [...allocations].sort((a, b) =>
    Number(b.remainder - a.remainder),
  );

  for (const item of sorted) {
    if (remaining === zero) break;
    item.allocated += remaining > zero ? one : -one;
    remaining += remaining > zero ? -one : one;
  }

  allocatedTotal = sorted.reduce((sum, item) => sum + item.allocated, zero);
  if (allocatedTotal !== amount) {
    throw new Error("Allocation mismatch");
  }

  return new Map(sorted.map((item) => [item.id, Number(item.allocated)]));
}

function rulesForProperty(
  rules: ParticipationRule[],
  propertyId: string | null,
) {
  const propertyRules = rules.filter((rule) => rule.propertyId === propertyId);
  if (propertyRules.length > 0) {
    return propertyRules.map((rule) => ({
      id: rule.participantId,
      basisPoints: rule.basisPoints,
    }));
  }

  return rules
    .filter((rule) => rule.propertyId === null)
    .map((rule) => ({
      id: rule.participantId,
      basisPoints: rule.basisPoints,
    }));
}

function addTo(map: Map<string, number>, id: string, amountCop: number) {
  map.set(id, (map.get(id) ?? 0) + amountCop);
}

export function calculateMonthlyLiquidation(
  input: LiquidationInput,
): LiquidationResult {
  const rentalCollections = new Map<string, number>();
  const expenseParticipation = new Map<string, number>();

  for (const collection of input.collections) {
    assertIntegerCop(collection.amountCop, "collection.amountCop");
    const allocations = allocateAmount(
      collection.amountCop,
      rulesForProperty(input.participationRules, collection.propertyId),
    );
    for (const [participantId, amountCop] of allocations) {
      addTo(rentalCollections, participantId, amountCop);
    }
  }

  for (const expense of input.expenses) {
    assertIntegerCop(expense.amountCop, "expense.amountCop");
    const allocations = allocateAmount(
      expense.amountCop,
      rulesForProperty(input.participationRules, expense.propertyId),
    );
    for (const [participantId, amountCop] of allocations) {
      addTo(expenseParticipation, participantId, amountCop);
    }
  }

  const balances = new Map(
    input.balances.map((balance) => [balance.participantId, balance]),
  );

  const participants: ParticipantLiquidation[] = input.participants.map(
    (participant) => {
      const balance = balances.get(participant.id) ?? {
        participantId: participant.id,
        previousBalanceCop: 0,
        pendingPayableCop: 0,
        manualAdjustmentsCop: 0,
      };

      assertIntegerCop(balance.previousBalanceCop, "previousBalanceCop");
      assertIntegerCop(balance.pendingPayableCop, "pendingPayableCop");
      assertIntegerCop(balance.manualAdjustmentsCop, "manualAdjustmentsCop");

      const rentalCollectionsCop = rentalCollections.get(participant.id) ?? 0;
      const expenseParticipationCop =
        expenseParticipation.get(participant.id) ?? 0;
      const totalParticipationCop =
        rentalCollectionsCop - expenseParticipationCop;
      const accumulatedBalanceCop =
        totalParticipationCop +
        balance.previousBalanceCop +
        balance.pendingPayableCop +
        balance.manualAdjustmentsCop;

      return {
        participantId: participant.id,
        displayName: participant.displayName,
        rentalCollectionsCop,
        expenseParticipationCop,
        totalParticipationCop,
        previousBalanceCop: balance.previousBalanceCop,
        pendingPayableCop: balance.pendingPayableCop,
        manualAdjustmentsCop: balance.manualAdjustmentsCop,
        accumulatedBalanceCop,
        amountToPayCop: Math.max(accumulatedBalanceCop, 0),
      };
    },
  );

  const totalCollectionsCop = input.collections.reduce(
    (sum, collection) => sum + collection.amountCop,
    0,
  );
  const totalPropertyExpensesCop = input.expenses
    .filter((expense) => expense.propertyId !== null)
    .reduce((sum, expense) => sum + expense.amountCop, 0);
  const totalGlobalExpensesCop = input.expenses
    .filter((expense) => expense.propertyId === null)
    .reduce((sum, expense) => sum + expense.amountCop, 0);

  return {
    month: input.month,
    totalCollectionsCop,
    totalPropertyExpensesCop,
    totalGlobalExpensesCop,
    totalExpensesCop: totalPropertyExpensesCop + totalGlobalExpensesCop,
    participants,
    assumptions: [
      "Participaciones demo expresadas en basis points enteros; 10000 equivale a 100%.",
      "Reglas por propiedad reemplazan la regla global cuando existen.",
      "Valor a pagar provisional: saldo acumulado positivo; saldos negativos quedan pendientes de validacion.",
    ],
  };
}
