"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BarChart3, History, LogOut, Users } from "lucide-react";
import { NavItem } from "@/components/layout/NavItem";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/dashboard/members", icon: Users, label: "Members" },
  { href: "/dashboard/history", icon: History, label: "History" }
];

export function SidebarContent() {
  const { data } = useSession();
  const pathname = usePathname();
  const activeIndex = Math.max(0, navItems.findIndex((item) => item.href === pathname));

  return (
    <>
      <div className="mb-10">
        <div className="wordmark text-2xl"><span className="text-gradient-cobalt">IX</span> VAULT</div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-text-muted">9₮H_LEGION</div>
      </div>
      <nav className="relative space-y-2">
        <span className="nav-active-indicator" style={{ transform: `translateY(${activeIndex * 52}px)` }} />
        {navItems.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href} />)}
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
    <aside className="sidebar-shell fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[var(--border-ghost)] bg-[var(--bg-void)] p-5 lg:flex">
      <SidebarContent />
    </aside>
  );
}
