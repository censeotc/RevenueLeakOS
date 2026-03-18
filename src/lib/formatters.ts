export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}
export function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}
export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
