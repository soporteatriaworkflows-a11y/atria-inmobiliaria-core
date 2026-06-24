export type BasisPoints = number;

export type Participant = {
  id: string;
  displayName: string;
  roleLabel: string;
};

export type Property = {
  id: string;
  name: string;
};

export type RentCollection = {
  id: string;
  propertyId: string;
  amountCop: number;
  status: "posted";
};

export type Expense = {
  id: string;
  propertyId: string | null;
  amountCop: number;
  category: "property" | "global";
  status: "posted";
};

export type ParticipationRule = {
  participantId: string;
  propertyId: string | null;
  basisPoints: BasisPoints;
};

export type ParticipantBalanceInput = {
  participantId: string;
  previousBalanceCop: number;
  pendingPayableCop: number;
  manualAdjustmentsCop: number;
};

export type LiquidationInput = {
  month: string;
  participants: Participant[];
  properties: Property[];
  collections: RentCollection[];
  expenses: Expense[];
  participationRules: ParticipationRule[];
  balances: ParticipantBalanceInput[];
};

export type ParticipantLiquidation = {
  participantId: string;
  displayName: string;
  rentalCollectionsCop: number;
  expenseParticipationCop: number;
  totalParticipationCop: number;
  previousBalanceCop: number;
  pendingPayableCop: number;
  manualAdjustmentsCop: number;
  accumulatedBalanceCop: number;
  amountToPayCop: number;
};

export type LiquidationResult = {
  month: string;
  totalCollectionsCop: number;
  totalPropertyExpensesCop: number;
  totalGlobalExpensesCop: number;
  totalExpensesCop: number;
  participants: ParticipantLiquidation[];
  assumptions: string[];
};
