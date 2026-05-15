"use client";

import { useEffect, useState, type CSSProperties } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("tzoshop-admin-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    window.localStorage.setItem("tzoshop-admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40"
      style={{ "--admin-sidebar-width": collapsed ? "88px" : "280px" } as CSSProperties}
    >
      <AdminSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((prev) => !prev)} />

      <div className="min-h-screen lg:pl-[var(--admin-sidebar-width)]">
        <AdminTopbar />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
