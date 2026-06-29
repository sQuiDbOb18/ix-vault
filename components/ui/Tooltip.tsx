"use client";

import { useState } from "react";

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open && <span className="absolute bottom-full left-1/2 z-20 mb-2 max-w-xs -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border-subtle)] bg-[var(--bg-overlay)] px-2 py-1 text-xs text-text-primary shadow-premium">{label}</span>}
    </span>
  );
}
