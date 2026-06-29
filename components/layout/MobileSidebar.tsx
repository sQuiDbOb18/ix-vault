"use client";

import { X } from "lucide-react";
import { SidebarContent } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-[rgba(6,8,16,0.72)] backdrop-blur-md lg:hidden" onMouseDown={onClose}>
      <div onMouseDown={(event) => event.stopPropagation()} className="relative flex h-full w-72 flex-col border-r border-[var(--border-ghost)] bg-[var(--bg-void)] p-5">
        <SidebarContent />
        <Button variant="icon" className="absolute right-3 top-3" aria-label="Close navigation" onClick={onClose}><X size={16} /></Button>
      </div>
    </div>
  );
}
