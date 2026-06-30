"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  drawer = false,
  className
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  drawer?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);
  if (!open) return null;
  return (
    <div className="modal-backdrop fixed inset-0 z-50 bg-[rgba(6,8,16,0.72)] backdrop-blur-md" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn("premium-card fixed max-h-[calc(100vh-2rem)] overflow-auto p-5", drawer ? "drawer-in right-4 top-4 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[520px]" : "left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2", className)}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[22px] font-semibold leading-tight text-text-primary">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-text-secondary transition hover:rotate-90 hover:border-[var(--border-active)] hover:text-text-primary"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
