"use client";

import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";
import type { ActivityLog } from "@/types";
import { formatNaira } from "@/lib/utils";

async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Unable to load activity");
  }
  return (await response.json()) as ActivityLog[];
}

export function ActivityFeed() {
  const { data, error, isLoading } = useSWR<ActivityLog[]>("/api/activity", fetcher);
  return (
    <aside className="premium-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={18} className="text-text-accent" />
        <h2 className="text-lg">Activity</h2>
      </div>
      {isLoading && <div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="skeleton h-12 rounded" />)}</div>}
      {error && <p className="text-sm text-[var(--status-overdue)]">Activity could not be loaded.</p>}
      {!isLoading && !error && (data?.length ?? 0) === 0 && <p className="text-sm text-text-secondary">No activity yet. Payments you add will show up here.</p>}
      <div className="space-y-3">
        {data?.map((item) => (
          <div key={item.id} className="rounded-md border border-[var(--border-ghost)] bg-[var(--bg-elevated)] p-3">
            <p className="text-sm text-text-primary">{item.action.replaceAll("_", " ")} · {item.member_name ?? "Unknown"}</p>
            <p className="amount text-xs text-text-secondary">{item.amount ? formatNaira(item.amount) : "—"} · {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
