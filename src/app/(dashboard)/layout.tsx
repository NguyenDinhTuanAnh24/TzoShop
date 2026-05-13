"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard/dashboard-topbar";

const SIDEBAR_KEY = "tzoshop-sidebar-collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <DashboardSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`min-h-screen min-w-0 bg-[#FFFDF5] transition-[margin-left] duration-200 ${
          collapsed ? "lg:ml-20" : "lg:ml-[250px]"
        }`}
      >
        <DashboardTopbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="min-w-0 px-5 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

