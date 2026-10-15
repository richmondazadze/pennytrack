// Derived views over the raw Firestore data (income entries and expense categories).

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.toMillis === "function") return new Date(value.toMillis());
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfMonth(d = new Date(), offset = 0) {
  return new Date(d.getFullYear(), d.getMonth() + offset, 1);
}

// Start date for a reporting period. "all" returns null (no lower bound).
export function periodStart(period, now = new Date()) {
  switch (period) {
    case "week": {
      const d = startOfDay(now);
      d.setDate(d.getDate() - 6);
      return d;
    }
    case "month":
      return startOfMonth(now);
    case "year":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return null;
  }
}

function within(date, start, end) {
  if (!date) return false;
  if (start && date < start) return false;
  if (end && date >= end) return false;
  return true;
}

// One flat, newest-first list of every income entry and expense item.
export function buildTransactions(income, expenses) {
  const rows = [];
  income.forEach((i) => {
    rows.push({
      key: `i-${i.id}`,
      kind: "income",
      id: i.id,
      amount: Number(i.amount) || 0,
      date: toDate(i.createdAt),
      title: i.description || "Income",
      category: "Income",
    });
  });
  expenses.forEach((e) => {
    (e.items || []).forEach((item) => {
      rows.push({
        key: `e-${e.id}-${item.id}`,
        kind: "expense",
        id: item.id,
        categoryId: e.id,
        color: e.color,
        amount: Number(item.amount) || 0,
        date: toDate(item.createdAt),
        title: item.note || e.title,
        category: e.title,
      });
    });
  });
  return rows.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
}

export function sumIncome(income, start, end) {
  return income
    .filter((i) => within(toDate(i.createdAt), start, end))
    .reduce((t, i) => t + (Number(i.amount) || 0), 0);
}

export function sumExpenses(expenses, start, end) {
  return expenses.reduce(
    (t, e) =>
      t +
      (e.items || [])
        .filter((item) => within(toDate(item.createdAt), start, end))
        .reduce((s, item) => s + (Number(item.amount) || 0), 0),
    0
  );
}

// Per-category spend within [start, end), biggest first. Categories with no spend drop out.
export function spendingByCategory(expenses, start = null, end = null) {
  return expenses
    .map((e) => {
      const items = (e.items || []).filter((item) => within(toDate(item.createdAt), start, end));
      return {
        id: e.id,
        title: e.title,
        color: e.color,
        total: items.reduce((s, item) => s + (Number(item.amount) || 0), 0),
        count: items.length,
      };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

// Income and expense totals for each of the last `months` calendar months.
export function monthlyFlow(income, expenses, months = 6, now = new Date()) {
  const out = [];
  for (let i = months - 1; i >= 0; i--) {
    const start = startOfMonth(now, -i);
    const end = startOfMonth(now, -i + 1);
    out.push({
      label: start.toLocaleDateString("en-GB", { month: "short" }),
      income: sumIncome(income, start, end),
      expense: sumExpenses(expenses, start, end),
    });
  }
  return out;
}

// Percentage change, or null when there is nothing to compare against.
export function pctChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function relativeDay(date, now = new Date()) {
  if (!date) return "";
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function firstName(displayName) {
  return displayName ? displayName.split(" ")[0] : "";
}

// Category palette from the design system, offered when creating a category.
export const CATEGORY_PRESETS = [
  { title: "Food", color: "#A3D936" },
  { title: "Transport", color: "#14B8A6" },
  { title: "Bills", color: "#38BDF8" },
  { title: "Rent", color: "#6366F1" },
  { title: "Shopping", color: "#A855F7" },
  { title: "Health", color: "#EC4899" },
  { title: "Fun", color: "#F97316" },
  { title: "Savings", color: "#EAB308" },
];
