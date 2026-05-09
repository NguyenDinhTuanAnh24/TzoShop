"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardBrand from "./dashboard-brand";
import { buttonStyles } from "@/lib/ui-styles";

const menuItems = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/plans", label: "Mua credits" },
  { href: "/my-plans", label: "Gói của tôi" },
  { href: "/api-keys", label: "API Keys" },
  { href: "/api-docs", label: "Tài liệu API" },
  { href: "/usage", label: "Lịch sử sử dụng" },
  { href: "/billing", label: "Thanh toán" },
  { href: "/settings", label: "Cài đặt" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      {/* Logo */}
      <div className="shrink-0 border-b border-black/5 px-4 py-5">
        <DashboardBrand />
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#e2f6ee] text-[#076b55]"
                    : "text-[#14201b] hover:bg-[#f3f8f6]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Box cuối sidebar */}
      <div className="shrink-0 border-t border-black/5 px-3 py-4">
        <div className="rounded-2xl border border-black/10 bg-[#f8fbfa] p-4">
          <p className="text-sm font-bold text-[#0b0f0d]">Credits sắp hết?</p>

          <p className="mt-2 text-sm leading-6 text-[#5f6b66]">
            Mua thêm gói phù hợp để tiếp tục sử dụng không bị gián đoạn.
          </p>

          <Link
            href="/plans"
            className={buttonStyles.primary}
          >
            Xem gói
          </Link>
        </div>
      </div>
    </div>
  );
}
