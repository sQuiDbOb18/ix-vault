"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { AddPaymentModal } from "@/components/dashboard/AddPaymentModal";
import { MemberGrid } from "@/components/members/MemberGrid";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/providers/ToastProvider";
import { useMembers } from "@/hooks/useMembers";
import { usePayments } from "@/hooks/usePayments";
import { memberSchema, type MemberInput } from "@/lib/validations";
import type { Member } from "@/types";

export default function MembersPage() {
  const [open, setOpen] = useState(false);
  const [paymentMember, setPaymentMember] = useState<Member | null>(null);
  const { members, createMember, isLoading } = useMembers();
  const { payments } = usePayments({ limit: 100 });
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MemberInput>({ resolver: zodResolver(memberSchema), defaultValues: { name: "", tag: "", role: "Member" } });
  const submit = handleSubmit(async (values) => {
    try {
      await createMember(values);
      toast({ type: "success", message: "Member added" });
      reset();
      setOpen(false);
    } catch (error) {
      toast({ type: "error", message: error instanceof Error ? error.message : "Unable to add member" });
    }
  });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-2xl">
            <span>Members</span>
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 font-display text-sm font-medium text-text-secondary">
              {members.length}
            </span>
          </h1>
          <p className="text-sm text-text-secondary">Clan payment summaries and member histories.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Add Member</Button>
      </div>
      {isLoading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton h-52 rounded-card" />)}</div> : <MemberGrid members={members} payments={payments} onAddPayment={setPaymentMember} />}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Member">
        <div className="space-y-4">
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="Tag" error={errors.tag?.message} {...register("tag")} />
          <Select label="Role" error={errors.role?.message} {...register("role")}>{["Member", "Officer", "Commander"].map((role) => <option key={role}>{role}</option>)}</Select>
          <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Add Member"}</Button></div>
        </div>
      </Modal>
      <AddPaymentModal open={Boolean(paymentMember)} onClose={() => setPaymentMember(null)} prefilledMemberName={paymentMember?.name} />
    </div>
  );
}
