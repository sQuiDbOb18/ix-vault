import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Select({ label, error, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">{label}</span>}
      <span className="relative block">
        <select
          className={cn("h-11 w-full appearance-none rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 pr-9 text-sm text-text-primary transition focus:border-[var(--border-active)]", error && "border-[var(--status-overdue)]", className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
      </span>
      {error && <span className="text-xs text-[var(--status-overdue)]">{error}</span>}
    </label>
  );
}
