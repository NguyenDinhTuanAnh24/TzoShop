"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { Skeleton } from "@/components/ui/skeleton";

const routeConfigs: Record<string, { title: string; description: string }> = {
  "/admin": { title: "Tổng quan", description: "Báo cáo hoạt động và thống kê hệ thống." },
  "/admin/revenue": { title: "Doanh thu", description: "Theo dõi doanh thu và hiệu quả bán gói credits." },
  "/admin/users": { title: "Người dùng", description: "Quản lý tài khoản và quyền truy cập." },
  "/admin/orders": { title: "Đơn hàng", description: "Theo dõi và xử lý đơn hàng." },
  "/admin/products": { title: "Gói credits", description: "Quản lý gói credits và model hỗ trợ." },
  "/admin/coupons": { title: "Mã giảm giá", description: "Quản lý ưu đãi và điều kiện áp dụng." },
  "/admin/models": { title: "Models", description: "Quản lý model theo từng dòng AI." },
  "/admin/providers": { title: "Providers", description: "Quản lý nhà cung cấp AI và kết nối." },
  "/admin/usage": { title: "Lịch sử dùng", description: "Giám sát request API và credits tiêu thụ." },
  "/admin/support": { title: "Ticket hỗ trợ", description: "Theo dõi yêu cầu hỗ trợ từ người dùng." },
  "/admin/support-tickets": { title: "Ticket hỗ trợ", description: "Theo dõi yêu cầu hỗ trợ từ người dùng." },
  "/admin/system": { title: "Trạng thái hệ thống", description: "Giám sát dịch vụ và hạ tầng." },
  "/admin/system-status": { title: "Trạng thái hệ thống", description: "Giám sát dịch vụ và hạ tầng." },
  "/admin/audit-logs": { title: "Audit logs", description: "Theo dõi nhật ký quản trị." },
};

function AdminTopbarUserSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-11 w-11 rounded-2xl" />
      <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="hidden space-y-2 sm:block">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-3 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const currentRoute = Object.keys(routeConfigs).find((route) => {
    if (route === "/admin") return pathname === "/admin";
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  const config = routeConfigs[currentRoute || "/admin"];
  const isLoading = status === "loading";
  const initial = (session?.user?.name?.[0] || session?.user?.email?.[0] || "A").toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <AdminMobileNav />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold text-slate-950 sm:text-2xl">{config.title}</h1>
            <p className="mt-1 hidden truncate text-sm text-slate-500 sm:block">{config.description}</p>
          </div>
        </div>

        {isLoading ? (
          <AdminTopbarUserSkeleton />
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] sm:hidden" aria-label="Thông báo">
              <Bell className="h-5 w-5" />
            </button>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm transition-colors" aria-label="Thông tin tài khoản admin">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt={session?.user?.name || "Administrator"} className="h-full w-full object-cover" />
                ) : (
                  initial
                )}
              </span>
              <div className="hidden min-w-0 sm:block">
                <div className="flex items-center gap-2">
                  <p className="max-w-[140px] truncate text-sm font-bold text-slate-950">{session?.user?.name || "Administrator"}</p>
                  <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700">Admin</span>
                </div>
                <p className="max-w-[180px] truncate text-xs text-slate-500">{session?.user?.email || "admin@tzoshop.io.vn"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
