"use client";

import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

type ToastState = {
  message: string;
  type: ToastType;
  duration: number;
};

const TOAST_DURATION_BY_TYPE: Record<ToastType, number> = {
  success: 3000,
  info: 3000,
  warning: 3200,
  error: 3200,
};

export function compactMessage(message?: string, maxLength = 120) {
  if (!message) return "";
  const normalized = message.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
}

export function useToast(timeout = 3000) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success", duration?: number) => {
    setToast({
      message: compactMessage(message),
      type,
      duration: duration ?? TOAST_DURATION_BY_TYPE[type] ?? timeout,
    });
  }, [timeout]);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, toast.duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  return {
    toast,
    showToast,
    clearToast,
  };
}
