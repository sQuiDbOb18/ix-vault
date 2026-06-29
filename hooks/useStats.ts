"use client";

import { isSameMonth, parseISO } from "date-fns";
import type { DashboardStats, Member, Payment } from "@/types";

export function useStats(payments: Payment[], members: Member[]): DashboardStats {
  const totalCollected = payments.filter((payment) => payment.status === "Paid").reduce((sum, payment) => sum + payment.amount, 0);
  const totalOutstanding = payments.filter((payment) => payment.status === "Pending").reduce((sum, payment) => sum + payment.amount, 0);
  const totalOverdue = payments.filter((payment) => payment.status === "Overdue").reduce((sum, payment) => sum + payment.amount, 0);
  const tracked = totalCollected + totalOutstanding + totalOverdue;
  const thisMonthCollected = payments.filter((payment) => payment.status === "Paid" && isSameMonth(parseISO(payment.payment_date), new Date())).reduce((sum, payment) => sum + payment.amount, 0);
  return {
    totalCollected,
    totalOutstanding,
    totalOverdue,
    memberCount: members.length,
    activeMembers: members.filter((member) => member.is_active).length,
    paymentCount: payments.length,
    collectionRate: tracked === 0 ? 0 : Math.round((totalCollected / tracked) * 100),
    thisMonthCollected
  };
}
