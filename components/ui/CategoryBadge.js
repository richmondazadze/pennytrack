// Soft tile with the category's colour dot, used in rows and lists.
export function CategoryTile({ color, size = "md" }) {
  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const dot = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md ${box}`}
      style={{ backgroundColor: `${color}22` }}
    >
      <span className={`rounded-full ${dot}`} style={{ backgroundColor: color }} />
    </span>
  );
}

export function CategoryChip({ title, color, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`chip capitalize ${
        selected ? "bg-forest text-white dark:bg-lime dark:text-forest" : "text-fg hover:brightness-95"
      }`}
      style={selected ? undefined : { backgroundColor: `${color}22` }}
    >
      <span
        className={`h-2 w-2 rounded-full ${selected ? "bg-lime dark:bg-forest" : ""}`}
        style={selected ? undefined : { backgroundColor: color }}
      />
      {title}
    </button>
  );
}
