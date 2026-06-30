"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { AddPaymentModal } from "@/components/dashboard/AddPaymentModal";
import { useKeyboard } from "@/hooks/useKeyboard";

const DashboardContext = createContext<{ openAddPayment: () => void } | null>(null);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const value = useMemo(() => ({ openAddPayment: () => setAddOpen(true) }), []);
  useKeyboard({ n: () => setAddOpen(true), Escape: () => { setAddOpen(false); setNavOpen(false); } });

  return (
    <DashboardContext.Provider value={value}>
      <Sidebar />
      <MobileSidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="dashboard-bg min-h-screen lg:pl-64">
        <Header onMenu={() => setNavOpen(true)} onAdd={() => setAddOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <AddPaymentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </DashboardContext.Provider>
  );
}

export function useDashboardActions() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboardActions must be used in DashboardShell");
  return context;
}
