"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImage, FileText, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import type { Payment } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { usePayments } from "@/hooks/usePayments";
import { paymentSchema, type PaymentInput } from "@/lib/validations";
import { useToast } from "@/components/providers/ToastProvider";

async function uploadReceipt(file: File) {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: form });
  if (!response.ok) throw new Error((await response.json()).error ?? "Unable to upload receipt");
  return (await response.json()) as { receipt_url: string; receipt_path: string };
}

export function EditPaymentModal({ payment, open, onClose }: { payment: Payment | null; open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { updatePayment } = usePayments();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PaymentInput>({ resolver: zodResolver(paymentSchema) });

  useEffect(() => {
    if (payment) {
      reset({
        member_name: payment.member_name,
        amount: payment.amount,
        payment_date: payment.payment_date,
        due_date: payment.due_date ?? "",
        status: payment.status,
        payment_method: payment.payment_method,
        transaction_ref: payment.transaction_ref ?? "",
        notes: payment.notes ?? "",
        receipt_url: payment.receipt_url ?? null,
        receipt_path: payment.receipt_path ?? null
      });
      setFile(null);
      setError(null);
    }
  }, [payment, reset]);

  const onFile = (selected?: File) => {
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      setError("Receipt must be 5MB or smaller");
      return;
    }
    setFile(selected);
    setError(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!payment) return;
    try {
      setError(null);
      const receipt = file ? await uploadReceipt(file) : { receipt_url: payment.receipt_url, receipt_path: payment.receipt_path };
      await updatePayment(payment.id, { ...values, ...receipt, due_date: values.due_date || null, transaction_ref: values.transaction_ref || null, notes: values.notes || null });
      toast({ type: "success", message: "Payment updated" });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update payment");
    }
  });

  return (
    <Modal open={open && Boolean(payment)} onClose={onClose} title="Edit Payment" drawer>
      <div className="space-y-4">
        <Input label="Member Name" error={errors.member_name?.message} {...register("member_name")} />
        <Input label="Amount ₦" type="number" min="1" step="0.01" error={errors.amount?.message} {...register("amount", { valueAsNumber: true })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Payment Date" type="date" error={errors.payment_date?.message} {...register("payment_date")} />
          <Input label="Due Date" type="date" error={errors.due_date?.message} {...register("due_date")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Status" error={errors.status?.message} {...register("status")}>{["Paid", "Pending", "Overdue"].map((status) => <option key={status}>{status}</option>)}</Select>
          <Select label="Payment Method" error={errors.payment_method?.message} {...register("payment_method")}>{["Transfer", "Cash", "Other"].map((method) => <option key={method}>{method}</option>)}</Select>
        </div>
        <Input label="Transaction Reference" error={errors.transaction_ref?.message} {...register("transaction_ref")} />
        <Textarea label="Notes" rows={3} error={errors.notes?.message} {...register("notes")} />
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[var(--border-default)] bg-[var(--bg-input)] p-5 text-center transition hover:border-[var(--border-active)]">
          <input className="sr-only" type="file" accept="image/*,application/pdf" onChange={(event) => onFile(event.target.files?.[0])} />
          {file ? (file.type === "application/pdf" ? <FileText className="mb-2 text-text-accent" /> : <FileImage className="mb-2 text-text-accent" />) : <Upload className="mb-2 text-text-accent" />}
          <span className="text-sm text-text-primary">{file ? file.name : payment?.receipt_url ? "Replace current receipt" : "Upload receipt"}</span>
          <span className="text-xs text-text-secondary">Images or PDF, up to 5MB</span>
        </label>
        {error && <p className="rounded-md border border-[var(--status-overdue-border)] bg-[var(--status-overdue-bg)] p-3 text-sm text-[var(--status-overdue)]">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
        </div>
      </div>
    </Modal>
  );
}
