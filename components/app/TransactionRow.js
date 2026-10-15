"use client";

import { LuArrowDownLeft, LuArrowUpRight } from "react-icons/lu";
import { relativeDay } from "@/lib/finance";
import { useMoney } from "@/lib/utlis";

export default function TransactionRow({ tx, onClick, showDate = true, trailing }) {
  const money = useMoney();
  const income = tx.kind === "income";
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`group flex w-full items-center gap-3.5 rounded-md px-2 py-2.5 text-left transition ${
        onClick ? "hover:bg-sunken active:scale-[.99]" : ""
      }`}
    >
      <span
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: income ? "#12B76A1f" : `${tx.color || "#7B8880"}24`,
          color: income ? "#12B76A" : tx.color || "#7B8880",
        }}
      >
        {income ? <LuArrowDownLeft className="text-lg" /> : <LuArrowUpRight className="text-lg" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold capitalize leading-tight">{tx.title}</span>
        <span className="mt-0.5 block truncate text-[13px] capitalize text-muted">
          {tx.kind === "expense" && tx.title === tx.category ? "Expense" : tx.category}
          {showDate && tx.date ? ` · ${relativeDay(tx.date)}` : ""}
        </span>
      </span>
      <span className={`amount shrink-0 text-[15px] font-semibold ${income ? "text-income" : "text-fg"}`}>
        {money(income ? tx.amount : -tx.amount, { sign: true })}
      </span>
      {trailing}
    </Tag>
  );
}
