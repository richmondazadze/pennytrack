"use client";

import { useContext, useState } from "react";
import { toast } from "react-toastify";
import Sheet from "@/components/ui/Sheet";
import { authContext } from "@/lib/store/auth-context";
import AmountInput from "./AmountInput";
import { useFinance } from "./hooks";

const SUGGESTIONS = ["Salary", "Freelance", "Business", "Gift", "Side hustle"];

export default function AddIncomeSheet({ open, onClose }) {
  const { addIncomeItem } = useFinance();
  const { user } = useContext(authContext);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e?.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter an amount above 0");
      return;
    }
    if (!description.trim()) {
      toast.error("Add a short description, e.g. Salary");
      return;
    }
    setSaving(true);
    try {
      await addIncomeItem({
        amount: value,
        description: description.trim(),
        createdAt: new Date(),
        uid: user.uid,
      });
      toast.success("Income added");
      setAmount("");
      setDescription("");
      onClose();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Add income"
      footer={
        <button
          onClick={save}
          disabled={saving || !(Number(amount) > 0) || !description.trim()}
          className="btn btn-lime btn-lg w-full"
        >
          {saving ? "Saving…" : "Save income"}
        </button>
      }
    >
      <form onSubmit={save} className="space-y-6">
        <AmountInput value={amount} onChange={setAmount} autoFocus id="income-amount" />
        <div>
          <label className="field-label" htmlFor="description">Description</label>
          <input
            id="description"
            className="input"
            placeholder="e.g. Salary - October"
            maxLength={60}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setDescription(s)}
                className="chip h-8 bg-sunken text-[13px] text-muted hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Sheet>
  );
}
