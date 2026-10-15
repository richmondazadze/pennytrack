"use client";

import { motion } from "framer-motion";
import { CategoryTile } from "@/components/ui/CategoryBadge";
import { useMoney } from "@/lib/utlis";

// Category with a share-of-spend bar, as in the design system.
export default function CategoryRow({ category, max, onClick, whole }) {
  const money = useMoney();
  const pct = max ? Math.max(4, (category.total / max) * 100) : 0;
  const count = category.count ?? category.items?.length ?? 0;
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-md px-2 py-3 text-left transition hover:bg-sunken active:scale-[.99]"
    >
      <CategoryTile category={category} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold capitalize">{category.title}</span>
        <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-sunken">
          <motion.span
            className="block h-full rounded-full"
            style={{ backgroundColor: category.color }}
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      </span>
      <span className="w-28 shrink-0 text-right">
        <span className="amount block text-[15px] font-semibold">{money(category.total, { whole })}</span>
        <span className="block text-xs text-muted">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </span>
    </button>
  );
}
