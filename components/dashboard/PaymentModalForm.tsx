"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { AlertCircle, CloudUpload, FileImage, FileText, Loader2, X } from "lucide-react";
import { Controller, type FieldPath, type UseFormReturn } from "react-hook-form";
import type { Member, PaymentMethod, PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";
import type { PaymentInput } from "@/lib/validations";

const statusOptions: PaymentStatus[] = ["Paid", "Pending", "Overdue"];
const methodOptions: PaymentMethod[] = ["Transfer", "Cash", "Other"];

const statusStyles: Record<PaymentStatus, string> = {
  Paid: "border-[var(--status-paid-border)] bg-[var(--status-paid-bg)] text-[var(--status-paid)]",
  Pending: "border-[var(--status-pending-border)] bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
  Overdue: "border-[var(--status-overdue-border)] bg-[var(--status-overdue-bg)] text-[var(--status-overdue)]"
};

function formatAmount(value: unknown) {
  if (value === undefined || value === null || value === "" || Number.isNaN(value)) return "";
  const [whole, decimal] = String(value).replace(/,/g, "").split(".");
  const formattedWhole = whole ? Number(whole).toLocaleString("en-NG") : "";
  return decimal !== undefined ? `${formattedWhole}.${decimal.slice(0, 2)}` : formattedWhole;
}

function parseAmount(value: string) {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const [whole = "", ...rest] = cleaned.split(".");
  const normalized = rest.length ? `${whole}.${rest.join("")}` : whole;
  return normalized === "" ? undefined : Number(normalized);
}

function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function shouldShowError(form: UseFormReturn<PaymentInput>, name: FieldPath<PaymentInput>) {
  return Boolean(form.formState.isSubmitted || form.formState.touchedFields[name]);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--status-overdue)]">
      <AlertCircle size={13} />
      <span>{message}</span>
    </p>
  );
}

function Label({ children, optional = false }: { children: string; optional?: boolean }) {
  return (
    <span className="mb-2 block text-xs font-semibold uppercase text-text-secondary">
      {children} {optional && <span className="font-medium text-text-muted">(Optional)</span>}
    </span>
  );
}

function inputClass(hasError?: boolean) {
  return cn(
    "min-h-11 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 text-sm text-text-primary shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] transition placeholder:text-text-muted focus:border-[var(--border-active)] focus:outline-none focus:shadow-[0_0_0_3px_var(--accent-cobalt-soft)]",
    hasError && "border-[var(--status-overdue-border)] shadow-[0_0_0_3px_rgba(240,62,90,0.08)]"
  );
}

function TextField({
  formApi,
  name,
  label,
  optional,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  formApi: UseFormReturn<PaymentInput>;
  name: FieldPath<PaymentInput>;
  label: string;
  optional?: boolean;
}) {
  const error = shouldShowError(formApi, name) ? formApi.formState.errors[name]?.message?.toString() : undefined;
  return (
    <label className="block">
      <Label optional={optional}>{label}</Label>
      <input className={cn(inputClass(Boolean(error)), className)} {...formApi.register(name)} {...props} />
      <FieldError message={error} />
    </label>
  );
}

function AmountField({ form }: { form: UseFormReturn<PaymentInput> }) {
  const error = shouldShowError(form, "amount") ? form.formState.errors.amount?.message : undefined;
  return (
    <Controller
      control={form.control}
      name="amount"
      render={({ field }) => (
        <label className="block">
          <Label>Amount</Label>
          <div
            className={cn(
              "flex min-h-12 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition focus-within:border-[var(--border-active)] focus-within:shadow-[0_0_0_3px_var(--accent-cobalt-soft)]",
              error && "border-[var(--status-overdue-border)] shadow-[0_0_0_3px_rgba(240,62,90,0.08)]"
            )}
          >
            <span className="flex w-12 items-center justify-center border-r border-[var(--border-subtle)] font-mono text-lg font-medium text-[var(--accent-cobalt)]">₦</span>
            <input
              inputMode="decimal"
              value={formatAmount(field.value)}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(parseAmount(event.target.value))}
              placeholder="0"
              className="h-12 min-w-0 flex-1 bg-transparent px-3 font-mono text-2xl text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>
          <FieldError message={error} />
        </label>
      )}
    />
  );
}

function StatusControl({ form }: { form: UseFormReturn<PaymentInput> }) {
  const error = shouldShowError(form, "status") ? form.formState.errors.status?.message : undefined;
  return (
    <Controller
      control={form.control}
      name="status"
      render={({ field }) => (
        <div>
          <Label>Status</Label>
          <div className="grid grid-cols-3 gap-2">
            {statusOptions.map((status) => {
              const selected = field.value === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => field.onChange(status)}
                  className={cn(
                    "min-h-11 rounded-full border px-3 text-sm font-medium transition",
                    selected ? statusStyles[status] : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-text-secondary hover:border-[var(--border-active)] hover:text-text-primary"
                  )}
                >
                  {status}
                </button>
              );
            })}
          </div>
          <FieldError message={error} />
        </div>
      )}
    />
  );
}

