import type { PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";

export function Badge({ status }: { status: PaymentStatus }) {
  const map = {
    Paid: "border-[var(--status-paid-border)] bg-[var(--status-paid-bg)] text-[var(--status-paid)]",
    Pending: "border-[var(--status-pending-border)] bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
    Overdue: "border-[var(--status-overdue-border)] bg-[var(--status-overdue-bg)] text-[var(--status-overdue)]"
  };
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium", map[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", status !== "Paid" && "animate-[pulse_2s_ease-in-out_infinite]")} />
      {status}
    </span>
  );
}
