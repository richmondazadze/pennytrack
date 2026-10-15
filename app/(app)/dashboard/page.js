"use client";

import { useContext, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuPlus } from "react-icons/lu";
import { authContext } from "@/lib/store/auth-context";
import { useMoney } from "@/lib/utlis";
import {
  firstName,
  greeting,
  pctChange,
  spendingByCategory,
  startOfMonth,
  sumExpenses,
  sumIncome,
} from "@/lib/finance";
import PageHeader, { Card } from "@/components/app/PageHeader";
import CategoryRow from "@/components/app/CategoryRow";
import TransactionRow from "@/components/app/TransactionRow";
import CurrencySelect from "@/components/app/CurrencySelect";
import { useBalance, useFinance, useTransactions } from "@/components/app/hooks";
import { useQuickActions } from "@/components/app/QuickActions";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import EmptyState from "@/components/ui/EmptyState";
import Donut, { DonutLegend } from "@/components/charts/Donut";

function Trend({ value, goodWhenUp = true, suffix = "vs last month", tone = "light" }) {
  if (value === null) return null;
  const up = value >= 0;
  const good = up === goodWhenUp;
  const cls =
    tone === "dark"
      ? "bg-white/10 text-lime"
      : good
      ? "bg-income/10 text-income"
      : "bg-expense/10 text-expense";
  return (
    <span className={`badge ${cls}`}>
      {up ? "▲" : "▼"} {Math.abs(value)}% {suffix}
    </span>
  );
}

