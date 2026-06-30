"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Payment } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { PaymentModalForm } from "@/components/dashboard/PaymentModalForm";
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
  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    mode: "onTouched",
    reValidateMode: "onChange"
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = form;

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
        receipt_url: payment.receipt_url ?? "",
        receipt_path: payment.receipt_path ?? ""
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
    if (!selected.type.startsWith("image/") && selected.type !== "application/pdf") {
      setError("Receipt must be an image or PDF");
      return;
    }
    setFile(selected);
    setError(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!payment) return;
    try {
      setError(null);
      const receipt = file ? await uploadReceipt(file) : { receipt_url: payment.receipt_url ?? "", receipt_path: payment.receipt_path ?? "" };
      await updatePayment(payment.id, { ...values, ...receipt, due_date: values.due_date || null, transaction_ref: values.transaction_ref || "", notes: values.notes || "" });
      toast({ type: "success", message: "Payment updated" });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update payment");
    }
  });

  return (
    <Modal open={open && Boolean(payment)} onClose={onClose} title="Edit Payment" subtitle="Update payment details for 9₮H_LEGION" drawer>
      <PaymentModalForm
        form={form}
        file={file}
        currentReceiptUrl={payment?.receipt_url}
        uploadError={error}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        onFile={onFile}
        onRemoveFile={() => setFile(null)}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
