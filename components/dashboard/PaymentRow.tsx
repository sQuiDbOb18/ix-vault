"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Edit3, Image, Trash2 } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import type { Member, Payment } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn, formatDate, formatNaira, truncate } from "@/lib/utils";

function formatRelativeTime(value?: string | null) {
  if (!value) return "No payments yet";
  return `Last paid ${formatDistanceToNowStrict(new Date(value), { addSuffix: true })}`;
}

export function PaymentRow({ payment, members, index, revealOnScroll = false, onEdit, onReceipt, onDelete }: { payment: Payment; members: Member[]; index: number; revealOnScroll?: boolean; onEdit: (payment: Payment) => void; onReceipt: (payment: Payment) => void; onDelete: (payment: Payment) => void }) {
  const ref = useRef<HTMLTableRowElement>(null);
  const [visible, setVisible] = useState(!revealOnScroll);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimer = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, []);

  const member = useMemo(() => members.find((candidate) => candidate.name === payment.member_name), [members, payment.member_name]);

  const openTooltip = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setShowTooltip(true), 300);
  };

  const closeTooltip = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setShowTooltip(false);
  };

  return (
    <tr
      ref={ref}
      className={cn("payment-row border-t border-[var(--border-ghost)] transition hover:bg-[var(--bg-elevated)]", index % 2 === 1 ? "bg-[var(--bg-stripe)]" : "bg-[var(--bg-surface)]", revealOnScroll ? "history-reveal-row" : "row-enter", visible && "is-visible")}
      style={{ animationDelay: `${Math.min(index * 40, 480)}ms` }}
    >
      <td className="px-4 py-4 text-sm text-text-muted">{index + 1}</td>
      <td className="relative px-4 py-4 font-medium">
        <div className="relative inline-flex" onMouseEnter={openTooltip} onMouseLeave={closeTooltip} onFocus={openTooltip} onBlur={closeTooltip}>
          <span>{payment.member_name}</span>
          {showTooltip ? (
            <div className="absolute left-0 top-full z-20 mt-2 min-w-[220px] rounded-lg border border-[var(--border-default)] bg-[var(--bg-overlay)] p-3 text-sm shadow-lg">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-semibold text-text-primary">{payment.member_name}</span>
                <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted">Member</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-secondary">Paid</span>
                  <span className="font-medium text-[var(--status-paid)]">{formatNaira(member?.total_paid ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-secondary">Pending</span>
                  <span className="font-medium text-[var(--status-pending)]">{formatNaira(member?.total_pending ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-secondary">Payments</span>
                  <span className="font-medium text-text-primary">{member?.payment_count ?? 0}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-secondary">Last</span>
                  <span className="font-medium text-text-primary">{formatRelativeTime(member?.last_payment_date)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </td>
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
