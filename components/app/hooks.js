"use client";

import { useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-context";
import { useCurrency } from "@/lib/store/CurrencyContext";
import { generateReport } from "@/lib/report";
import { buildTransactions } from "@/lib/finance";

export function useFinance() {
  return useContext(financeContext);
}

export function useTransactions() {
  const { income, expenses } = useFinance();
  return useMemo(() => buildTransactions(income, expenses), [income, expenses]);
}

export function useBalance() {
  const { income, expenses } = useFinance();
  return useMemo(
    () =>
      income.reduce((t, i) => t + (Number(i.amount) || 0), 0) -
      expenses.reduce((t, e) => t + (Number(e.total) || 0), 0),
    [income, expenses]
  );
}

// Returns a function that downloads the PDF report, with the usual toasts.
export function useDownloadReport() {
  const { user } = useContext(authContext);
  const { income, expenses } = useFinance();
  const { currency } = useCurrency();
  return async () => {
    if (!user) {
      toast.error("You must be logged in to request a report.");
      return;
    }
    if (income.length === 0 && expenses.length === 0) {
      toast.warning("Add an income or expense first, then download your report.");
      return;
    }
    try {
      await generateReport({ user, income, expenses, currency });
      toast.success("Report downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't create the report. Please try again.");
    }
  };
}
