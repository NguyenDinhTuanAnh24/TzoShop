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
      if (notif.severity === "DANGER") return <AlertCircle className="h-4 w-4 text-black" />;
      return <AlertTriangle className="h-4 w-4 text-black" />;
    }

    switch (notif.type) {
      case "PAYMENT_SUCCESS":
        return <CheckCircle2 className="h-4 w-4 text-black" />;
      case "ORDER_CREATED":
        return <ShoppingCart className="h-4 w-4 text-black" />;
      case "ORDER_CANCELLED":
        return <XCircle className="h-4 w-4 text-black" />;
      case "API_KEY_CREATED":
        return <KeyRound className="h-4 w-4 text-black" />;
      case "SUPPORT_UPDATED":
      case "SUPPORT_CREATED":
        return <LifeBuoy className="h-4 w-4 text-black" />;
      case "SYSTEM":
        return <Info className="h-4 w-4 text-black" />;
      case "ORDER_PAID":
        return <CreditCard className="h-4 w-4 text-black" />;
      case "USER_REGISTERED":
        return <UserPlus className="h-4 w-4 text-black" />;
      case "OUT_OF_CREDITS":
      case "HIGH_FAILED_REQUESTS":
        return <AlertCircle className="h-4 w-4 text-black" />;
      case "LOW_CREDITS":
      case "EXPIRING_BUCKET":
      case "EXPIRING_PLAN":
      case "STALE_PENDING_ORDER":
      case "MODEL_FAILED_SPIKE":
        return <AlertTriangle className="h-4 w-4 text-black" />;
      default:
        return <Bell className="h-4 w-4 text-black" />;
    }
  };

  const getIconBg = (notif: Notification) => {
    if (notif.severity === "DANGER" || notif.type === "OUT_OF_CREDITS") return "bg-[#FF6B6B]";
    if (
      notif.severity === "WARNING" ||
      notif.type === "LOW_CREDITS" ||
      notif.type === "EXPIRING_PLAN" ||
      notif.type === "EXPIRING_BUCKET"
    )
      return "bg-[#FFD93D]";
    if (notif.type === "API_KEY_CREATED") return "bg-[#A78BFA]";
    if (notif.type.includes("SUPPORT") || notif.type === "SYSTEM") return "bg-[#C7F0D8]";
    return "bg-[#FFFDF5]";
  };

  const getUnreadDot = (notif: Notification) => {
    if (notif.type === "OUT_OF_CREDITS" || notif.severity === "DANGER") return "bg-[#FF6B6B]";
    if (notif.type === "LOW_CREDITS" || notif.type === "EXPIRING_PLAN" || notif.severity === "WARNING") return "bg-[#FFD93D]";
    return "bg-[#C7F0D8]";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-12 w-12 items-center justify-center border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:bg-[#FFD93D] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
          isOpen ? "bg-[#FFD93D]" : ""
        }`}
        aria-label="Mở thông báo"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 && !isOpen ? "animate-[bell-swing_2s_infinite_ease-in-out]" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 min-w-[24px] items-center justify-center border-2 border-black bg-[#FF6B6B] px-1 text-[10px] font-black text-black animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[1000] mt-3 w-[calc(100vw-2rem)] max-w-[380px] origin-top-right animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 sm:w-[360px]">
          <div className="overflow-hidden border-4 border-black bg-[#FFFDF5] shadow-[8px_8px_0px_0px_#000]">
            <div className="border-b-4 border-black bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center border-2 border-black bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]">
                  <Bell className="h-4 w-4 text-black" />
                </span>
                <h3 className="text-lg font-black uppercase text-black">Thông báo</h3>
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-black/70">
                {unreadCount > 0 ? `BẠN CÓ ${unreadCount} THÔNG BÁO MỚI` : "BẠN ĐÃ ĐỌC HẾT THÔNG BÁO"}
              </p>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[5px_5px_0px_0px_#000] animate-dashboard-float">
                    <Bell className="h-8 w-8 text-black" />
                  </div>
                  <p className="text-lg font-black uppercase text-black">Chưa có thông báo mới</p>
                  <p className="mx-auto mt-2 max-w-[270px] text-sm font-bold leading-6 text-black/70">
                    Các cập nhật về đơn hàng, API key và hỗ trợ sẽ hiển thị tại đây.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleClickNotification(notif)}
                    className={`w-full border-4 border-black p-3 text-left shadow-[4px_4px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:bg-[#FFF7CC] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                      notif.isRead ? "bg-white" : "bg-[#FFF2B0]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black ${getIconBg(notif)}`}>
                        {getIcon(notif)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-black uppercase text-black">{notif.title}</p>
                          {!notif.isRead && <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 border border-black ${getUnreadDot(notif)}`} />}
                        </div>

                        <p className="line-clamp-2 text-xs font-bold leading-5 text-black/75">{notif.message}</p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wide text-black/60">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                          </span>
                          {notif.href && <ChevronRight className="h-3 w-3 text-black/70" />}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="border-t-4 border-black bg-white p-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  hasMarkedRef.current = false;
                }}
                className="inline-flex h-12 w-full items-center justify-center border-4 border-black bg-[#FF6B6B] text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
      `}</style>
    </div>
  );
}
