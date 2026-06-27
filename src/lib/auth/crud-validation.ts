export function isPositiveCopAmount(value: string) {
  const amount = Number(value);
  return Number.isInteger(amount) && amount > 0;
}
