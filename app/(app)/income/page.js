"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import PageHeader from "@/components/app/PageHeader";
import TransactionRow from "@/components/app/TransactionRow";
import { useFinance, useTransactions } from "@/components/app/hooks";
import { useQuickActions } from "@/components/app/QuickActions";
import EmptyState from "@/components/ui/EmptyState";
import { startOfMonth, sumIncome } from "@/lib/finance";
import { useMoney } from "@/lib/utlis";

export default function IncomePage() {
  const { income, removeIncomeItem, loading } = useFinance();
  const all = useTransactions();
  const { addIncome } = useQuickActions();
  const money = useMoney();
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(() => all.filter((t) => t.kind === "income"), [all]);
  const months = useMemo(() => {
    const map = new Map();
    rows.forEach((t) => {
      const label = t.date ? t.date.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "No date";
      if (!map.has(label)) map.set(label, { label, rows: [], total: 0 });
      map.get(label).rows.push(t);
      map.get(label).total += t.amount;
    });
    return [...map.values()];
  }, [rows]);

  const stats = useMemo(() => {
    const m = startOfMonth();
    const last = startOfMonth(new Date(), -1);
    return {
      total: sumIncome(income),
      month: sumIncome(income, m),
      last: sumIncome(income, last, m),
    };
  }, [income]);

  const deleteIncomeEntryHandler = async (incomeId) => {
    setDeleting(incomeId);
    try {
      await removeIncomeItem(incomeId);
      toast.success("Income deleted");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={`${rows.length} ${rows.length === 1 ? "entry" : "entries"}`}
        title="Income"
        showQuickAdd={false}
        actions={
          <button onClick={addIncome} className="btn btn-lime hidden sm:inline-flex">
            <LuPlus /> Add income
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <div className="col-span-2 rounded-lg bg-forest p-5 text-white md:col-span-1">
          <div className="text-sm font-semibold text-lime">All-time income</div>
          <div className="figure mt-1 text-[28px] font-bold">{money(stats.total)}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold text-muted">This month</div>
          <div className="figure mt-1 text-xl font-bold md:text-[28px]">{money(stats.month)}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold text-muted">Last month</div>
          <div className="figure mt-1 text-xl font-bold md:text-[28px]">{money(stats.last)}</div>
        </div>
      </div>

      <button onClick={addIncome} className="btn btn-lime mb-5 w-full sm:hidden">
        <LuPlus /> Add income
      </button>

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-16" />)}</div>
      ) : rows.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No income yet"
            body="Add your salary or any money coming in to see your balance."
            action={<button onClick={addIncome} className="btn btn-lime btn-sm"><LuPlus /> Add income</button>}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {months.map((m) => (
            <section key={m.label} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line bg-sunken/50 px-5 py-2.5 text-[13px] font-semibold text-muted">
                <span>{m.label}</span>
                <span className="amount text-income">{money(m.total, { sign: true })}</span>
              </div>
              <ul className="p-2 md:p-3">
                <AnimatePresence initial={false}>
                  {m.rows.map((tx) => (
                    <motion.li
                      key={tx.key}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <TransactionRow
                        tx={tx}
                        trailing={
                          <button
                            onClick={() => deleteIncomeEntryHandler(tx.id)}
                            disabled={deleting === tx.id}
                            className="icon-btn h-9 w-9 hover:bg-expense/10 hover:text-expense"
                            aria-label={`Delete ${tx.title}`}
                          >
                            <LuTrash2 />
                          </button>
                        }
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
