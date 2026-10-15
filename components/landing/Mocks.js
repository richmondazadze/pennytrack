"use client";

// Product previews for the landing page, drawn in HTML so they stay crisp and on-brand.
// The figures are illustrative sample data from the design system.
import { motion } from "framer-motion";
import { LuArrowDownLeft, LuCheck, LuDownload, LuFileText } from "react-icons/lu";
import { AppIcon } from "@/components/brand/Logo";
import { CategoryIcon } from "@/lib/category-icons";

export const SAMPLE_CATEGORIES = [
  { title: "Food", color: "#A3D936", total: 1240, items: 12 },
  { title: "Transport", color: "#14B8A6", total: 760, items: 8 },
  { title: "Bills", color: "#38BDF8", total: 590, items: 4 },
  { title: "Rent", color: "#6366F1", total: 510, items: 1 },
  { title: "Shopping", color: "#A855F7", total: 420, items: 6 },
  { title: "Health", color: "#EC4899", total: 340, items: 3 },
  { title: "Fun", color: "#F97316", total: 210, items: 5 },
  { title: "Savings", color: "#EAB308", total: 184, items: 2 },
];

const TX = [
  { title: "Salary", sub: "Income · 01 Oct", amount: "+₵4,500.00", income: true },
  { title: "Melcom", sub: "Shopping · Yesterday", amount: "−₵180.00", color: "#A855F7", icon: "shopping" },
  { title: "ECG prepaid", sub: "Bills · 12 Oct", amount: "−₵200.00", color: "#38BDF8", icon: "electricity" },
  { title: "Freelance", sub: "Income · 10 Oct", amount: "+₵1,200.00", income: true },
];

const fmt = (n) => `₵${n.toLocaleString("en-US")}`;

