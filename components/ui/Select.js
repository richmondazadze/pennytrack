import { LuChevronDown } from "react-icons/lu";

// Native select with the design system's pill styling and a padded chevron.
export default function Select({ className = "", children, ...props }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <select
        {...props}
        className="input h-11 w-full cursor-pointer appearance-none rounded-full pl-4 pr-12 text-sm font-bold"
      >
        {children}
      </select>
      <LuChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-muted" />
    </span>
  );
}
