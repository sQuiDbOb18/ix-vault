"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useKeyboard } from "@/hooks/useKeyboard";

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, 300);
  const ref = useRef<HTMLInputElement>(null);
  useKeyboard({ "/": () => ref.current?.focus() });

  useEffect(() => {
    if (debounced !== value) onChange(debounced);
  }, [debounced, onChange, value]);
  useEffect(() => setLocal(value), [value]);

  return (
    <label className="relative block min-w-0 flex-1">
      <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
      <input ref={ref} value={local} onChange={(event) => setLocal(event.target.value)} placeholder="Search member or tx ref" className="h-11 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted" />
    </label>
  );
}
