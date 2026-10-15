"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Sheet from "@/components/ui/Sheet";
import AddExpenseSheet from "./AddExpenseSheet";
import AddIncomeSheet from "./AddIncomeSheet";
import CategorySheet from "./CategorySheet";
import NewCategoryForm from "./NewCategoryForm";

const QuickActionsContext = createContext(null);

// One place that owns every add/view sheet, so any screen (or the mobile + button) can open them.
export function QuickActionsProvider({ children }) {
  const [expense, setExpense] = useState({ open: false, categoryId: null });
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);

  const addExpense = useCallback((id = null) => {
    setCategoryId(null);
    setExpense({ open: true, categoryId: id });
  }, []);
  const addIncome = useCallback(() => setIncomeOpen(true), []);
  const viewCategory = useCallback((id) => setCategoryId(id), []);
  const newCategory = useCallback(() => setNewCategoryOpen(true), []);

  const value = useMemo(
    () => ({ addExpense, addIncome, viewCategory, newCategory }),
    [addExpense, addIncome, viewCategory, newCategory]
  );

  return (
    <QuickActionsContext.Provider value={value}>
      {children}
      <AddExpenseSheet
        open={expense.open}
        initialCategoryId={expense.categoryId}
        onClose={() => setExpense((s) => ({ ...s, open: false }))}
      />
      <AddIncomeSheet open={incomeOpen} onClose={() => setIncomeOpen(false)} />
      <CategorySheet categoryId={categoryId} onClose={() => setCategoryId(null)} onAddExpense={addExpense} />
      <Sheet open={newCategoryOpen} onClose={() => setNewCategoryOpen(false)} title="New category">
        <NewCategoryForm onCreated={() => setNewCategoryOpen(false)} />
      </Sheet>
    </QuickActionsContext.Provider>
  );
}

export const useQuickActions = () => useContext(QuickActionsContext);
