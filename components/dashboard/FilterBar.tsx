"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { PaymentFilters, PaymentMethod, PaymentStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const statuses: Array<PaymentStatus | "All"> = ["All", "Paid", "Pending", "Overdue"];

export function FilterBar({ filters, onChange, onClear }: { filters: PaymentFilters; onChange: (patch: PaymentFilters) => void; onClear: () => void }) {
  const [expanded, setExpanded] = useState(Boolean(filters.dateFrom || filters.dateTo));
  const active = [filters.status && filters.status !== "All", filters.method && filters.method !== "All", filters.dateFrom, filters.dateTo].filter(Boolean).length;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((status) => (
          <button key={status} type="button" onClick={() => onChange({ status })} className={cn("rounded-full border px-3 py-1.5 text-sm transition", (filters.status ?? "All") === status ? "border-[var(--border-active)] bg-[var(--accent-cobalt-soft)] text-text-primary" : "border-[var(--border-subtle)] text-text-secondary hover:text-text-primary")}>{status}</button>
        ))}
        <select value={filters.method ?? "All"} onChange={(event) => onChange({ method: event.target.value as PaymentMethod | "All" })} className="h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 text-sm text-text-primary">
          {["All", "Transfer", "Cash", "Other"].map((method) => <option key={method}>{method}</option>)}
        </select>
        <Button variant="ghost" className="h-9 min-h-9 rounded-full px-3" onClick={() => setExpanded((value) => !value)}><SlidersHorizontal size={15} /> Filters{active ? ` (${active})` : ""}</Button>
        {active > 0 && <Button variant="ghost" className="h-9 min-h-9 rounded-full px-3" onClick={onClear}><X size={15} /> Clear All</Button>}
      </div>
      {expanded && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Input type="date" label="From" value={filters.dateFrom ?? ""} onChange={(event) => onChange({ dateFrom: event.target.value })} />
          <Input type="date" label="To" value={filters.dateTo ?? ""} onChange={(event) => onChange({ dateTo: event.target.value })} />
        </div>
      )}
    </div>
  );
}
