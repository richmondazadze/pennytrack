"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { LuCheck } from "react-icons/lu";
import { useFinance } from "./hooks";
import { CATEGORY_PRESETS } from "@/lib/finance";

const SWATCHES = CATEGORY_PRESETS.map((p) => p.color);

// Name + colour picker. Calls onCreated(id) after the category is saved.
export default function NewCategoryForm({ onCreated, onCancel, autoFocus = true }) {
  const { addCategory, expenses } = useFinance();
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(SWATCHES[expenses.length % SWATCHES.length]);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    const name = title.trim();
    if (!name) {
      toast.error("Category title is required");
      return;
    }
    setSaving(true);
    try {
      const id = await addCategory({ title: name, color, total: 0 });
      toast.success(`${name} created`);
      setTitle("");
      onCreated?.(id);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="cat-title">Name</label>
        <input
          id="cat-title"
          className="input"
          placeholder="e.g. Groceries"
          value={title}
          autoFocus={autoFocus}
          maxLength={40}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <span className="field-label">Colour</span>
        <div className="flex flex-wrap items-center gap-2.5">
          {SWATCHES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Colour ${c}`}
              aria-pressed={color === c}
              className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90"
              style={{ backgroundColor: c, boxShadow: color === c ? `0 0 0 3px rgb(var(--surface)), 0 0 0 5px ${c}` : "none" }}
            >
              {color === c && <LuCheck className="text-white drop-shadow" />}
            </button>
          ))}
          <label
            className="relative flex h-9 items-center gap-2 rounded-full border border-dashed border-n-300 px-3 text-sm font-semibold text-muted dark:border-n-600"
            title="Custom colour"
          >
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
            Custom
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" className="btn btn-primary flex-1" disabled={saving}>
          {saving ? "Saving…" : "Create category"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
