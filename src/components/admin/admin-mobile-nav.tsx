"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardBrand from "@/components/dashboard/dashboard-brand";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Key, 
  Activity, 
  LifeBuoy, 
  Cpu, 
  Server,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";

const adminMenuItems = [
  { href: "/admin", label: "Thống kê", icon: LayoutDashboard, activePaths: ["/admin"] },
  { href: "/admin/users", label: "Người dùng", icon: Users, activePaths: ["/admin/users"] },
  { href: "/admin/products", label: "Gói Credits", icon: Package, activePaths: ["/admin/products"] },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart, activePaths: ["/admin/orders"] },
  { href: "/admin/api-keys", label: "API Keys", icon: Key, activePaths: ["/admin/api-keys"] },
  { href: "/admin/usage", label: "Lịch sử dùng", icon: Activity, activePaths: ["/admin/usage"] },
  { href: "/admin/support", label: "Hỗ trợ", icon: LifeBuoy, activePaths: ["/admin/support"] },
  { href: "/admin/models", label: "Cấu hình AI", icon: Cpu, activePaths: ["/admin/models"] },
  { href: "/admin/providers", label: "Providers", icon: Server, activePaths: ["/admin/providers"] },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-5 rounded-full bg-slate-900" />
          <span className="block h-0.5 w-5 rounded-full bg-slate-900" />
          <span className="block h-0.5 w-5 rounded-full bg-slate-900" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-10 h-dvh w-[80vw] max-w-[320px] flex flex-col bg-slate-900 text-slate-300 shadow-2xl animate-in slide-in-from-left">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <DashboardBrand isDark />
              <button onClick={() => setOpen(false)} className="text-2xl">×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-emerald-400 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Về giao diện User
              </Link>

              {adminMenuItems.map((item) => {
                const isActive = item.activePaths.some(p => pathname === p || pathname.startsWith(p + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive ? "bg-emerald-600 text-white" : "hover:bg-slate-800"
                    }`}
                  >
                    <AppIcon icon={item.icon} className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-white/5 p-4">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-400/10"
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
