"use client";

import { useEffect } from "react";
import { isInteractiveElement } from "@/lib/utils";

export function useKeyboard(handlers: Partial<Record<"n" | "/" | "?" | "Escape", () => void>>) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveElement(event.target) && event.key !== "Escape") return;
      const key = event.key === "N" ? "n" : event.key;
      const handler = handlers[key as keyof typeof handlers];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
