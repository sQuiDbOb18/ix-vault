"use client";

import useSWR from "swr";
import type { Payment, PaymentFilters, PaymentsResponse } from "@/types";
import { toSearchString } from "@/lib/utils";
import type { PaymentInput, PaymentUpdateInput } from "@/lib/validations";

async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Unable to load payments");
  }
  return (await response.json()) as PaymentsResponse;
}

export function usePayments(filters: PaymentFilters = {}) {
  const key = `/api/payments?${toSearchString(filters as Record<string, string | number | undefined>)}`;
  const swr = useSWR<PaymentsResponse>(key, fetcher, { keepPreviousData: true });

  const createPayment = async (input: PaymentInput) => {
    const optimistic: Payment = {
      id: `optimistic-${crypto.randomUUID()}`,
      member_name: input.member_name,
      amount: input.amount,
      payment_date: input.payment_date,
      due_date: input.due_date,
      status: input.status,
      payment_method: input.payment_method,
      transaction_ref: input.transaction_ref,
      notes: input.notes,
      receipt_url: input.receipt_url,
      receipt_path: input.receipt_path,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await swr.mutate(
      async (current) => {
        const response = await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
        if (!response.ok) throw new Error((await response.json()).error ?? "Unable to add payment");
        const json = (await response.json()) as { data: Payment };
        return current ? { ...current, data: [json.data, ...current.data.filter((item) => item.id !== optimistic.id)], total: current.total + 1 } : { data: [json.data], total: 1, page: 1, totalPages: 1 };
      },
      { optimisticData: (current) => (current ? { ...current, data: [optimistic, ...current.data], total: current.total + 1 } : { data: [optimistic], total: 1, page: 1, totalPages: 1 }), rollbackOnError: true, revalidate: true }
    );
  };

  const updatePayment = async (id: string, input: PaymentUpdateInput) => {
    await swr.mutate(
      async (current) => {
        const response = await fetch(`/api/payments/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
        if (!response.ok) throw new Error((await response.json()).error ?? "Unable to update payment");
        const json = (await response.json()) as { data: Payment };
        return current ? { ...current, data: current.data.map((item) => (item.id === id ? json.data : item)) } : current;
      },
      { optimisticData: (current) => (current ? { ...current, data: current.data.map((item) => (item.id === id ? { ...item, ...input } : item)) } : { data: [], total: 0, page: 1, totalPages: 1 }), rollbackOnError: true, revalidate: true }
    );
  };

  const deletePayment = async (payment: Payment) => {
    await swr.mutate(
      async (current) => {
        const response = await fetch(`/api/payments/${payment.id}`, { method: "DELETE" });
        if (!response.ok) throw new Error((await response.json()).error ?? "Unable to delete payment");
        return current ? { ...current, data: current.data.filter((item) => item.id !== payment.id), total: Math.max(0, current.total - 1) } : current;
      },
      { optimisticData: (current) => (current ? { ...current, data: current.data.filter((item) => item.id !== payment.id), total: Math.max(0, current.total - 1) } : { data: [], total: 0, page: 1, totalPages: 1 }), rollbackOnError: true, revalidate: true }
    );
  };

  return { ...swr, payments: swr.data?.data ?? [], total: swr.data?.total ?? 0, page: swr.data?.page ?? 1, totalPages: swr.data?.totalPages ?? 1, createPayment, updatePayment, deletePayment };
}
