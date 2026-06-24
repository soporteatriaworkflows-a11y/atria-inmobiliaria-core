export function formatCop(amountCop: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amountCop);
}

export function assertIntegerCop(amountCop: number, label: string): void {
  if (!Number.isSafeInteger(amountCop)) {
    throw new Error(`${label} must be a safe integer COP amount`);
  }
}
