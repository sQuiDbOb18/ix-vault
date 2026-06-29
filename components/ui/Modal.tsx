"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, title, children, drawer = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; drawer?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[rgba(6,8,16,0.72)] backdrop-blur-md" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn("premium-card fixed max-h-[calc(100vh-2rem)] overflow-auto p-5", drawer ? "drawer-in right-4 top-4 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[480px]" : "left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2")}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl">{title}</h2>
          <Button variant="icon" aria-label="Close modal" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
