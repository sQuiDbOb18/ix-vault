"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Payment, PaymentFilters } from "@/types";
import { DeleteConfirmModal } from "@/components/dashboard/DeleteConfirmModal";
import { EditPaymentModal } from "@/components/dashboard/EditPaymentModal";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { PaymentTable } from "@/components/dashboard/PaymentTable";
import { ReceiptLightbox } from "@/components/dashboard/ReceiptLightbox";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/Button";
import { useDashboardActions } from "@/components/layout/DashboardShell";
import { useMembers } from "@/hooks/useMembers";
import { usePayments } from "@/hooks/usePayments";
import { formatNaira, toSearchString } from "@/lib/utils";

function filtersFrom(params: URLSearchParams): PaymentFilters {
  return {
    search: params.get("search") ?? "",
    status: (params.get("status") as PaymentFilters["status"]) ?? "All",
    method: (params.get("method") as PaymentFilters["method"]) ?? "All",
    dateFrom: params.get("dateFrom") ?? "",
    dateTo: params.get("dateTo") ?? "",
    sortBy: (params.get("sortBy") as PaymentFilters["sortBy"]) ?? "payment_date",
    sortDir: (params.get("sortDir") as PaymentFilters["sortDir"]) ?? "desc",
    page: Number(params.get("page") ?? 1),
    limit: 20
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const params = useSearchParams();
  const filters = useMemo(() => filtersFrom(params), [params]);
  const { payments, isLoading, page, totalPages, deletePayment } = usePayments(filters);
  const { members } = useMembers();
  const { openAddPayment } = useDashboardActions();
  const [editing, setEditing] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState<Payment | null>(null);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const patch = useCallback((patchFilters: PaymentFilters) => {
    const search = toSearchString({ ...filters, ...patchFilters } as Record<string, string | number | undefined>);
    router.push(search ? `/dashboard/history?${search}` : "/dashboard/history");
  }, [filters, router]);
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const exportCsv = () => {
    const rows = [["Member", "Amount", "Date", "Method", "Status", "Tx Ref"], ...payments.map((payment) => [payment.member_name, String(payment.amount), payment.payment_date, payment.payment_method, payment.status, payment.transaction_ref ?? ""])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ix-vault-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl">Payment History</h1><p className="text-sm text-text-secondary">Full ledger with pagination and CSV export.</p></div>
        <Button variant="ghost" onClick={exportCsv}><Download size={16} /> Export CSV</Button>
      </div>
      <div className="premium-card space-y-4 p-4"><SearchBar value={filters.search ?? ""} onChange={(search) => patch({ search, page: 1 })} /><FilterBar filters={filters} onChange={(value) => patch({ ...value, page: 1 })} onClear={() => router.push("/dashboard/history")} /></div>
      <PaymentTable payments={payments} members={members} isLoading={isLoading} filters={filters} revealOnScroll onSort={(sortBy) => patch({ sortBy, sortDir: filters.sortBy === sortBy && filters.sortDir === "asc" ? "desc" : "asc" })} onAdd={openAddPayment} onEdit={setEditing} onReceipt={setReceipt} onDelete={setDeleting} />
      <div className="premium-card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
        <span className="amount">Page total: {formatNaira(total)}</span>
        <div className="flex items-center gap-2"><Button variant="ghost" disabled={page <= 1} onClick={() => patch({ page: page - 1 })}>Previous</Button><span className="text-text-secondary">Page {page} of {totalPages}</span><Button variant="ghost" disabled={page >= totalPages} onClick={() => patch({ page: page + 1 })}>Next</Button></div>
      </div>
      <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-lg transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${showBackToTop ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
      <EditPaymentModal payment={editing} open={Boolean(editing)} onClose={() => setEditing(null)} />
      <DeleteConfirmModal payment={deleting} open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={async (payment) => { await deletePayment(payment); setDeleting(null); }} />
      <ReceiptLightbox payment={receipt} payments={payments} onClose={() => setReceipt(null)} onNavigate={setReceipt} />
    </div>
  );
}
