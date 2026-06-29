import { Edit3, Image, Trash2 } from "lucide-react";
import type { Payment } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatNaira } from "@/lib/utils";

export function MobilePaymentCard({ payment, onEdit, onReceipt, onDelete }: { payment: Payment; onEdit: (payment: Payment) => void; onReceipt: (payment: Payment) => void; onDelete: (payment: Payment) => void }) {
  return (
    <article className="premium-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg">{payment.member_name}</h3>
          <p className="text-sm text-text-secondary">{formatDate(payment.payment_date)} · {payment.payment_method}</p>
        </div>
        <Badge status={payment.status} />
      </div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <p className="amount text-xl">{formatNaira(payment.amount)}</p>
        <p className="tx-ref truncate text-xs text-text-secondary">{payment.transaction_ref ?? "No reference"}</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="icon" aria-label="Edit payment" onClick={() => onEdit(payment)}><Edit3 size={15} /></Button>
        {payment.receipt_url && <Button variant="icon" aria-label="Open receipt" onClick={() => onReceipt(payment)}><Image size={15} /></Button>}
        <Button variant="icon" aria-label="Delete payment" onClick={() => onDelete(payment)}><Trash2 size={15} /></Button>
      </div>
    </article>
  );
}
