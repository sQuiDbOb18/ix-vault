"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
type ToastInput = { type: ToastType; message: string };
type ToastItem = ToastInput & { id: string; closing: boolean };

const ToastContext = createContext<{ toast: (input: ToastInput) => void } | null>(null);

function SuccessIcon() {
  return (
    <svg className="toast-check" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
      <path d="M5 9.2 7.7 12 13 6.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

const styles: Record<ToastType, { border: string; icon: React.ReactNode }> = {
  success: { border: "border-l-[var(--status-paid)]", icon: <SuccessIcon /> },
  error: { border: "border-l-[var(--status-overdue)]", icon: <AlertCircle size={18} /> },
  info: { border: "border-l-[var(--accent-cobalt)]", icon: <Info size={18} /> }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, closing: true } : item)));
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 220);
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      setItems((current) => [...current, { ...input, id, closing: false }]);
      window.setTimeout(() => remove(id), 3000);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "premium-card toast-enter flex items-start gap-3 border-l-2 p-4 text-sm text-text-primary",
              styles[item.type].border,
              item.closing && "toast-exit"
            )}
          >
            <span className="mt-0.5 text-text-accent">{styles[item.type].icon}</span>
            <p className="flex-1">{item.message}</p>
            <button type="button" aria-label="Dismiss toast" onClick={() => remove(item.id)} className="text-text-secondary hover:text-text-primary">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
