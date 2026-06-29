import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ label, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">{label}</span>}
      <input
        className={cn("h-11 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 text-sm text-text-primary transition placeholder:text-text-muted focus:border-[var(--border-active)]", error && "border-[var(--status-overdue)]", className)}
        {...props}
      />
      {error && <span className="text-xs text-[var(--status-overdue)]">{error}</span>}
    </label>
  );
}
