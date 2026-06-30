import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "danger" | "icon";

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" && "primary-action text-white",
        variant === "ghost" && "border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-text-secondary hover:text-text-primary",
        variant === "danger" && "bg-[var(--status-overdue)] text-white hover:brightness-110",
        variant === "icon" && "h-9 w-9 min-h-9 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-0 text-text-secondary hover:text-text-primary",
        className
      )}
      {...props}
    />
  );
}
