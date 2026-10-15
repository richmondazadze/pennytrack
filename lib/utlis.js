// Money formatting. Pure functions: pass the currency in, or use useMoney().
import { useCurrency } from "./store/CurrencyContext";

const formatters = new Map();

function getFormatter(currency, digits) {
  const key = `${currency}:${digits}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    );
  }
  return formatters.get(key);
}

// formatCurrency(1240, "GHS") -> "₵1,240.00"
// options.sign: prefix "+" for positive and "−" for negative amounts
// options.whole: drop the decimals (for compact cards and chart labels)
export function formatCurrency(amount, currency = "GHS", options = {}) {
  const value = Number(amount) || 0;
  const digits = options.whole ? 0 : 2;
  const text = getFormatter(currency, digits)
    .formatToParts(Math.abs(value))
    .map((p) => (p.type === "currency" ? displaySymbol(p.value, currency) : p.value))
    .join("");
  if (value < 0) return `−${text}`;
  if (options.sign && value > 0) return `+${text}`;
  return text;
}

// Ghana cedi uses the bare ₵ in the design system. Browsers disagree on whether
// they render it as "GH₵" or "GHS", so it is set explicitly.
function displaySymbol(symbol, currency) {
  return currency === "GHS" ? "₵" : symbol;
}

export function currencySymbol(currency = "GHS") {
  const parts = getFormatter(currency, 0).formatToParts(0);
  return displaySymbol(parts.find((p) => p.type === "currency")?.value || currency, currency);
}

// Hook: returns a formatter bound to the selected currency.
export function useMoney() {
  const { currency } = useCurrency();
  return (amount, options) => formatCurrency(amount, currency, options);
}
