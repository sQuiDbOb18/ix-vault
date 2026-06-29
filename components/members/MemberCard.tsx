"use client";

import { useState } from "react";
import type { Member, Payment } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatNaira } from "@/lib/utils";

export function MemberCard({ member, payments }: { member: Member; payments: Payment[] }) {
  const [expanded, setExpanded] = useState(false);
  const roleColor = member.role === "Commander" ? "var(--accent-gold)" : member.role === "Officer" ? "var(--accent-cobalt)" : "var(--border-default)";
  const history = payments.filter((payment) => payment.member_name === member.name);
  return (
    <article className="premium-card hover-lift cursor-pointer p-5" style={{ borderLeft: `3px solid ${roleColor}` }} onClick={() => setExpanded((value) => !value)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">{member.name}</h3>
          <p className="text-xs text-text-secondary">{member.tag ?? "No clan tag"}</p>
        </div>
        <span className="rounded-full border border-[var(--border-subtle)] px-2 py-1 text-xs text-text-secondary">{member.role}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-text-secondary">Total paid</p><p className="amount text-[var(--status-paid)]">{formatNaira(member.total_paid ?? 0)}</p></div>
        <div><p className="text-text-secondary">Pending</p><p className="amount text-[var(--status-pending)]">{formatNaira(member.total_pending ?? 0)}</p></div>
        <div><p className="text-text-secondary">Payments</p><p className="amount">{member.payment_count ?? 0}</p></div>
        <div><p className="text-text-secondary">Last payment</p><p>{formatDate(member.last_payment_date)}</p></div>
      </div>
      {expanded && (
        <div className="mt-4 space-y-2 border-t border-[var(--border-ghost)] pt-4">
          {history.length === 0 && <p className="text-sm text-text-secondary">No payments recorded.</p>}
          {history.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between gap-3 rounded-md bg-[var(--bg-elevated)] p-3 text-sm">
              <span>{formatDate(payment.payment_date)}</span>
              <span className="amount">{formatNaira(payment.amount)}</span>
              <Badge status={payment.status} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
