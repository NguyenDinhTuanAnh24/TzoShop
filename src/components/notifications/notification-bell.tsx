"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Bell,
  ShoppingCart,
  CreditCard,
  LifeBuoy,
  UserPlus,
  Info,
  ChevronRight,
  CheckCircle2,
  XCircle,
  KeyRound,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  href?: string | null;
  isRead: boolean;
  createdAt: string;
  severity?: "WARNING" | "DANGER";
  isAlert?: boolean;
};

export function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasMarkedRef = useRef(false);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const result = await res.json();
      let allNotifications: Notification[] = (result.notifications || []).map((n: Notification) => ({
        ...n,
        isAlert: false,
      }));
      const dbUnread: number = result.unreadCount || 0;

      const user = session?.user as { role?: string } | undefined;
      if (user?.role === "ADMIN") {
        try {
          const alertRes = await fetch("/api/admin/alerts");
          const alertData = await alertRes.json();
          if (alertData.success && alertData.alerts?.length > 0) {
            const mappedAlerts: Notification[] = alertData.alerts.slice(0, 10).map((a: Notification) => ({
              ...a,
              isRead: false,
              isAlert: true,
            }));
            allNotifications = [...mappedAlerts, ...allNotifications];
          }
        } catch (e) {
          console.error("Failed to fetch admin alerts:", e);
        }
      }

      allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(allNotifications);
      setUnreadCount(dbUnread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [session]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);
    const interval = setInterval(() => {
      void fetchNotifications();
    }, 30000);
    return () => {
      window.clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        hasMarkedRef.current = false;
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = useCallback(async () => {
    if (isMarkingRead || hasMarkedRef.current) return;
    if (unreadCount <= 0) return;

    setIsMarkingRead(true);
    hasMarkedRef.current = true;

    try {
      const res = await fetch("/api/notifications/mark-read", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => (n.isAlert ? n : { ...n, isRead: true })));
        setUnreadCount(0);
      } else {
        hasMarkedRef.current = false;
      }
    } catch (error) {
      console.error("Failed to mark all read:", error);
      hasMarkedRef.current = false;
    } finally {
      setIsMarkingRead(false);
    }
  }, [isMarkingRead, unreadCount]);

  const handleToggle = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen) {
      fetchNotifications();
      if (unreadCount > 0) {
        setTimeout(() => markAllRead(), 300);
      }
    } else {
      hasMarkedRef.current = false;
    }
  };

  const handleClickNotification = (notif: Notification) => {
    if (notif.href) {
      setIsOpen(false);
      hasMarkedRef.current = false;
      router.push(notif.href);
    }
  };

  const getIcon = (notif: Notification) => {
    if (notif.severity) {
      if (notif.severity === "DANGER") return <AlertCircle className="h-4 w-4" />;
      return <AlertTriangle className="h-4 w-4" />;
    }

    switch (notif.type) {
      case "PAYMENT_SUCCESS":
        return <CheckCircle2 className="h-4 w-4" />;
      case "ORDER_CREATED":
        return <ShoppingCart className="h-4 w-4" />;
      case "ORDER_CANCELLED":
        return <XCircle className="h-4 w-4" />;
      case "API_KEY_CREATED":
        return <KeyRound className="h-4 w-4" />;
      case "SUPPORT_UPDATED":
      case "SUPPORT_CREATED":
        return <LifeBuoy className="h-4 w-4" />;
      case "SYSTEM":
        return <Info className="h-4 w-4" />;
      case "ORDER_PAID":
        return <CreditCard className="h-4 w-4" />;
      case "USER_REGISTERED":
        return <UserPlus className="h-4 w-4" />;
      case "OUT_OF_CREDITS":
      case "HIGH_FAILED_REQUESTS":
        return <AlertCircle className="h-4 w-4" />;
      case "LOW_CREDITS":
      case "EXPIRING_BUCKET":
      case "EXPIRING_PLAN":
      case "STALE_PENDING_ORDER":
      case "MODEL_FAILED_SPIKE":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getIconBg = (notif: Notification) => {
    if (notif.severity === "DANGER" || notif.type === "OUT_OF_CREDITS") return "bg-rose-50 text-rose-600";
    if (
      notif.severity === "WARNING" ||
      notif.type === "LOW_CREDITS" ||
      notif.type === "EXPIRING_PLAN" ||
      notif.type === "EXPIRING_BUCKET"
    )
      return "bg-amber-50 text-amber-600";
    if (notif.type === "API_KEY_CREATED") return "bg-violet-50 text-violet-600";
    if (notif.type === "PAYMENT_SUCCESS" || notif.type === "ORDER_PAID") return "bg-emerald-50 text-emerald-600";
    if (notif.type === "ORDER_CREATED" || notif.type === "ORDER_CANCELLED") return "bg-amber-50 text-amber-600";
    if (notif.type.includes("SUPPORT") || notif.type === "SYSTEM") return "bg-indigo-50 text-indigo-600";
    return "bg-slate-100 text-slate-600";
  };

  const getUnreadDot = (notif: Notification) => {
    if (notif.type === "OUT_OF_CREDITS" || notif.severity === "DANGER") return "bg-rose-400";
    if (notif.type === "LOW_CREDITS" || notif.type === "EXPIRING_PLAN" || notif.severity === "WARNING") return "bg-amber-400";
    return "bg-indigo-400";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 ${
          isOpen ? "border-indigo-200 bg-indigo-50 text-indigo-700" : ""
        }`}
        aria-label="Mở thông báo"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 && !isOpen ? "animate-[bell-swing_2s_infinite_ease-in-out]" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-white bg-rose-500 px-1 text-[10px] font-bold text-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[1000] mt-3 w-[calc(100vw-2rem)] max-w-[420px] origin-top-right animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 sm:w-[420px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.35)]">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Bell className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-extrabold text-slate-950">Thông báo</h3>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo mới` : "Bạn đã đọc hết thông báo"}
              </p>
            </div>

            <div className="tz-notification-scroll mt-4 max-h-[340px] space-y-3 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-base font-bold text-slate-900">Chưa có thông báo mới</p>
                  <p className="mx-auto mt-2 max-w-[270px] text-sm leading-6 text-slate-600">
                    Các cập nhật về đơn hàng, credits và API key sẽ hiển thị tại đây.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleClickNotification(notif)}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                      notif.isRead
                        ? "border-slate-200 bg-slate-50/70 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-[0_14px_35px_-20px_rgba(79,70,229,0.35)]"
                        : "border-indigo-200 bg-indigo-50/40 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-[0_14px_35px_-20px_rgba(79,70,229,0.35)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getIconBg(notif)}`}>
                        {getIcon(notif)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-bold text-slate-950">{notif.title}</p>
                          {!notif.isRead && <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getUnreadDot(notif)}`} />}
                        </div>

                        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{notif.message}</p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                          </span>
                          {notif.href && <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  hasMarkedRef.current = false;
                }}
                className="mt-0 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700 active:scale-[0.98]"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bell-swing {
          0% {
            transform: rotate(0);
          }
          5% {
            transform: rotate(10deg);
          }
          10% {
            transform: rotate(-10deg);
          }
          15% {
            transform: rotate(8deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          25% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(0);
          }
        }
        .tz-notification-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .tz-notification-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .tz-notification-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .tz-notification-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
