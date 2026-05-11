"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  Boxes, 
  ServerCog, 
  LifeBuoy, 
  ScrollText, 
  LogOut, 
  ShieldCheck,
  Activity,
  Menu,
  X
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { useConfirm } from "@/hooks/use-confirm";

const menuGroups = [
  {
    title: "Tổng quan",
    items: [
      { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    ]
  },
  {
    title: "Kinh doanh",
    items: [
      { href: "/admin/users", label: "Người dùng", icon: Users },
      { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
      { href: "/admin/products", label: "Gói Credits", icon: Package },
    ]
  },
  {
    title: "Hệ thống API",
    items: [
      { href: "/admin/models", label: "Models", icon: Boxes },
      { href: "/admin/providers", label: "Providers", icon: ServerCog },
      { href: "/admin/usage", label: "Lịch sử dùng", icon: Activity },
    ]
  },
  {
    title: "Hỗ trợ",
    items: [
      { href: "/admin/support", label: "Ticket hỗ trợ", icon: LifeBuoy },
    ]
  },
  {
    title: "Hệ thống",
    items: [
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ]
  }
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { askConfirm } = useConfirm();

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    askConfirm({
      title: "Đăng xuất?",
      description: "Bạn có chắc chắn muốn đăng xuất?",
      confirmLabel: "Đăng xuất",
      cancelLabel: "Hủy",
      type: "danger",
      onConfirm: async () => {
        await signOut({ callbackUrl: "/login" });
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-10 flex h-dvh w-[85vw] max-w-[340px] flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="font-black text-slate-900 tracking-tight">Admin Panel</span>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <nav className="space-y-8">
                {menuGroups.map((group) => (
                  <div key={group.title}>
                    <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      {group.title}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <AppIcon 
                              icon={item.icon} 
                              className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} 
                            />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="border-t border-slate-100 p-4">
              <div className="mb-4 flex items-center gap-3 px-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-600">
                  {session?.user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{session?.user?.name}</p>
                  <p className="truncate text-xs font-medium text-slate-500">{session?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-black text-rose-600 hover:bg-rose-50"
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
