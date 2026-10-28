export const SALE_PERCENT = 20;

export function listPrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, '')) || 0;
}

export function salePrice(price: string): number {
  return Math.round(listPrice(price) * (100 - SALE_PERCENT)) / 100;
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}
