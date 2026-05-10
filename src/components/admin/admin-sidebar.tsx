"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardBrand from "@/components/dashboard/dashboard-brand";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart,
  CreditCard, 
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
  { 
    href: "/admin", 
    label: "Thống kê", 
    icon: LayoutDashboard,
    activePaths: ["/admin"]
  },
  { 
    href: "/admin/users", 
    label: "Người dùng", 
    icon: Users,
    activePaths: ["/admin/users"]
  },
  { 
    href: "/admin/products", 
    label: "Gói Credits", 
    icon: Package,
    activePaths: ["/admin/products"]
  },
  { 
    href: "/admin/orders", 
    label: "Đơn hàng", 
    icon: ShoppingCart,
    activePaths: ["/admin/orders"]
  },
  { 
    href: "/admin/api-keys", 
    label: "API Keys", 
    icon: Key,
    activePaths: ["/admin/api-keys"]
  },
  { 
    href: "/admin/usage", 
    label: "Lịch sử dùng", 
    icon: Activity,
    activePaths: ["/admin/usage"]
  },
  { 
    href: "/admin/support", 
    label: "Hỗ trợ", 
    icon: LifeBuoy,
    activePaths: ["/admin/support"]
  },
  { 
    href: "/admin/models", 
    label: "Cấu hình AI", 
    icon: Cpu,
    activePaths: ["/admin/models"]
  },
  { 
    href: "/admin/providers", 
    label: "Providers", 
    icon: Server,
    activePaths: ["/admin/providers"]
  },
  { 
    href: "/admin/payment-settings/payos", 
    label: "Cấu hình PayOS", 
    icon: CreditCard,
    activePaths: ["/admin/payment-settings/payos"]
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-900 text-slate-300">
      {/* Brand & Back to Dashboard */}
      <div className="shrink-0 space-y-4 px-4 py-6">
        <DashboardBrand isDark />
        
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-3 py-2 text-xs font-bold text-emerald-400 ring-1 ring-emerald-400/20 transition hover:bg-slate-800"
        >
          <ArrowLeft className="h-3 w-3" />
          Về giao diện User
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <nav className="space-y-1">
          {adminMenuItems.map((item) => {
            const isActive = item.activePaths.some(p => pathname === p || pathname.startsWith(p + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <AppIcon icon={item.icon} className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User & Logout */}
      <div className="shrink-0 border-t border-white/5 px-3 py-4 space-y-3">
        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white ring-2 ring-emerald-500/50">
              {session.user.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                Admin {session.user.name?.split(' ').pop()}
              </p>
              <p className="truncate text-[10px] text-slate-500 uppercase font-black tracking-widest">
                Administrator
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-400/10"
        >
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