// Animated SVG doughnut: segments draw in when scrolled into view.
export function SvgDonut({ data = SAMPLE_CATEGORIES, size = 180, stroke = 22, center = "₵4,254", label = "spent in October" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.total, 0);
  const gap = 3;
  let offset = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {data.map((d, i) => {
          const len = (d.total / total) * c;
          const seg = (
            <motion.circle
              key={d.title}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${c}` }}
              whileInView={{ strokeDasharray: `${Math.max(len - gap, 1)} ${c}` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="figure text-[22px] font-bold text-n-900">{center}</span>
        <span className="text-[11px] text-n-500">{label}</span>
      </div>
    </div>
  );
}

function Bar({ color, pct, delay = 0 }) {
  return (
    <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-n-50">
      <motion.span
        className="block h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

export function CategoryList({ count = 5, compact = false }) {
  const max = SAMPLE_CATEGORIES[0].total;
  return (
    <div className="divide-y divide-n-100">
      {SAMPLE_CATEGORIES.slice(0, count).map((c, i) => (
        <div key={c.title} className={`flex items-center gap-3 ${compact ? "py-2" : "py-2.5"}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[17px]" style={{ backgroundColor: `${c.color}24`, color: c.color }}>
            <CategoryIcon category={c} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-n-900">{c.title}</span>
            <Bar color={c.color} pct={(c.total / max) * 100} delay={0.2 + i * 0.08} />
          </span>
          <span className="w-20 text-right">
            <span className="figure block text-[13px] font-semibold text-n-900">{fmt(c.total)}.00</span>
            <span className="block text-[10px] text-n-500">{c.items} items</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function TxList({ count = 4 }) {
  return (
    <div className="space-y-1">
      {TX.slice(0, count).map((t) => (
        <div key={t.title} className="flex items-center gap-3 py-1.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: t.income ? "#12B76A1f" : `${t.color}24`, color: t.income ? "#12B76A" : t.color }}
          >
            {t.income ? <LuArrowDownLeft /> : <CategoryIcon iconKey={t.icon} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-n-900">{t.title}</span>
            <span className="block text-[11px] text-n-500">{t.sub}</span>
          </span>
          <span className={`amount text-[13px] font-semibold ${t.income ? "text-income" : "text-n-900"}`}>{t.amount}</span>
        </div>
      ))}
    </div>
  );
}

// Desktop dashboard preview inside a browser frame.
export function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-n-100 bg-white shadow-[0_40px_100px_-20px_rgba(14,59,46,.35)]">
      <div className="flex items-center gap-2 border-b border-n-100 bg-n-25 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="mx-auto hidden rounded-full bg-white px-16 py-1 text-[11px] font-medium text-n-400 sm:block">pennytrack.tech</span>
      </div>
      <div className="flex">
        <div className="hidden w-[180px] shrink-0 flex-col gap-1 border-r border-n-100 p-4 lg:flex">
          <div className="mb-4 flex items-center gap-2">
            <AppIcon className="h-7 w-7" />
            <span className="text-[15px] font-bold text-n-900">Penny<span className="text-forest-600">Track</span></span>
          </div>
          {["Dashboard", "Transactions", "Expenses", "Income", "Reports"].map((l, i) => (
            <span key={l} className={`rounded-[10px] px-3 py-2 text-[12px] font-semibold ${i === 0 ? "bg-forest text-white" : "text-n-500"}`}>
              {l}
            </span>
          ))}
          <div className="mt-auto rounded-[14px] bg-lime p-3">
            <div className="text-[12px] font-bold text-forest">Monthly report</div>
            <div className="text-[10px] text-forest/80">October PDF is ready.</div>
          </div>
        </div>
        <div className="min-w-0 flex-1 bg-n-25 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-n-500">Wednesday, 15 October</div>
              <div className="text-[17px] font-bold text-n-900">Good evening, Ama</div>
            </div>
            <div className="hidden gap-2 sm:flex">
              <span className="rounded-full bg-lime px-3 py-1.5 text-[11px] font-semibold text-forest">+ Add income</span>
              <span className="rounded-full bg-forest px-3 py-1.5 text-[11px] font-semibold text-white">+ Add expense</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-[14px] bg-forest p-3">
              <div className="text-[10px] font-semibold text-lime">Total balance</div>
              <div className="figure mt-1 text-[13px] font-bold text-white sm:text-[17px]">₵8,245.50</div>
              <span className="mt-1.5 inline-block rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-lime">▲ 12%</span>
            </div>
            <div className="rounded-[14px] border border-n-100 bg-white p-3">
              <div className="text-[10px] font-semibold text-n-500">Income</div>
              <div className="figure mt-1 text-[13px] font-bold text-n-900 sm:text-[17px]">₵12,500.00</div>
              <span className="mt-1.5 inline-block rounded-full bg-income/10 px-1.5 py-0.5 text-[9px] font-bold text-income">▲ 4%</span>
            </div>
            <div className="rounded-[14px] border border-n-100 bg-white p-3">
              <div className="text-[10px] font-semibold text-n-500">Expenses</div>
              <div className="figure mt-1 text-[13px] font-bold text-n-900 sm:text-[17px]">₵4,254.50</div>
              <span className="mt-1.5 inline-block rounded-full bg-expense/10 px-1.5 py-0.5 text-[9px] font-bold text-expense">▲ 9%</span>
            </div>
          </div>
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-5">
            <div className="rounded-[14px] border border-n-100 bg-white p-3.5 sm:col-span-3">
              <div className="mb-1 text-[12px] font-bold text-n-900">Spending by category</div>
              <CategoryList count={4} compact />
            </div>
            <div className="hidden flex-col items-center justify-center rounded-[14px] border border-n-100 bg-white p-3.5 sm:col-span-2 sm:flex">
              <div className="mb-2 self-start text-[12px] font-bold text-n-900">This month</div>
              <SvgDonut size={150} stroke={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Phone preview, used on small screens and in the "Anywhere" pillar.
export function PhoneMock({ className = "" }) {
  return (
    <div className={`w-[260px] rounded-[40px] border-[8px] border-n-900 bg-n-25 p-3 shadow-[0_30px_80px_-20px_rgba(14,59,46,.45)] ${className}`}>
      <div className="mb-3 flex items-center gap-2 px-1 pt-2">
        <AppIcon className="h-7 w-7" />
        <div className="leading-tight">
          <div className="text-[9px] text-n-500">Good evening</div>
          <div className="text-[12px] font-bold text-n-900">Ama</div>
        </div>
      </div>
      <div className="rounded-[18px] bg-forest p-3.5">
        <div className="text-[10px] font-semibold text-lime">Total balance</div>
        <div className="figure text-[22px] font-bold text-white">₵8,245.50</div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="rounded-[10px] bg-white/[.07] p-2">
            <div className="text-[9px] text-white/70">Income</div>
            <div className="figure text-[11px] font-bold text-lime">₵12,500</div>
          </div>
          <div className="rounded-[10px] bg-white/[.07] p-2">
            <div className="text-[9px] text-white/70">Expenses</div>
            <div className="figure text-[11px] font-bold text-white">₵4,254</div>
          </div>
        </div>
      </div>
      <div className="mt-3 px-1">
        <div className="mb-1 text-[12px] font-bold text-n-900">Categories</div>
        <CategoryList count={3} compact />
      </div>
      <div className="mt-2 flex items-center justify-around rounded-[16px] bg-white py-2">
        {["Home", "Expenses"].map((t, i) => (
          <span key={t} className={`text-[9px] font-semibold ${i === 0 ? "text-forest" : "text-n-400"}`}>{t}</span>
        ))}
        <span className="-mt-5 flex h-9 w-9 items-center justify-center rounded-full bg-lime text-lg font-bold text-forest shadow-fab">+</span>
        {["Reports", "Profile"].map((t) => (
          <span key={t} className="text-[9px] font-semibold text-n-400">{t}</span>
        ))}
      </div>
    </div>
  );
}

export function ToastMock({ text = "Expense added to Food", light = false, className = "" }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] font-semibold shadow-overlay ${
        light ? "bg-white text-n-900" : "bg-n-900 text-white"
      } ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-income text-[11px]"><LuCheck /></span>
      {text}
    </div>
  );
}

export function AddExpenseMock() {
  const chips = SAMPLE_CATEGORIES.slice(0, 6);
  return (
    <div className="w-full max-w-[380px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_-24px_rgba(14,59,46,.35)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[18px] font-bold text-n-900">Add expense</span>
        <span className="text-[13px] text-n-500">Cancel</span>
      </div>
      <div className="rounded-[20px] bg-n-50 py-5 text-center">
        <div className="text-[12px] font-semibold text-n-500">Amount</div>
        <div className="figure text-[40px] font-bold text-n-900">₵ 85<span className="text-n-300">.00</span></div>
      </div>
      <div className="mt-4 text-[13px] font-semibold text-n-900">Category</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {chips.map((c, i) => (
          <motion.span
            key={c.title}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 400, damping: 22 }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 1 ? "bg-forest text-white" : "text-n-900"}`}
            style={i === 1 ? undefined : { backgroundColor: `${c.color}22` }}
          >
            <span style={{ color: i === 1 ? "#C8F250" : c.color }}><CategoryIcon category={c} /></span>
            {c.title}
          </motion.span>
        ))}
      </div>
      <div className="mt-5 rounded-full bg-forest py-3 text-center text-[14px] font-semibold text-white">Save expense</div>
    </div>
  );
}

export function ReportMock() {
  return (
    <div className="relative w-full max-w-[400px]">
      <div className="rounded-[28px] bg-white p-6 shadow-[0_30px_80px_-24px_rgba(14,59,46,.35)]">
        <div className="mb-4 flex rounded-full bg-n-50 p-1 text-[12px] font-semibold">
          {["Week", "Month", "Year"].map((p, i) => (
            <span key={p} className={`flex-1 rounded-full py-1.5 text-center ${i === 1 ? "bg-white text-n-900 shadow-raised" : "text-n-500"}`}>{p}</span>
          ))}
        </div>
        <div className="flex justify-center">
          <SvgDonut size={190} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2">
          {SAMPLE_CATEGORIES.slice(0, 6).map((c) => (
            <span key={c.title} className="flex items-center gap-2 text-[12px] text-n-700">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
              {c.title}
              <span className="amount ml-auto font-semibold text-n-900">{Math.round((c.total / 4254) * 100)}%</span>
            </span>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: -4 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-8 -left-4 flex items-center gap-3 rounded-[18px] bg-lime p-3.5 pr-5 shadow-overlay sm:-left-10"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-forest text-lime"><LuFileText className="text-lg" /></span>
        <span>
          <span className="block text-[13px] font-bold text-forest">pennytrack_2026-10-15.pdf</span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-forest/80"><LuDownload /> Report downloaded</span>
        </span>
      </motion.div>
    </div>
  );
}

const CURRENCIES = [
  ["GHS", "₵"],
  ["USD", "$"],
  ["EUR", "€"],
  ["GBP", "£"],
];

export function CurrencyMock() {
  return (
    <div className="w-full max-w-[380px] space-y-2.5">
      {CURRENCIES.map(([code, sym], i) => (
        <motion.div
          key={code}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center gap-4 rounded-[20px] p-4 ${i === 0 ? "bg-forest text-white shadow-overlay" : "border border-n-100 bg-white text-n-900"}`}
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${i === 0 ? "bg-lime text-forest" : "bg-n-50"}`}>{sym}</span>
          <span className="flex-1">
            <span className="block font-bold">{code}</span>
            <span className={`text-[12px] ${i === 0 ? "text-white/70" : "text-n-500"}`}>{i === 0 ? "Selected" : "Tap to switch"}</span>
          </span>
          {i === 0 && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-forest"><LuCheck /></span>}
        </motion.div>
      ))}
    </div>
  );
}

export { TX as SAMPLE_TRANSACTIONS };
