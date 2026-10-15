"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import Sheet from "@/components/ui/Sheet";
import { CategoryTile } from "@/components/ui/CategoryBadge";
import EmptyState from "@/components/ui/EmptyState";
import { relativeDay, toDate } from "@/lib/finance";
import { useMoney } from "@/lib/utlis";
import { useFinance } from "./hooks";

export default function CategorySheet({ categoryId, onClose, onAddExpense }) {
  const { expenses, deleteExpenseItem, deleteExpenseCategory } = useFinance();
  const money = useMoney();
  const expense = expenses.find((e) => e.id === categoryId);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => setConfirming(false), [categoryId]);

  // Keep the last category on screen while the sheet animates out.
  const [shown, setShown] = useState(expense);
  useEffect(() => {
    if (expense) setShown(expense);
  }, [expense]);
  const cat = expense || shown;

  const deleteExpenseItemHandler = async (item) => {
    try {
      const updatedItems = cat.items.filter((i) => i.id !== item.id);
      await deleteExpenseItem({ items: [...updatedItems], total: cat.total - item.amount }, cat.id);
      toast.success("Expense removed");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const deleteCategoryHandler = async () => {
    try {
      await deleteExpenseCategory(cat.id);
      toast.success("Category deleted");
      onClose();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const items = [...(cat?.items || [])].sort(
    (a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0)
  );

  return (
    <Sheet
      open={Boolean(expense)}
      onClose={onClose}
      title={
        cat && (
          <span className="flex items-center gap-3">
            <CategoryTile color={cat.color} size="sm" />
            <span className="capitalize">{cat.title}</span>
          </span>
        )
      }
      footer={
        cat && (
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait" initial={false}>
              {confirming ? (
                <motion.div
                  key="confirm"
                  className="flex flex-1 items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="mr-auto text-sm font-semibold">Delete {cat.title} and its {items.length} items?</span>
                  <button className="btn btn-sm btn-outline" onClick={() => setConfirming(false)}>
                    Keep
                  </button>
                  <button className="btn btn-sm bg-expense text-white" onClick={deleteCategoryHandler}>
                    Delete
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="actions"
                  className="flex flex-1 items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button className="btn btn-danger" onClick={() => setConfirming(true)}>
                    Delete category
                  </button>
                  <button className="btn btn-primary ml-auto" onClick={() => onAddExpense(cat.id)}>
                    <LuPlus /> Add expense
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      }
    >
      {cat && (
        <>
          <div className="mb-5 rounded-lg bg-sunken p-5">
            <span className="text-sm font-semibold text-muted">Total spent</span>
            <div className="figure mt-1 text-[32px] font-bold leading-tight">{money(cat.total)}</div>
            <span className="text-sm text-muted">
              {items.length} {items.length === 1 ? "expense" : "expenses"}
            </span>
          </div>
          <h3 className="mb-1 text-h3">History</h3>
          {items.length === 0 ? (
            <EmptyState title="Nothing here yet" body={`Add your first ${cat.title} expense.`} className="py-6" />
          ) : (
            <ul className="divide-y divide-line">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const d = toDate(item.createdAt);
                  return (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 py-3"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{item.note || cat.title}</span>
                        <span className="text-[13px] text-muted">
                          {d ? `${relativeDay(d)}, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                        </span>
                      </span>
                      <span className="amount font-semibold">{money(-item.amount)}</span>
                      <button
                        onClick={() => deleteExpenseItemHandler(item)}
                        className="icon-btn h-9 w-9 hover:bg-expense/10 hover:text-expense"
                        aria-label="Delete expense"
                      >
                        <LuTrash2 />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </>
      )}
    </Sheet>
  );
}
