"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { LuCheck } from "react-icons/lu";
import { useFinance } from "./hooks";
import IconPicker from "./IconPicker";
import { CategoryTile } from "@/components/ui/CategoryBadge";
import { CATEGORY_PRESETS } from "@/lib/finance";
import { guessIconKey } from "@/lib/category-icons";

const SWATCHES = CATEGORY_PRESETS.map((p) => p.color);

// Name, icon and colour. Calls onCreated(id) after the category is saved.
// Deliberately not a <form>: it is also rendered inside the Add expense form,
// and a nested form would submit the outer one and reload the page.
export default function NewCategoryForm({ onCreated, onCancel, autoFocus = true }) {
  const { addCategory, expenses } = useFinance();
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(SWATCHES[expenses.length % SWATCHES.length]);
  const [icon, setIcon] = useState(null); // null = follow the name
  const [saving, setSaving] = useState(false);
  const iconKey = icon || guessIconKey(title);

  const submit = async () => {
    const name = title.trim();
    if (!name) {
      toast.error("Category title is required");
      return;
    }
    setSaving(true);
    try {
      const id = await addCategory({ title: name, color, icon: iconKey, total: 0 });
      toast.success(`${name} created`);
      setTitle("");
      setIcon(null);
      onCreated?.(id);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label" htmlFor="cat-title">Name</label>
        <div className="flex items-center gap-3">
          <CategoryTile color={color} iconKey={iconKey} />
          <input
            id="cat-title"
            className="input"
            placeholder="e.g. Groceries"
            value={title}
            autoFocus={autoFocus}
            maxLength={40}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
        </div>
      </div>
      <div>
        <span className="field-label">Icon</span>
        <IconPicker value={iconKey} color={color} onChange={setIcon} />
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
        <button type="button" onClick={submit} className="btn btn-primary flex-1" disabled={saving}>
          {saving ? "Saving…" : "Create category"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
