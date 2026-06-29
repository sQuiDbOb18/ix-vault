"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { cn, formatNaira } from "@/lib/utils";

export function StatCard({ label, value, icon: Icon, color, format = "currency" }: { label: string; value: number; icon: LucideIcon; color: string; format?: "currency" | "percent" }) {
  const count = useCountUp(value);
  const previous = useRef(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (previous.current !== value) {
      setFlash(true);
      const timer = window.setTimeout(() => setFlash(false), 420);
      previous.current = value;
      return () => window.clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="premium-card hover-lift relative overflow-hidden bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-surface)] p-5" style={{ borderTop: `3px solid ${color}` }}>
      <Icon size={48} className="absolute right-4 top-4 opacity-[0.06]" />
      <p className="mb-3 font-display text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">{label}</p>
      <p className={cn("amount font-display text-3xl font-bold sm:text-4xl", flash && "value-flash")}>{format === "currency" ? formatNaira(count) : `${Math.round(count)}%`}</p>
    </div>
  );
}
