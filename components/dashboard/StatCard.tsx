"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { cn, formatNaira } from "@/lib/utils";
import { Sparkline } from "@/components/ui/Sparkline";

export function StatCard({
  label,
  value,
  icon: Icon,
  theme,
  index,
  format = "currency",
  sparklineData,
  sparklineColor
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  theme: "cobalt" | "gold" | "rose" | "emerald";
  index: number;
  format?: "currency" | "percent";
  sparklineData?: number[];
  sparklineColor?: string;
}) {
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

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      className={cn("stat-card premium-card relative overflow-hidden bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-surface)] p-5", `stat-card-${theme}`)}
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseMove={onMouseMove}
    >
      <Icon size={48} className="stat-card-icon absolute right-4 top-4 opacity-[0.06]" />
      <p className="mb-3 font-display text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">{label}</p>
      <p className={cn("stat-card-value amount font-display text-3xl font-bold sm:text-4xl", flash && "value-flash")}>{format === "currency" ? formatNaira(count) : `${Math.round(count)}%`}</p>
      {sparklineData && sparklineData.length >= 2 && sparklineColor ? (
        <div className="absolute bottom-3 right-3 opacity-80">
          <Sparkline data={sparklineData} color={sparklineColor} width={80} height={28} />
        </div>
      ) : null}
    </div>
  );
}
