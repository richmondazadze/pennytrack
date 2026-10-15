"use client";

import { useCurrency } from "@/lib/store/CurrencyContext";
import { currencySymbol } from "@/lib/utlis";

// Large amount entry from the design system: symbol, whole part, faded decimals.
export function sanitizeAmount(raw) {
  let v = raw.replace(/[^\d.]/g, "");
  const dot = v.indexOf(".");
  if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, "").slice(0, 2);
  if (v.startsWith(".")) v = "0" + v;
  return v.slice(0, 12);
}

export default function AmountInput({ value, onChange, label = "Amount", autoFocus, id = "amount" }) {
  const { currency } = useCurrency();
  const symbol = currencySymbol(currency);
  const [whole, decimals] = value.split(".");
  const shownDecimals = value.includes(".") ? (decimals || "").padEnd(2, "0") : "00";

  return (
    <label htmlFor={id} className="block cursor-text rounded-lg bg-sunken px-4 py-5 text-center">
      <span className="text-sm font-semibold text-muted">{label}</span>
      <span className="relative mt-1 flex items-baseline justify-center gap-2">
        <span className="figure text-[34px] font-bold text-fg">{symbol}</span>
        <span className="figure text-[44px] font-bold leading-none text-fg">
          {whole ? Number(whole).toLocaleString("en-US") : "0"}
          <span className="text-n-300 dark:text-n-600">.{shownDecimals}</span>
        </span>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(sanitizeAmount(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-text text-base opacity-0"
          aria-label={`${label} in ${currency}`}
        />
      </span>
      <span className="mt-2 inline-flex rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-bold text-muted">
        {currency}
      </span>
    </label>
  );
}
