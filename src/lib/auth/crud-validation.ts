export function isPositiveCopAmount(value: string) {
  const amount = Number(value);
  return (
    /^[0-9]{1,14}$/.test(value) && Number.isSafeInteger(amount) && amount > 0
  );
}
