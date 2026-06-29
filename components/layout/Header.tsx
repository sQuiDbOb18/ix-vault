"use client";

import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header({ onMenu, onAdd }: { onMenu: () => void; onAdd: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-ghost)] bg-[rgba(9,12,24,0.86)] px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="icon" className="lg:hidden" aria-label="Open navigation" onClick={onMenu}><Menu size={18} /></Button>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">Command Treasury</p>
            <h1 className="text-xl sm:text-2xl">IX VAULT</h1>
          </div>
        </div>
        <Button onClick={onAdd}><Plus size={17} /> Add Payment</Button>
      </div>
    </header>
  );
}
