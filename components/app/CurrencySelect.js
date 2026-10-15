"use client";

import { LuChevronDown } from "react-icons/lu";
import { useCurrency } from "@/lib/store/CurrencyContext";
import { currencies } from "@/lib/store/currencies";
import { currencySymbol } from "@/lib/utlis";

export default function CurrencySelect({ className = "", tone = "default" }) {
  const { currency, setCurrency } = useCurrency();
  const styles =
    tone === "onDark"
      ? "bg-white/10 text-white hover:bg-white/15 border-transparent"
      : "border-line bg-surface text-fg hover:border-n-300 dark:hover:border-n-600";
  return (
    <label className={`relative inline-flex h-11 items-center rounded-full border pl-4 pr-9 text-sm font-bold transition ${styles} ${className}`}>
      <span className="sr-only">Display currency</span>
      {currency} {currencySymbol(currency) !== currency ? currencySymbol(currency) : ""}
      <LuChevronDown className="pointer-events-none absolute right-3.5" />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} · {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
