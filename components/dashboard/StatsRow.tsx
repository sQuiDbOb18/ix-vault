import { CircleDollarSign, Clock, ShieldAlert, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types";
import { StatCard } from "@/components/dashboard/StatCard";

export function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Collected" value={stats.totalCollected} icon={CircleDollarSign} color="var(--accent-cobalt)" />
      <StatCard label="Outstanding" value={stats.totalOutstanding} icon={Clock} color="var(--status-pending)" />
      <StatCard label="Overdue" value={stats.totalOverdue} icon={ShieldAlert} color="var(--status-overdue)" />
      <StatCard label="Collection Rate" value={stats.collectionRate} icon={TrendingUp} color="var(--status-paid)" format="percent" />
    </section>
  );
}
