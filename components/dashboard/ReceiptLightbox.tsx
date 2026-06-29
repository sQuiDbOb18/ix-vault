"use client";

import { useEffect, useMemo, useRef } from "react";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import type { Payment } from "@/types";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export function ReceiptLightbox({ payment, payments, onClose, onNavigate }: { payment: Payment | null; payments: Payment[]; onClose: () => void; onNavigate: (payment: Payment) => void }) {
  const startX = useRef<number | null>(null);
  const receipts = useMemo(() => payments.filter((item) => item.receipt_url), [payments]);
  const currentIndex = payment ? receipts.findIndex((item) => item.id === payment.id) : -1;

  useEffect(() => {
    if (!payment) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && receipts[currentIndex + 1]) onNavigate(receipts[currentIndex + 1]);
      if (event.key === "ArrowLeft" && receipts[currentIndex - 1]) onNavigate(receipts[currentIndex - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, onClose, onNavigate, payment, receipts]);

  if (!payment?.receipt_url) return null;
  const isPdf = payment.receipt_url.toLowerCase().includes(".pdf") || payment.receipt_path?.toLowerCase().endsWith(".pdf");

  const navigateBySwipe = (x: number) => {
    if (startX.current === null) return;
    const delta = x - startX.current;
    if (delta < -50 && receipts[currentIndex + 1]) onNavigate(receipts[currentIndex + 1]);
    if (delta > 50 && receipts[currentIndex - 1]) onNavigate(receipts[currentIndex - 1]);
    startX.current = null;
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[rgba(6,8,16,0.92)] backdrop-blur-2xl" onMouseDown={onClose}>
      <div className="flex h-full flex-col p-4" onMouseDown={(event) => event.stopPropagation()} onTouchStart={(event) => { startX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => navigateBySwipe(event.changedTouches[0]?.clientX ?? 0)}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg">{payment.member_name}</h2>
            <p className="text-sm text-text-secondary">{formatDate(payment.payment_date)}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.open(payment.receipt_url ?? "", "_blank")}><Download size={16} /> Download</Button>
            <Button variant="icon" aria-label="Close receipt" onClick={onClose}><X size={18} /></Button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          {isPdf ? (
            <div className="lightbox-in premium-card flex max-w-sm flex-col items-center p-8 text-center">
              <FileText size={54} className="mb-4 text-text-accent" />
              <h3 className="mb-2 text-xl">PDF Receipt</h3>
              <Button onClick={() => window.open(payment.receipt_url ?? "", "_blank")}><ExternalLink size={16} /> Open PDF</Button>
            </div>
          ) : (
            <img className="lightbox-in max-h-[82vh] max-w-[88vw] border border-[rgba(255,255,255,0.08)] object-contain shadow-[0_32px_80px_rgba(0,0,0,0.8)]" src={payment.receipt_url} alt={`Receipt for ${payment.member_name}`} />
          )}
        </div>
      </div>
    </div>
  );
}
