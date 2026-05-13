"use client";

import { useEffect, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastMessageProps = {
  message: string;
  type?: ToastType;
  onClose?: () => void;
};

const toastStyles: Record<ToastType, string> = {
  success: "bg-[#C7F0D8] text-black",
  error: "bg-[#FF6B6B] text-black",
  warning: "bg-[#FFD93D] text-black",
  info: "bg-[#C4B5FD] text-black",
};

const iconStyles: Record<ToastType, string> = {
  success: "bg-[#E9FAF0]",
  error: "bg-[#FFD7D7]",
  warning: "bg-[#FFF1A8]",
  info: "bg-[#E0D8FF]",
};

const icons: Record<ToastType, ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function ToastMessage({
  message,
  type = "success",
  onClose,
}: ToastMessageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => {
      window.clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  if (!message || !mounted) return null;
  const Icon = icons[type];

  const toast = (
    <div
      className="fixed right-4 top-20 z-[10000] w-[calc(100%-2rem)] max-w-sm animate-in fade-in slide-in-from-top-2 duration-200 sm:right-6 sm:top-24 sm:w-auto"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex min-h-[58px] items-center gap-3 border-4 border-black px-4 py-3 text-sm font-bold shadow-[4px_4px_0px_0px_#000] ${toastStyles[type]}`}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black ${iconStyles[type]}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <p className="flex-1 leading-5">{message}</p>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-white/70 text-black transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:bg-white active:translate-x-[1px] active:translate-y-[1px]"
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(toast, document.body);
}
