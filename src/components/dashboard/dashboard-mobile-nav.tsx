"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardBrand from "./dashboard-brand";

const menuItems = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/plans", label: "Mua credits" },
  { href: "/my-plans", label: "Gói của tôi" },
  { href: "/api-keys", label: "API Keys" },
  { href: "/usage", label: "Lịch sử sử dụng" },
  { href: "/billing", label: "Thanh toán" },
  { href: "/settings", label: "Cài đặt" },
];

export default function DashboardMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Nút menu trên topbar mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          inline-flex h-10 w-10 items-center justify-center rounded-full
          border border-black/10 bg-white text-[#0b0f0d]
          shadow-sm transition hover:bg-[#f4f8f6]
          lg:hidden
        "
        aria-label="Mở menu"
      >
        <span className="sr-only">Mở menu</span>
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
          />

          {/* Drawer */}
          <aside className="relative z-10 h-dvh w-[82vw] max-w-[340px] overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-4">
              <DashboardBrand />

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-lg font-semibold hover:bg-[#f4f8f6]"
                aria-label="Đóng menu"
              >
                ×
              </button>
            </div>

            <nav className="space-y-1 px-3 py-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#e6f6ef] text-[#0b6b57]"
                        : "text-[#1f2b26] hover:bg-[#f4f8f6]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-3 pb-4">
              <div className="rounded-2xl border border-black/10 bg-[#f8fbfa] p-4">
                <p className="text-sm font-semibold text-[#0b0f0d]">
                  Credits sắp hết?
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f6b66]">
                  Mua thêm gói phù hợp để tiếp tục sử dụng không bị gián đoạn.
                </p>

                <Link
                  href="/plans"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex h-10 items-center justify-center rounded-full bg-[#0d8f73] text-sm font-bold text-white transition hover:opacity-90"
                >
                  Xem gói
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
