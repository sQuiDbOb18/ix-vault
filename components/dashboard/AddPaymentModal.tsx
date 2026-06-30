"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { PaymentModalForm } from "@/components/dashboard/PaymentModalForm";
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

export function AddPaymentModal({ open, onClose, prefilledMemberName }: { open: boolean; onClose: () => void; prefilledMemberName?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memberNameLocked, setMemberNameLocked] = useState(Boolean(prefilledMemberName));
  const { createPayment } = usePayments();
  const { members } = useMembers();
  const { toast } = useToast();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultStatus: PaymentInput["status"] = prefilledMemberName ? "Pending" : "Paid";
  const defaultPaymentDate = prefilledMemberName ? "" : today;
  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { member_name: prefilledMemberName ?? "", amount: undefined as unknown as number, payment_date: defaultPaymentDate, status: defaultStatus, payment_method: "Transfer", due_date: "", transaction_ref: "", notes: "", receipt_url: "", receipt_path: "" }
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (open) {
      setError(null);
      setFile(null);
      setMemberNameLocked(Boolean(prefilledMemberName));
      reset({ member_name: prefilledMemberName ?? "", amount: undefined as unknown as number, payment_date: defaultPaymentDate, status: defaultStatus, payment_method: "Transfer", due_date: "", transaction_ref: "", notes: "", receipt_url: "", receipt_path: "" });
    }
  }, [defaultPaymentDate, defaultStatus, open, prefilledMemberName, reset]);

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
      await createPayment({ ...values, ...receipt, due_date: values.due_date || null, transaction_ref: values.transaction_ref || "", notes: values.notes || "" });
      toast({ type: "success", message: "Payment added" });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add payment");
    }
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Payment" subtitle="Record a new payment for 9₮H_LEGION" drawer>
      <PaymentModalForm
        form={form}
        members={members}
        memberNameLocked={memberNameLocked}
        file={file}
        uploadError={error}
        isSubmitting={isSubmitting}
        submitLabel="Save Payment"
        onUnlockMemberName={() => setMemberNameLocked(false)}
        onFile={onFile}
        onRemoveFile={() => setFile(null)}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
