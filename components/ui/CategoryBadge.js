import { CategoryIcon } from "@/lib/category-icons";

// Soft tile in the category's colour with its icon, used in rows, cards and sheets.
export function CategoryTile({ category, color = category?.color, iconKey, size = "md" }) {
  const box = size === "sm" ? "h-9 w-9 text-[17px]" : size === "lg" ? "h-14 w-14 text-2xl" : "h-11 w-11 text-xl";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md ${box}`}
      style={{ backgroundColor: `${color}24`, color }}
    >
      <CategoryIcon category={category} iconKey={iconKey} className="drop-shadow-[0_0_0.5px_rgba(0,0,0,.25)]" />
    </span>
  );
}

export function CategoryChip({ category, title = category?.title, color = category?.color, iconKey, selected, onClick }) {
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
      <span className={selected ? "text-lime dark:text-forest" : ""} style={selected ? undefined : { color }}>
        <CategoryIcon category={category || { title }} iconKey={iconKey} className="text-[15px]" />
      </span>
      {title}
    </button>
  );
}
