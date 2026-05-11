"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Bell, 
  CheckCheck, 
  ShoppingCart, 
  CreditCard, 
  LifeBuoy, 
  UserPlus, 
  Info, 
  Circle,
  X,
  ChevronRight,
  CheckCircle2,
  XCircle,
  KeyRound
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  href?: string | null;
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const result = await res.json();
      if (result.notifications) {
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read-all" })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  };

  const handleReadNotification = async (id: string, href?: string | null) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (href) {
        setIsOpen(false);
        router.push(href);
      }
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      // User & Shared types
      case "PAYMENT_SUCCESS": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "ORDER_CREATED": return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case "ORDER_CANCELLED": return <XCircle className="h-4 w-4 text-rose-500" />;
      case "API_KEY_CREATED": return <KeyRound className="h-4 w-4 text-indigo-500" />;
      case "SUPPORT_UPDATED": return <LifeBuoy className="h-4 w-4 text-amber-500" />;
      case "SYSTEM": return <Info className="h-4 w-4 text-slate-500" />;
      
      // Admin specific types
      case "ORDER_PAID": return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case "SUPPORT_CREATED": return <LifeBuoy className="h-4 w-4 text-amber-500" />;
      case "USER_REGISTERED": return <UserPlus className="h-4 w-4 text-indigo-500" />;
      
      default: return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={handleToggle}
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all active:scale-95 ${
          isOpen ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm"
        }`}
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 && !isOpen ? 'animate-[bell-swing_2s_infinite_ease-in-out]' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white ring-4 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-[360px] origin-top-right rounded-[32px] border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[1000] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
               <h3 className="text-lg font-black text-slate-900">Thông báo</h3>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Bạn đã đọc hết thông báo"}
               </p>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                 <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-slate-200" />
                 </div>
                 <p className="text-sm font-black text-slate-900 mb-2">Chưa có thông báo mới</p>
                 <p className="text-xs font-bold text-slate-400 italic">
                    Các cập nhật về đơn hàng, API key và hỗ trợ sẽ hiển thị tại đây.
                 </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleReadNotification(notif.id, notif.href)}
                    className={`w-full flex gap-4 p-5 text-left transition-all hover:bg-slate-50/80 ${
                      !notif.isRead ? "bg-emerald-50/30" : "bg-white"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-slate-100 shadow-sm ${
                      !notif.isRead ? "bg-white" : "bg-slate-50"
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm tracking-tight truncate ${notif.isRead ? "font-bold text-slate-700" : "font-black text-slate-900"}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                           <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shadow-sm shadow-emerald-200 shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed mb-2 line-clamp-2 ${notif.isRead ? "text-slate-400 font-medium" : "text-slate-500 font-bold"}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                         </span>
                         {notif.href && (
                            <ChevronRight className="h-3 w-3 text-slate-300" />
                         )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-4 bg-slate-50/50 text-center">
             <button 
                onClick={() => setIsOpen(false)}
                className="py-2 px-6 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest"
             >
                Đóng cửa sổ
             </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes bell-swing {
          0% { transform: rotate(0); }
          5% { transform: rotate(10deg); }
          10% { transform: rotate(-10deg); }
          15% { transform: rotate(8deg); }
          20% { transform: rotate(-8deg); }
          25% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}</style>
    </div>
  );
}