function MethodControl({ form }: { form: UseFormReturn<PaymentInput> }) {
  return (
    <Controller
      control={form.control}
      name="payment_method"
      render={({ field }) => (
        <div>
          <Label>Payment Method</Label>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-1">
            {methodOptions.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => field.onChange(method)}
                className={cn(
                  "min-h-10 rounded-full px-3 text-sm font-medium transition",
                  field.value === method ? "bg-[var(--accent-cobalt)] text-white shadow-[0_0_18px_var(--accent-cobalt-glow)]" : "text-text-secondary hover:bg-[var(--bg-elevated)] hover:text-text-primary"
                )}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}
    />
  );
}

function ReceiptUpload({
  file,
  currentReceiptUrl,
  onFile,
  onRemove
}: {
  file: File | null;
  currentReceiptUrl?: string | null;
  onFile: (file?: File) => void;
  onRemove: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const preview = useMemo(() => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => onFile(event.target.files?.[0]);
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onFile(event.dataTransfer.files?.[0]);
  };

  if (file) {
    return (
      <div className="relative flex min-h-24 items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-opacity">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)]">
          {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <FileText className="text-[var(--accent-cobalt)]" size={30} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
          <p className="text-xs text-text-secondary">{file.type === "application/pdf" ? "PDF receipt" : "Image receipt"} • {fileSize(file.size)}</p>
        </div>
        <button
          type="button"
          aria-label="Remove receipt"
          onClick={onRemove}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-input)] text-text-secondary transition hover:text-text-primary"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "receipt-dropzone flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl p-5 text-center transition",
        isDragging && "receipt-dropzone-active"
      )}
    >
      <input className="sr-only" type="file" accept="image/*,application/pdf" onChange={handleInput} />
      {currentReceiptUrl ? <FileImage className="mb-3 text-[var(--accent-cobalt)]" size={32} /> : <CloudUpload className="mb-3 text-[var(--accent-cobalt)]" size={32} />}
      <span className="text-sm font-medium text-text-secondary">{currentReceiptUrl ? "Replace current receipt" : "Drop receipt here or click to browse"}</span>
      <span className="mt-1 text-xs text-text-muted">PNG, JPG, or PDF - up to 5MB</span>
    </label>
  );
}

export function PaymentModalForm({
  form,
  members = [],
  file,
  currentReceiptUrl,
  uploadError,
  isSubmitting,
  submitLabel,
  onFile,
  onRemoveFile,
  onCancel,
  onSubmit
}: {
  form: UseFormReturn<PaymentInput>;
  members?: Member[];
  file: File | null;
  currentReceiptUrl?: string | null;
  uploadError?: string | null;
  isSubmitting: boolean;
  submitLabel: string;
  onFile: (file?: File) => void;
  onRemoveFile: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const notes = form.watch("notes") ?? "";

  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="space-y-5">
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
        <h3 className="mb-4 font-display text-sm font-semibold text-text-primary">Payment Details</h3>
        <div className="space-y-4">
          <TextField formApi={form} name="member_name" label="Member Name" list="member-names" autoComplete="off" />
          <datalist id="member-names">{members.map((member) => <option key={member.id} value={member.name} />)}</datalist>
          <div className="grid gap-4 min-[480px]:grid-cols-2">
            <AmountField form={form} />
            <StatusControl form={form} />
          </div>
          <div className="grid gap-4 min-[480px]:grid-cols-2">
            <TextField formApi={form} name="payment_date" label="Payment Date" type="date" />
            <TextField formApi={form} name="due_date" label="Due Date" optional type="date" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border-ghost)] bg-[var(--bg-surface)] p-5 shadow-[inset_0_1px_12px_rgba(0,0,0,0.24)]">
        <h3 className="mb-4 font-display text-sm font-semibold text-text-primary">Additional Info</h3>
        <div className="space-y-4">
          <MethodControl form={form} />
          <TextField formApi={form} name="transaction_ref" label="Transaction Reference" optional placeholder="e.g. TRX-2026-0042" className="font-mono" />
          <label className="block">
            <Label optional>Notes</Label>
            <textarea
              rows={3}
              maxLength={500}
              className={cn(inputClass(Boolean(shouldShowError(form, "notes") && form.formState.errors.notes)), "min-h-[92px] resize-none py-3")}
              {...form.register("notes")}
            />
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <FieldError message={shouldShowError(form, "notes") ? form.formState.errors.notes?.message : undefined} />
              <span className="ml-auto text-xs text-text-muted">{String(notes).length}/500</span>
            </div>
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <Label optional>Receipt</Label>
        <ReceiptUpload file={file} currentReceiptUrl={currentReceiptUrl} onFile={onFile} onRemove={onRemoveFile} />
      </section>

      {uploadError && (
        <p className="flex items-center gap-2 rounded-lg border border-[var(--status-overdue-border)] bg-[var(--status-overdue-bg)] p-3 text-sm text-[var(--status-overdue)]">
          <AlertCircle size={15} />
          <span>{uploadError}</span>
        </p>
      )}

      <footer className="-mx-5 flex justify-end gap-3 border-t border-[var(--border-subtle)] px-5 pt-5">
        <button type="button" onClick={onCancel} className="min-h-11 rounded-lg px-4 text-sm font-medium text-text-secondary transition hover:bg-[var(--bg-elevated)] hover:text-text-primary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--accent-cobalt)] px-5 text-sm font-semibold text-white shadow-[0_0_0_rgba(91,110,245,0)] transition hover:bg-[var(--accent-cobalt-dim)] hover:shadow-[0_0_22px_var(--accent-cobalt-glow)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </footer>
    </form>
  );
}
