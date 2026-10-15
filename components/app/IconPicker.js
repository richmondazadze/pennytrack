"use client";

import { CATEGORY_ICONS } from "@/lib/category-icons";

// Grid of category icons; the selected one is filled with the category colour.
export default function IconPicker({ value, color, onChange }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8" role="radiogroup" aria-label="Icon">
      {Object.entries(CATEGORY_ICONS).map(([key, { icon: Icon, label }]) => {
        const on = key === value;
        return (
          <button
            type="button"
            key={key}
            role="radio"
            aria-checked={on}
            aria-label={label}
            title={label}
            onClick={() => onChange(key)}
            className={`flex aspect-square items-center justify-center rounded-md text-xl transition active:scale-90 ${
              on ? "text-white shadow-raised" : "bg-sunken text-muted hover:text-fg"
            }`}
            style={on ? { backgroundColor: color } : undefined}
          >
            <Icon aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
