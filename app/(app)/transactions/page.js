"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuSearch } from "react-icons/lu";
import PageHeader from "@/components/app/PageHeader";
import TransactionRow from "@/components/app/TransactionRow";
import { useFinance, useTransactions } from "@/components/app/hooks";
import { useQuickActions } from "@/components/app/QuickActions";
import Segmented from "@/components/ui/Segmented";
import EmptyState from "@/components/ui/EmptyState";
import { relativeDay, startOfDay } from "@/lib/finance";
import { useMoney } from "@/lib/utlis";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

export default function TransactionsPage() {
  const transactions = useTransactions();
  const { loading } = useFinance();
  const { viewCategory, addExpense } = useQuickActions();
  const money = useMoney();
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const rows = transactions.filter(
      (t) =>
        (filter === "all" || t.kind === filter) &&
        (!term || t.title.toLowerCase().includes(term) || t.category.toLowerCase().includes(term))
    );
    const map = new Map();
    rows.forEach((t) => {
      const key = t.date ? startOfDay(t.date).getTime() : 0;
      if (!map.has(key)) map.set(key, { key, date: t.date, rows: [], net: 0 });
      const g = map.get(key);
      g.rows.push(t);
      g.net += t.kind === "income" ? t.amount : -t.amount;
    });
    return [...map.values()];
  }, [transactions, filter, q]);

  return (
    <>
      <PageHeader eyebrow={`${transactions.length} transactions`} title="Transactions" />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <LuSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input rounded-full pl-11"
            placeholder="Search by note or category"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <Segmented id="tx-filter" options={FILTERS} value={filter} onChange={setFilter} className="w-full sm:w-auto" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-16" />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="card">
          <EmptyState
            title={transactions.length ? "No matches" : "No transactions yet"}
            body={transactions.length ? "Try a different search or filter." : "Add your first expense to see where money goes."}
            action={!transactions.length && <button onClick={() => addExpense()} className="btn btn-primary btn-sm">Add expense</button>}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {groups.map((g, i) => (
              <motion.section
                key={g.key}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                className="card overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-line bg-sunken/50 px-5 py-2.5 text-[13px] font-semibold">
                  <span className="text-muted">
                    {g.date ? relativeDay(g.date) : "No date"}
                    {g.date && (
                      <span className="ml-1.5 font-medium text-n-400">
                        {g.date.toLocaleDateString("en-GB", { weekday: "long" })}
                      </span>
                    )}
                  </span>
                  <span className={`amount ${g.net >= 0 ? "text-income" : "text-muted"}`}>{money(g.net, { sign: true })}</span>
                </div>
                <div className="p-2 md:p-3">
                  {g.rows.map((tx) => (
                    <TransactionRow
                      key={tx.key}
                      tx={tx}
                      showDate={false}
                      onClick={tx.kind === "expense" ? () => viewCategory(tx.categoryId) : undefined}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
