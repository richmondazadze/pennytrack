"use client";

import { motion } from "framer-motion";
import { LuPlus } from "react-icons/lu";
import { AppIcon } from "@/components/brand/Logo";
import CurrencySelect from "./CurrencySelect";
import UserMenu from "./UserMenu";
import { useQuickActions } from "./QuickActions";

// Page title row. Desktop shows currency + add buttons + account menu; phones keep it to the essentials.
export default function PageHeader({ eyebrow, title, actions, showQuickAdd = true }) {
  const { addExpense, addIncome } = useQuickActions();
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 flex items-center gap-4 md:mb-8"
    >
      <span className="md:hidden"><AppIcon className="h-10 w-10" /></span>
      <div className="min-w-0 flex-1">
        {eyebrow && <div className="truncate text-[13px] font-medium text-muted md:text-sm">{eyebrow}</div>}
        <h1 className="truncate text-[20px] font-bold leading-tight tracking-[-0.01em] md:text-h1">{title}</h1>
      </div>
      <div className="flex items-center gap-2.5">
        {actions}
        <CurrencySelect className="hidden md:inline-flex" />
        {showQuickAdd && (
          <>
            <button onClick={addIncome} className="btn btn-lime hidden lg:inline-flex">
              <LuPlus className="text-lg" /> Add income
            </button>
            <button onClick={() => addExpense()} className="btn btn-primary hidden md:inline-flex">
              <LuPlus className="text-lg" /> Add expense
            </button>
          </>
        )}
        <UserMenu />
      </div>
    </motion.header>
  );
}

export function Card({ title, action, children, className = "", bodyClassName = "", delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`card ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pt-5 md:px-6 md:pt-6">
          {title && <h2 className="text-h3 md:text-[19px] md:font-bold">{title}</h2>}
          {action}
        </div>
      )}
      <div className={`p-3 md:p-4 ${bodyClassName}`}>{children}</div>
    </motion.section>
  );
}
