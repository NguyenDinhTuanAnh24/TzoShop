"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import DashboardMobileNav from "./dashboard-mobile-nav";
import { buttonStyles } from "@/lib/ui-styles";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Khu vực quản lý",
    description: "Theo dõi credits, API key và mức sử dụng của bạn.",
  },
  "/plans": {
    title: "Mua credits",
    description: "Chọn gói credits phù hợp để sử dụng trong tài khoản của bạn.",
  },
  "/my-plans": {
    title: "Gói của tôi",
    description: "Xem các gói credits đang hoạt động và thời hạn sử dụng.",
  },
  "/api-keys": {
    title: "API Keys",
    description: "Tạo, quản lý và bảo vệ các API key trong tài khoản của bạn.",
  },
  "/api-docs": {
    title: "Tài liệu API",
    description:
      "Hướng dẫn tích hợp API, endpoint chung và danh sách model hỗ trợ.",
  },
  "/usage": {
    title: "Lịch sử sử dụng",
    description: "Theo dõi request, credits đã dùng và phát hiện bất thường.",
  },
  "/billing": {
    title: "Thanh toán",
    description: "Quản lý đơn hàng, thanh toán và lịch sử giao dịch.",
  },
  "/settings": {
    title: "Cài đặt",
    description: "Cập nhật hồ sơ, thông báo và các tùy chọn tài khoản.",
  },
};

export default function DashboardTopbar() {
  const pathname = usePathname();

  const meta = pageMeta[pathname] ?? {
    title: "Khu vực quản lý",
    description: "Quản lý tài khoản và theo dõi trạng thái sử dụng của bạn.",
  };

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {/* Menu mobile nằm trên topbar */}
          <DashboardMobileNav />

          <div className="flex min-w-0 flex-col justify-center">
            <h1 className="truncate text-[20px] font-semibold leading-tight text-[#0b0f0d] lg:text-[24px]">
              {meta.title}
            </h1>
            <p className="mt-1 line-clamp-1 text-xs leading-5 text-[#5f6b66] sm:text-sm">
              {meta.description}
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <Link
            href="/plans"
            className={`flex items-center justify-center ${buttonStyles.primary}`}
          >
            Mua credits
          </Link>

          <button className={`flex items-center justify-center ${buttonStyles.secondary}`}>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
