"use client";

import { useState } from "react";
import type { Payment } from "@/types";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DeleteConfirmModal({ payment, open, onClose, onConfirm }: { payment: Payment | null; open: boolean; onClose: () => void; onConfirm: (payment: Payment) => void }) {
  const [value, setValue] = useState("");
  const matches = payment ? value.trim().toLowerCase() === payment.member_name.toLowerCase() : false;
  return (
    <ConfirmDialog
      open={open && Boolean(payment)}
      title={payment ? `Delete payment for ${payment.member_name}?` : "Delete payment?"}
      message="This action cannot be undone. The payment record and receipt will be permanently deleted."
      confirmLabel="Delete Payment"
      onClose={() => { setValue(""); onClose(); }}
      onConfirm={() => { if (payment) { onConfirm(payment); setValue(""); } }}
      disabled={!matches}
    >
      <Input label="Type member name to confirm" value={value} onChange={(event) => setValue(event.target.value)} />
    </ConfirmDialog>
  );
}
