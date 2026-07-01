"use client";

import { format, isSameMonth, parseISO } from "date-fns";
import type { DashboardStats, Member, Payment } from "@/types";

export function useStats(payments: Payment[], members: Member[]): DashboardStats {
  const totalCollected = payments.filter((payment) => payment.status === "Paid").reduce((sum, payment) => sum + payment.amount, 0);
  const totalOutstanding = payments.filter((payment) => payment.status === "Pending").reduce((sum, payment) => sum + payment.amount, 0);
  const totalOverdue = payments.filter((payment) => payment.status === "Overdue").reduce((sum, payment) => sum + payment.amount, 0);
  const tracked = totalCollected + totalOutstanding + totalOverdue;
  const thisMonthCollected = payments.filter((payment) => payment.status === "Paid" && isSameMonth(parseISO(payment.payment_date), new Date())).reduce((sum, payment) => sum + payment.amount, 0);

  const collectionTrend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const dayKey = format(date, "yyyy-MM-dd");
    return payments.filter((payment) => payment.status === "Paid" && payment.payment_date === dayKey).reduce((sum, payment) => sum + payment.amount, 0);
  });

  return {
    totalCollected,
    totalOutstanding,
    totalOverdue,
    memberCount: members.length,
    activeMembers: members.filter((member) => member.is_active).length,
    paymentCount: payments.length,
    collectionRate: tracked === 0 ? 0 : Math.round((totalCollected / tracked) * 100),
    thisMonthCollected,
    collectionTrend
  };
}
