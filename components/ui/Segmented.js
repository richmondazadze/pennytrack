"use client";

import { motion } from "framer-motion";

// Pill segmented control with a sliding thumb.
export default function Segmented({ options, value, onChange, id = "seg", className = "" }) {
  return (
    <div className={`inline-flex rounded-full bg-sunken p-1 ${className}`} role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`relative h-9 flex-1 rounded-full px-4 text-sm font-semibold transition-colors ${
              active ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`${id}-thumb`}
                className="absolute inset-0 rounded-full bg-surface shadow-raised"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
