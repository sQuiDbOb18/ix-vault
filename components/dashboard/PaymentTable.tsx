"use client";

import { ArrowDownUp } from "lucide-react";
import type { Member, Payment, PaymentFilters } from "@/types";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MobilePaymentCard } from "@/components/dashboard/MobilePaymentCard";
import { PaymentRow } from "@/components/dashboard/PaymentRow";
import { SkeletonRow } from "@/components/dashboard/SkeletonRow";

const headers: Array<{ key?: PaymentFilters["sortBy"]; label: string; align?: string }> = [
  { label: "#" },
  { key: "member_name", label: "Member" },
  { key: "amount", label: "Amount", align: "text-right" },
  { key: "payment_date", label: "Date" },
  { label: "Method" },
  { label: "Status" },
  { label: "Tx Ref" },
  { label: "Actions", align: "text-right" }
];

export function PaymentTable({ payments, members, isLoading, filters, onSort, onAdd, onEdit, onReceipt, onDelete, revealOnScroll = false }: { payments: Payment[]; members: Member[]; isLoading: boolean; filters: PaymentFilters; onSort: (sortBy: NonNullable<PaymentFilters["sortBy"]>) => void; onAdd: () => void; onEdit: (payment: Payment) => void; onReceipt: (payment: Payment) => void; onDelete: (payment: Payment) => void; revealOnScroll?: boolean }) {
  if (!isLoading && payments.length === 0) return <EmptyState onAdd={onAdd} />;
  return (
    <>
      <div className="payment-table-shell hidden overflow-hidden rounded-card shadow-premium md:block">
        <table className="w-full border-collapse bg-[var(--bg-surface)] text-left text-sm">
          <thead className="bg-[var(--bg-elevated)] text-xs uppercase tracking-[0.08em] text-text-secondary">
            <tr>
              {headers.map((header) => (
                <th key={header.label} className={`px-4 py-3 font-medium ${header.align ?? ""}`}>
                  {header.key ? (
                    <button type="button" className="inline-flex items-center gap-2 hover:text-text-primary" onClick={() => header.key && onSort(header.key)}>
                      {header.label}<ArrowDownUp size={13} className={filters.sortBy === header.key ? "text-text-accent" : ""} />
                    </button>
                  ) : header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={index} />) : payments.map((payment, index) => <PaymentRow key={payment.id} payment={payment} members={members} index={index} revealOnScroll={revealOnScroll} onEdit={onEdit} onReceipt={onReceipt} onDelete={onDelete} />)}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {isLoading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton h-40 rounded-card" />) : payments.map((payment) => <MobilePaymentCard key={payment.id} payment={payment} onEdit={onEdit} onReceipt={onReceipt} onDelete={onDelete} />)}
      </div>
    </>
  );
}
