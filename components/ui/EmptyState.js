import { AppIcon } from "@/components/brand/Logo";

export default function EmptyState({ title, body, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center px-6 py-10 text-center ${className}`}>
      <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-lime/25">
        <AppIcon className="h-9 w-9" />
      </span>
      <h3 className="text-h3">{title}</h3>
      {body && <p className="mt-1 max-w-xs text-sm text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
