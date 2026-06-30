"use client";

import { useEffect, useRef, useState } from "react";
import { Edit3, Image, Trash2 } from "lucide-react";
import type { Payment } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn, formatDate, formatNaira, truncate } from "@/lib/utils";

export function PaymentRow({ payment, index, revealOnScroll = false, onEdit, onReceipt, onDelete }: { payment: Payment; index: number; revealOnScroll?: boolean; onEdit: (payment: Payment) => void; onReceipt: (payment: Payment) => void; onDelete: (payment: Payment) => void }) {
  const ref = useRef<HTMLTableRowElement>(null);
  const [visible, setVisible] = useState(!revealOnScroll);

  useEffect(() => {
    if (!revealOnScroll || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [revealOnScroll]);

  return (
    <tr
      ref={ref}
      className={cn("payment-row border-t border-[var(--border-ghost)] transition hover:bg-[var(--bg-elevated)]", revealOnScroll ? "history-reveal-row" : "row-enter", visible && "is-visible")}
      style={{ animationDelay: `${Math.min(index * 40, 480)}ms` }}
    >
      <td className="px-4 py-4 text-sm text-text-muted">{index + 1}</td>
      <td className="px-4 py-4 font-medium">{payment.member_name}</td>
      <td className="amount px-4 py-4 text-right">{formatNaira(payment.amount)}</td>
      <td className="px-4 py-4 text-sm text-text-secondary">{formatDate(payment.payment_date)}</td>
      <td className="px-4 py-4 text-sm text-text-secondary">{payment.payment_method}</td>
      <td className="px-4 py-4"><Badge status={payment.status} /></td>
      <td className="tx-ref px-4 py-4 text-sm">{payment.transaction_ref ? <Tooltip label={payment.transaction_ref}><span>{truncate(payment.transaction_ref, 16)}</span></Tooltip> : "—"}</td>
      <td className="px-4 py-4">
        <div className="flex justify-end gap-2">
          <Tooltip label="Edit"><Button variant="icon" aria-label="Edit payment" onClick={() => onEdit(payment)}><Edit3 size={15} /></Button></Tooltip>
          {payment.receipt_url && <Tooltip label="Receipt"><Button variant="icon" aria-label="Open receipt" onClick={() => onReceipt(payment)}><Image size={15} /></Button></Tooltip>}
          <Tooltip label="Delete"><Button variant="icon" aria-label="Delete payment" onClick={() => onDelete(payment)}><Trash2 size={15} /></Button></Tooltip>
        </div>
      </td>
    </tr>
  );
}
