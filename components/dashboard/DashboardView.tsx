"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Payment, PaymentFilters } from "@/types";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DeleteConfirmModal } from "@/components/dashboard/DeleteConfirmModal";
import { EditPaymentModal } from "@/components/dashboard/EditPaymentModal";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { PaymentTable } from "@/components/dashboard/PaymentTable";
import { ReceiptLightbox } from "@/components/dashboard/ReceiptLightbox";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { useDashboardActions } from "@/components/layout/DashboardShell";
import { useToast } from "@/components/providers/ToastProvider";
import { useMembers } from "@/hooks/useMembers";
import { usePayments } from "@/hooks/usePayments";
import { useStats } from "@/hooks/useStats";
import { toSearchString } from "@/lib/utils";

function readFilters(searchParams: URLSearchParams): PaymentFilters {
  return {
    search: searchParams.get("search") ?? "",
    status: (searchParams.get("status") as PaymentFilters["status"]) ?? "All",
    method: (searchParams.get("method") as PaymentFilters["method"]) ?? "All",
    dateFrom: searchParams.get("dateFrom") ?? "",
    dateTo: searchParams.get("dateTo") ?? "",
    sortBy: (searchParams.get("sortBy") as PaymentFilters["sortBy"]) ?? "payment_date",
    sortDir: (searchParams.get("sortDir") as PaymentFilters["sortDir"]) ?? "desc",
    limit: 50
  };
}

export function DashboardView() {
  const router = useRouter();
  const params = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const { openAddPayment } = useDashboardActions();
  const { members } = useMembers();
  const { payments, isLoading, deletePayment } = usePayments(filters);
  const stats = useStats(payments, members);
  const { toast } = useToast();
  const [editing, setEditing] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState<Payment | null>(null);
  const [receipt, setReceipt] = useState<Payment | null>(null);

  const patchFilters = useCallback((patch: PaymentFilters) => {
    router.push(`/dashboard?${toSearchString({ ...filters, ...patch, page: 1 } as Record<string, string | number | undefined>)}`);
  }, [filters, router]);

  const sort = (sortBy: NonNullable<PaymentFilters["sortBy"]>) => {
    patchFilters({ sortBy, sortDir: filters.sortBy === sortBy && filters.sortDir === "asc" ? "desc" : "asc" });
  };

  const confirmDelete = async (payment: Payment) => {
    try {
      await deletePayment(payment);
      toast({ type: "success", message: "Payment deleted" });
      setDeleting(null);
    } catch (error) {
      toast({ type: "error", message: error instanceof Error ? error.message : "Unable to delete payment" });
    }
  };

  return (
    <div className="space-y-6">
      <StatsRow stats={stats} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4">
          <div className="premium-card space-y-4 p-4">
            <SearchBar value={filters.search ?? ""} onChange={(search) => patchFilters({ search })} />
            <FilterBar filters={filters} onChange={patchFilters} onClear={() => router.push("/dashboard")} />
          </div>
          <PaymentTable payments={payments} isLoading={isLoading} filters={filters} onSort={sort} onAdd={openAddPayment} onEdit={setEditing} onReceipt={setReceipt} onDelete={setDeleting} />
        </section>
        <ActivityFeed />
      </div>
      <EditPaymentModal payment={editing} open={Boolean(editing)} onClose={() => setEditing(null)} />
      <DeleteConfirmModal payment={deleting} open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={confirmDelete} />
      <ReceiptLightbox payment={receipt} payments={payments} onClose={() => setReceipt(null)} onNavigate={setReceipt} />
    </div>
  );
}
