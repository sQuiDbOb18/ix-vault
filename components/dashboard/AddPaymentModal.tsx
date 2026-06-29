"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImage, FileText, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { usePayments } from "@/hooks/usePayments";
import { useMembers } from "@/hooks/useMembers";
import { paymentSchema, type PaymentInput } from "@/lib/validations";
import { useToast } from "@/components/providers/ToastProvider";

async function uploadReceipt(file: File) {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: form });
  if (!response.ok) throw new Error((await response.json()).error ?? "Unable to upload receipt");
  return (await response.json()) as { receipt_url: string; receipt_path: string };
}

export function AddPaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { createPayment } = usePayments();
  const { members } = useMembers();
  const { toast } = useToast();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { member_name: "", amount: 0, payment_date: today, status: "Paid", payment_method: "Transfer", due_date: "", transaction_ref: "", notes: "" }
  });

  useEffect(() => {
    if (open) {
      setError(null);
      setFile(null);
      reset({ member_name: "", amount: 0, payment_date: today, status: "Paid", payment_method: "Transfer", due_date: "", transaction_ref: "", notes: "" });
    }
  }, [open, reset, today]);

  const onFile = (selected?: File) => {
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      setError("Receipt must be 5MB or smaller");
      return;
    }
    if (!selected.type.startsWith("image/") && selected.type !== "application/pdf") {
      setError("Receipt must be an image or PDF");
      return;
    }
    setFile(selected);
    setError(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      const receipt = file ? await uploadReceipt(file) : {};
      await createPayment({ ...values, ...receipt, due_date: values.due_date || null, transaction_ref: values.transaction_ref || null, notes: values.notes || null });
      toast({ type: "success", message: "Payment added" });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add payment");
    }
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Payment" drawer>
      <div className="space-y-4">
        <Input label="Member Name" list="member-names" error={errors.member_name?.message} {...register("member_name")} />
        <datalist id="member-names">{members.map((member) => <option key={member.id} value={member.name} />)}</datalist>
        <Input label="Amount ₦" type="number" min="1" step="0.01" error={errors.amount?.message} {...register("amount", { valueAsNumber: true })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Payment Date" type="date" error={errors.payment_date?.message} {...register("payment_date")} />
          <Input label="Due Date" type="date" error={errors.due_date?.message} {...register("due_date")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Status" error={errors.status?.message} {...register("status")}>
            {["Paid", "Pending", "Overdue"].map((status) => <option key={status}>{status}</option>)}
          </Select>
          <Select label="Payment Method" error={errors.payment_method?.message} {...register("payment_method")}>
            {["Transfer", "Cash", "Other"].map((method) => <option key={method}>{method}</option>)}
          </Select>
        </div>
        <Input label="Transaction Reference" error={errors.transaction_ref?.message} {...register("transaction_ref")} />
        <Textarea label="Notes" rows={3} error={errors.notes?.message} {...register("notes")} />
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[var(--border-default)] bg-[var(--bg-input)] p-5 text-center transition hover:border-[var(--border-active)]">
          <input className="sr-only" type="file" accept="image/*,application/pdf" onChange={(event) => onFile(event.target.files?.[0])} />
          {file ? (file.type === "application/pdf" ? <FileText className="mb-2 text-text-accent" /> : <FileImage className="mb-2 text-text-accent" />) : <Upload className="mb-2 text-text-accent" />}
          <span className="text-sm text-text-primary">{file ? file.name : "Upload receipt"}</span>
          <span className="text-xs text-text-secondary">Images or PDF, up to 5MB</span>
        </label>
        {error && <p className="rounded-md border border-[var(--status-overdue-border)] bg-[var(--status-overdue-bg)] p-3 text-sm text-[var(--status-overdue)]">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Payment"}</Button>
        </div>
      </div>
    </Modal>
  );
}
