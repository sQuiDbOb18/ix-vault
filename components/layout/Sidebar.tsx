"use client";

import { signOut, useSession } from "next-auth/react";
import { BarChart3, History, LogOut, Users } from "lucide-react";
import { NavItem } from "@/components/layout/NavItem";
import { Button } from "@/components/ui/Button";

export function SidebarContent() {
  const { data } = useSession();
  return (
    <>
      <div className="mb-10">
        <div className="wordmark text-2xl"><span className="text-[var(--accent-cobalt)]">IX</span> VAULT</div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-text-muted">9₮H_LEGION</div>
      </div>
      <nav className="space-y-2">
        <NavItem href="/dashboard" icon={BarChart3} label="Dashboard" />
        <NavItem href="/dashboard/members" icon={Users} label="Members" />
        <NavItem href="/dashboard/history" icon={History} label="History" />
      </nav>
      <div className="mt-auto rounded-md border border-[var(--border-ghost)] bg-[var(--bg-surface)] p-3">
        <p className="text-xs text-text-muted">Logged in as</p>
        <p className="mb-3 truncate text-sm text-text-primary">{data?.user?.name ?? "Commander"}</p>
        <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[var(--border-ghost)] bg-[var(--bg-void)] p-5 lg:flex">
      <SidebarContent />
    </aside>
  );
}
