"use client";

import type { ToastType } from "@/hooks/use-toast";
import { compactMessage } from "@/hooks/use-toast";

export const toastDurationByType: Record<ToastType, number> = {
  success: 3000,
  info: 3000,
  warning: 3500,
  error: 4500,
};

export const appToastMessage = {
  success: (title: string) => ({ message: compactMessage(title), type: "success" as const, duration: toastDurationByType.success }),
  error: (title: string) => ({ message: compactMessage(title), type: "error" as const, duration: toastDurationByType.error }),
  warning: (title: string) => ({ message: compactMessage(title), type: "warning" as const, duration: toastDurationByType.warning }),
  info: (title: string) => ({ message: compactMessage(title), type: "info" as const, duration: toastDurationByType.info }),
};

export const appToast = {
  success: (title: string) => appToastMessage.success(title),
  error: (title: string) => appToastMessage.error(title),
  warning: (title: string) => appToastMessage.warning(title),
  info: (title: string) => appToastMessage.info(title),
};
