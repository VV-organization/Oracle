export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'USDC' | 'BTC' | 'ETH' | 'SOL' | 'XRP';
export type Account = { currency: Currency; kind: 'fiat' | 'crypto'; units: string; decimals: number; nodeId: string };
export type Operation = { id: string; currency: Currency; kind: 'receiving' | 'transfer' | 'funding'; status: 'pending' | 'unknown' | 'completed'; units: string; decimals: number; positive: boolean; date: string; recipient?: string; showId?: boolean; showAccount?: boolean; nodeId?: string };
export type Dashboard = { owner: string; accounts: Account[]; operations: Operation[] };

export function toggleAccount(current: Currency | null, clicked: Currency): Currency | null {
  return current === clicked ? null : clicked;
}
export function filterOperations(operations: readonly Operation[], currency: Currency | null) {
  return currency ? operations.filter(operation => operation.currency === currency) : [...operations];
}
// Decimal strings avoid converting balances to binary floating-point numbers.
export function formatAmount(units: string, decimals: number, currency: Currency, locale: 'ru' | 'en' = 'ru') {
  const digits = units.padStart(decimals + 1, '0');
  const integer = decimals ? digits.slice(0, -decimals) : digits;
  const fraction = decimals ? digits.slice(-decimals) : '';
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, locale === 'ru' ? ' ' : ',');
  return `${grouped}${decimals ? (locale === 'ru' ? ',' : '.') + fraction : ''} ${currency}`;
}
