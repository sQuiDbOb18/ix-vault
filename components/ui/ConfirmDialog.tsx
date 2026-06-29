"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", onClose, onConfirm, disabled, children }: { open: boolean; title: string; message: string; confirmLabel?: string; onClose: () => void; onConfirm: () => void; disabled?: boolean; children?: React.ReactNode }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-5 text-sm text-text-secondary">{message}</p>
      {children && <div className="mb-5">{children}</div>}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={disabled}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
