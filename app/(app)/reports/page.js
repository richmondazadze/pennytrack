"use client";

import { useMemo, useState } from "react";
import { LuDownload } from "react-icons/lu";
import PageHeader, { Card } from "@/components/app/PageHeader";
import { useDownloadReport, useFinance } from "@/components/app/hooks";
import { useQuickActions } from "@/components/app/QuickActions";
import CategoryRow from "@/components/app/CategoryRow";
import Segmented from "@/components/ui/Segmented";
import EmptyState from "@/components/ui/EmptyState";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Donut, { DonutLegend } from "@/components/charts/Donut";
import CashFlow from "@/components/charts/CashFlow";
import { monthlyFlow, periodStart, spendingByCategory, sumExpenses, sumIncome } from "@/lib/finance";
import { useMoney } from "@/lib/utlis";

const PERIODS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "all", label: "All" },
];

const PERIOD_TEXT = { week: "in the last 7 days", month: "this month", year: "this year", all: "all time" };

export default function ReportsPage() {
  const { income, expenses } = useFinance();
  const { viewCategory } = useQuickActions();
  const download = useDownloadReport();
  const money = useMoney();
  const [period, setPeriod] = useState("month");

  const data = useMemo(() => {
    const start = periodStart(period);
    const spend = spendingByCategory(expenses, start);
    const inc = sumIncome(income, start);
    const exp = sumExpenses(expenses, start);
    return { spend, inc, exp, net: inc - exp, flow: monthlyFlow(income, expenses, 6) };
  }, [income, expenses, period]);

  const hasFlow = data.flow.some((m) => m.income || m.expense);

  return (
    <>
      <PageHeader
        eyebrow="Where your money goes"
        title="Reports"
        showQuickAdd={false}
        actions={
          <button onClick={download} className="btn btn-primary hidden md:inline-flex">
            <LuDownload /> Download PDF
          </button>
        }
      />

      <Segmented id="period" options={PERIODS} value={period} onChange={setPeriod} className="mb-6 w-full md:w-auto" />

      <div className="mb-6 grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Income", value: data.inc, cls: "text-income" },
          { label: "Expenses", value: data.exp, cls: "" },
          { label: "Net", value: data.net, cls: data.net >= 0 ? "text-forest-600 dark:text-lime" : "text-expense" },
        ].map((s) => (
          <div key={s.label} className="card p-4 md:p-5">
            <div className="text-xs font-semibold text-muted md:text-sm">{s.label}</div>
            <AnimatedNumber
              value={s.value}
              format={(v) => money(v, { whole: true })}
              className={`figure mt-1 block text-base font-bold md:text-[26px] ${s.cls}`}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 lg:self-start" title="Spending by category" bodyClassName="px-5 pb-6 md:px-6">
          {data.spend.length === 0 ? (
            <EmptyState title="No spending" body={`Nothing recorded ${PERIOD_TEXT[period]}.`} />
          ) : (
            <div className="space-y-6 pt-2">
              <Donut
                key={period}
                data={data.spend}
                centerValue={money(data.exp, { whole: true })}
                centerLabel={`spent ${PERIOD_TEXT[period]}`}
                format={(v) => money(v)}
              />
              <DonutLegend data={data.spend} />
            </div>
          )}
        </Card>

        <div className="space-y-5 md:space-y-6 lg:col-span-3">
          <Card title="Cash flow" action={<Legend />} bodyClassName="px-4 pb-5 md:px-6">
            {hasFlow ? (
              <CashFlow data={data.flow} format={(v) => money(v, { whole: true })} />
            ) : (
              <EmptyState title="No cash flow yet" body="Monthly income and spending appear here." />
            )}
          </Card>

          {data.spend.length > 0 && (
            <Card title="Top categories">
              <div className="divide-y divide-line">
                {data.spend.slice(0, 5).map((c) => (
                  <CategoryRow key={c.id} category={c} max={data.spend[0].total} onClick={() => viewCategory(c.id)} />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <button onClick={download} className="btn btn-primary btn-lg mt-6 w-full md:hidden">
        <LuDownload /> Download PDF report
      </button>
    </>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs font-semibold text-muted">
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-income" /> Income</span>
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-forest dark:bg-lime" /> Expenses</span>
    </div>
  );
}
