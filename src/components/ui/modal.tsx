"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  maxWidthClassName?: string;
};

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  maxWidthClassName = "max-w-2xl",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-[calc(100vw-2rem)] ${maxWidthClassName} max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-28px_rgba(79,70,229,0.45)]`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            {title ? <h2 className="text-xl font-extrabold text-slate-950 md:text-2xl">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5 md:p-6">{children}</div>

        {footer ? <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>
  );
}
