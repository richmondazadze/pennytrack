const P_PATH =
  "M67 46H135A64 64 0 0 1 135 174H97V190A20 20 0 0 1 57 190V56A10 10 0 0 1 67 46ZM161 110A26 26 0 1 0 109 110A26 26 0 1 0 161 110ZM165 194A16 16 0 1 1 197 194A16 16 0 1 1 165 194Z";

// The Pesewa P on its own. Inherits colour from `currentColor`.
export function Symbol({ className = "h-6 w-6", title }) {
  return (
    <svg viewBox="40 40 176 176" className={className} aria-hidden={!title} role={title ? "img" : undefined}>
      {title && <title>{title}</title>}
      <path d={P_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

// App-icon tile: lime P on a forest square.
export function AppIcon({ className = "h-9 w-9" }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-[28%] bg-forest text-lime ${className}`}>
      <Symbol className="h-[66%] w-[66%]" />
    </span>
  );
}

// Horizontal lockup. `tone="light"` for dark backgrounds.
export default function Logo({ tone = "dark", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AppIcon className="h-9 w-9" />
      <span className="text-[21px] font-bold tracking-[-0.02em]">
        <span className={tone === "light" ? "text-white" : "text-fg"}>Penny</span>
        <span className={tone === "light" ? "text-lime" : "text-forest-600 dark:text-lime"}>Track</span>
      </span>
    </span>
  );
}
