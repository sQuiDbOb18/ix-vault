"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavItem({ href, icon: Icon, label, active: activeProp }: { href: string; icon: LucideIcon; label: string; active?: boolean }) {
  const pathname = usePathname();
  const active = activeProp ?? pathname === href;
  return (
    <Link href={href} className={cn("relative flex items-center gap-3 rounded-md px-4 py-3 text-sm transition", active ? "bg-[var(--accent-cobalt-soft)] text-text-primary" : "text-text-secondary hover:bg-[var(--bg-elevated)] hover:text-text-primary")}>
      <Icon size={18} />
      {label}
    </Link>
  );
}
