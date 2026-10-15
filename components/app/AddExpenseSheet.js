"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Sheet from "@/components/ui/Sheet";
import { CategoryChip } from "@/components/ui/CategoryBadge";
import { CATEGORY_PRESETS } from "@/lib/finance";
import AmountInput from "./AmountInput";
import NewCategoryForm from "./NewCategoryForm";
import { useFinance } from "./hooks";

export default function AddExpenseSheet({ open, onClose, initialCategoryId = null }) {
  const { expenses, addExpenseItem, addCategory } = useFinance();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedCategory(initialCategoryId);
      setCreating(false);
    }
  }, [open, initialCategoryId]);

  const reset = () => {
    setAmount("");
    setNote("");
    setSelectedCategory(null);
    setCreating(false);
  };

  // First-run shortcut: tapping a suggested category creates it and selects it.
  const createPreset = async (preset) => {
    try {
      const id = await addCategory({ title: preset.title, color: preset.color, total: 0 });
      setSelectedCategory(id);
    } catch (error) {
      toast.error(error.message || "Failed to create category");
    }
  };

  const save = async (e) => {
    e?.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter an amount above 0");
      return;
    }
    const expense = expenses.find((x) => x.id === selectedCategory);
    if (!expense) {
      toast.error("Pick a category");
      return;
    }
    const item = { amount: value, createdAt: new Date(), id: uuidv4() };
    if (note.trim()) item.note = note.trim();
    const newExpense = {
      color: expense.color,
      title: expense.title,
      total: (Number(expense.total) || 0) + value,
      items: [...(expense.items || []), item],
    };
    setSaving(true);
    try {
      await addExpenseItem(selectedCategory, newExpense);
      toast.success(`Expense added to ${expense.title}`);
      reset();
      onClose();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const canSave = Number(amount) > 0 && selectedCategory;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Add expense"
      footer={
        <button onClick={save} disabled={!canSave || saving} className="btn btn-primary btn-lg w-full">
          {saving ? "Saving…" : "Save expense"}
        </button>
      }
    >
      <form onSubmit={save} className="space-y-6">
        <AmountInput value={amount} onChange={setAmount} autoFocus />

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-sm font-semibold">Category</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {creating ? (
              <motion.div
                key="new"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg border border-line p-4"
              >
                <NewCategoryForm
                  onCreated={(id) => {
                    setSelectedCategory(id);
                    setCreating(false);
                  }}
                  onCancel={() => setCreating(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chips"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {expenses.map((c) => (
                  <CategoryChip
                    key={c.id}
                    title={c.title}
                    color={c.color}
                    selected={c.id === selectedCategory}
                    onClick={() => setSelectedCategory(c.id)}
                  />
                ))}
                {expenses.length === 0 &&
                  CATEGORY_PRESETS.slice(0, 6).map((p) => (
                    <CategoryChip key={p.title} title={p.title} color={p.color} onClick={() => createPreset(p)} />
                  ))}
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="chip border border-dashed border-n-300 text-muted hover:text-fg dark:border-n-600"
                >
                  + New
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {expenses.length === 0 && !creating && (
            <p className="mt-2 text-xs text-muted">Tap a suggestion to create it, or make your own.</p>
          )}
        </div>

        <div>
          <label className="field-label" htmlFor="note">Note (optional)</label>
          <input
            id="note"
            className="input"
            placeholder="e.g. Trotro to Accra Mall"
            maxLength={60}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </form>
    </Sheet>
  );
}