function StatCard({ label, value, trend, dark, delay }) {
  const money = useMoney();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-lg p-6 ${dark ? "bg-forest text-white" : "card"}`}
    >
      <div className={`text-sm font-semibold ${dark ? "text-lime" : "text-muted"}`}>{label}</div>
      <AnimatedNumber value={value} format={(v) => money(v)} className="figure mt-2 block text-[32px] font-bold leading-tight lg:text-[34px]" />
      <div className="mt-3 h-6">{trend}</div>
    </motion.div>
  );
}

function MobileBalanceCard({ balance, incomeTotal, expenseTotal }) {
  const money = useMoney();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl bg-forest p-5 text-white md:hidden"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/10 blur-2xl" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-lime">Total balance</span>
        <CurrencySelect tone="onDark" className="h-8 pl-3 pr-8 text-xs" />
      </div>
      <AnimatedNumber value={balance} format={(v) => money(v)} className="figure mt-2 block text-[36px] font-bold leading-tight" />
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-md bg-white/[.07] px-3.5 py-3">
          <div className="text-xs text-white/70">Income</div>
          <div className="figure mt-0.5 font-bold text-lime">{money(incomeTotal, { whole: true })}</div>
        </div>
        <div className="rounded-md bg-white/[.07] px-3.5 py-3">
          <div className="text-xs text-white/70">Expenses</div>
          <div className="figure mt-0.5 font-bold">{money(expenseTotal, { whole: true })}</div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-[150px] rounded-lg" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="skeleton h-[380px] rounded-lg lg:col-span-3" />
        <div className="skeleton h-[380px] rounded-lg lg:col-span-2" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useContext(authContext);
  const { income, expenses, loading } = useFinance();
  const balance = useBalance();
  const transactions = useTransactions();
  const money = useMoney();
  const { addExpense, addIncome, viewCategory } = useQuickActions();

  const stats = useMemo(() => {
    const thisMonth = startOfMonth();
    const lastMonth = startOfMonth(new Date(), -1);
    const incomeTotal = income.reduce((t, i) => t + (Number(i.amount) || 0), 0);
    const expenseTotal = expenses.reduce((t, e) => t + (Number(e.total) || 0), 0);
    const incThis = sumIncome(income, thisMonth);
    const incLast = sumIncome(income, lastMonth, thisMonth);
    const expThis = sumExpenses(expenses, thisMonth);
    const expLast = sumExpenses(expenses, lastMonth, thisMonth);
    return {
      incomeTotal,
      expenseTotal,
      incomeTrend: pctChange(incThis, incLast),
      expenseTrend: pctChange(expThis, expLast),
      netThisMonth: incThis - expThis,
      monthSpend: spendingByCategory(expenses, thisMonth),
      monthSpendTotal: expThis,
    };
  }, [income, expenses]);

  const categories = useMemo(
    () =>
      [...expenses]
        .map((e) => ({ ...e, total: Number(e.total) || 0, count: e.items?.length || 0 }))
        .sort((a, b) => b.total - a.total),
    [expenses]
  );
  const maxCategory = categories[0]?.total || 0;
  const now = new Date();
  const monthName = now.toLocaleDateString("en-GB", { month: "long" });

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <span className="md:hidden">{greeting()}</span>
            <span className="hidden md:inline">
              {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </>
        }
        title={
          <>
            <span className="hidden md:inline">{greeting()}, </span>
            {firstName(user?.displayName) || "there"}
          </>
        }
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-5 md:space-y-6">
          <MobileBalanceCard balance={balance} incomeTotal={stats.incomeTotal} expenseTotal={stats.expenseTotal} />

          <div className="hidden gap-4 md:grid md:grid-cols-3">
            <StatCard
              dark
              label="Total balance"
              value={balance}
              delay={0}
              trend={
                <span className="badge bg-white/10 text-lime">
                  {money(stats.netThisMonth, { sign: true })} this month
                </span>
              }
            />
            <StatCard label="Income" value={stats.incomeTotal} delay={0.06} trend={<Trend value={stats.incomeTrend} />} />
            <StatCard
              label="Expenses"
              value={stats.expenseTotal}
              delay={0.12}
              trend={<Trend value={stats.expenseTrend} goodWhenUp={false} />}
            />
          </div>

          <div className="grid gap-5 md:gap-6 lg:grid-cols-5">
            <Card
              className="lg:col-span-3"
              title="Spending by category"
              delay={0.1}
              action={
                categories.length > 0 && (
                  <Link href="/expenses" className="text-sm font-semibold text-forest-600 hover:underline dark:text-lime">
                    See all
                  </Link>
                )
              }
            >
              {categories.length === 0 ? (
                <EmptyState
                  title="No expenses yet"
                  body="Add your first expense to see where your money goes."
                  action={
                    <button onClick={() => addExpense()} className="btn btn-primary btn-sm">
                      <LuPlus /> Add expense
                    </button>
                  }
                />
              ) : (
                <div className="divide-y divide-line">
                  {categories.slice(0, 5).map((c) => (
                    <CategoryRow key={c.id} category={c} max={maxCategory} onClick={() => viewCategory(c.id)} />
                  ))}
                </div>
              )}
            </Card>

            <Card className="lg:col-span-2" title="This month" delay={0.16} bodyClassName="px-5 pb-6 md:px-6">
              {stats.monthSpend.length === 0 ? (
                <EmptyState title={`Nothing spent in ${monthName}`} body="Your chart fills in as you add expenses." />
              ) : (
                <div className="space-y-6 pt-2">
                  <Donut
                    data={stats.monthSpend}
                    centerValue={money(stats.monthSpendTotal, { whole: true })}
                    centerLabel={`spent in ${monthName}`}
                    format={(v) => money(v)}
                  />
                  <DonutLegend data={stats.monthSpend} />
                </div>
              )}
            </Card>
          </div>

          <Card
            title="Recent activity"
            delay={0.2}
            action={
              transactions.length > 0 && (
                <Link href="/transactions" className="text-sm font-semibold text-forest-600 hover:underline dark:text-lime">
                  See all
                </Link>
              )
            }
          >
            {transactions.length === 0 ? (
              <EmptyState
                title="No activity yet"
                body="Income and expenses you add show up here."
                action={
                  <button onClick={addIncome} className="btn btn-lime btn-sm">
                    <LuPlus /> Add income
                  </button>
                }
              />
            ) : (
              <div>
                {transactions.slice(0, 6).map((tx) => (
                  <TransactionRow
                    key={tx.key}
                    tx={tx}
                    onClick={tx.kind === "expense" ? () => viewCategory(tx.categoryId) : undefined}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
