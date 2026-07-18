import type { CurrencyCode, CurrencyMeta } from "./types";

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE" },
  UZS: { code: "UZS", symbol: "so'm", label: "Uzbek Som", locale: "uz-UZ" },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB" },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

/**
 * Format a number as currency for the given code. UZS has no minor unit in
 * everyday use, so it's rendered without decimals.
 */
export function formatCurrency(amount: number, code: CurrencyCode): string {
  const meta = CURRENCIES[code];
  const maximumFractionDigits = code === "UZS" ? 0 : 2;

  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: code,
      maximumFractionDigits,
      minimumFractionDigits: code === "UZS" ? 0 : 0,
    }).format(amount);
  } catch {
    return `${meta.symbol}${amount.toLocaleString(undefined, { maximumFractionDigits })}`;
  }
}

/** Format a plain number with locale-aware thousands separators. */
export function formatNumber(amount: number, code: CurrencyCode = "USD"): string {
  const meta = CURRENCIES[code];
  const maximumFractionDigits = code === "UZS" ? 0 : 2;
  return new Intl.NumberFormat(meta.locale, { maximumFractionDigits }).format(amount);
}
