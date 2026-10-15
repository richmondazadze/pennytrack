"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { LuPlus } from "react-icons/lu";
import PageHeader from "@/components/app/PageHeader";
import { useFinance } from "@/components/app/hooks";
import { useQuickActions } from "@/components/app/QuickActions";
import { CategoryTile } from "@/components/ui/CategoryBadge";
import EmptyState from "@/components/ui/EmptyState";
import { startOfMonth, sumExpenses } from "@/lib/finance";
import { useMoney } from "@/lib/utlis";

export default function ExpensesPage() {
  const { expenses, loading } = useFinance();
  const { viewCategory, newCategory, addExpense } = useQuickActions();
  const money = useMoney();

  const { cats, total, monthTotal } = useMemo(() => {
    const month = startOfMonth();
    const cats = expenses
      .map((e) => ({
        ...e,
        total: Number(e.total) || 0,
        month: sumExpenses([e], month),
        count: e.items?.length || 0,
      }))
      .sort((a, b) => b.total - a.total);
    return {
      cats,
      total: cats.reduce((s, c) => s + c.total, 0),
      monthTotal: cats.reduce((s, c) => s + c.month, 0),
    };
  }, [expenses]);

  return (
    <>
      <PageHeader
        eyebrow={`${cats.length} ${cats.length === 1 ? "category" : "categories"}`}
        title="Expenses"
        showQuickAdd={false}
        actions={
          <>
            <button onClick={newCategory} className="btn btn-outline hidden sm:inline-flex">
              <LuPlus /> New category
            </button>
            <button onClick={() => addExpense()} className="btn btn-primary hidden md:inline-flex">
              <LuPlus /> Add expense
            </button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:gap-4">
        <div className="card p-5">
          <div className="text-sm font-semibold text-muted">All-time spend</div>
          <div className="figure mt-1 text-2xl font-bold md:text-[28px]">{money(total)}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold text-muted">This month</div>
          <div className="figure mt-1 text-2xl font-bold md:text-[28px]">{money(monthTotal)}</div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-44 rounded-lg" />)}
        </div>
      ) : cats.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No categories yet"
            body="Categories group your spending. Each one owns a colour across lists, charts and reports."
            action={<button onClick={newCategory} className="btn btn-primary btn-sm"><LuPlus /> New category</button>}
          />
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {cats.map((c) => {
            const share = total ? Math.round((c.total / total) * 100) : 0;
            return (
              <motion.button
                key={c.id}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => viewCategory(c.id)}
                className="card group p-5 text-left transition-shadow hover:shadow-overlay"
              >
                <div className="flex items-center gap-3">
                  <CategoryTile color={c.color} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold capitalize">{c.title}</div>
                    <div className="text-xs text-muted">
                      {c.count} {c.count === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <span className="badge bg-sunken text-muted">{share}%</span>
                </div>
                <div className="figure mt-5 text-[26px] font-bold leading-none">{money(c.total)}</div>
                <div className="mt-1 text-sm text-muted">
                  <span className="amount">{money(c.month)}</span> this month
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sunken">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: c.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(share, 2)}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  />
                </div>
              </motion.button>
            );
          })}
          <motion.button
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            onClick={newCategory}
            className="flex min-h-[176px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line text-muted transition hover:border-forest hover:text-forest dark:hover:border-lime dark:hover:text-lime"
          >
            <LuPlus className="text-2xl" />
            <span className="font-semibold">New category</span>
          </motion.button>
        </motion.div>
      )}
    </>
  );
}
