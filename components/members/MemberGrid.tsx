"use client";

import type { Member, Payment } from "@/types";
import { MemberCard } from "@/components/members/MemberCard";

export function MemberGrid({ members, payments }: { members: Member[]; payments: Payment[] }) {
  if (members.length === 0) return <div className="premium-card p-8 text-center text-text-secondary">No members yet. Add one manually or create a payment.</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {members.map((member) => <MemberCard key={member.id} member={member} payments={payments} />)}
    </div>
  );
}
