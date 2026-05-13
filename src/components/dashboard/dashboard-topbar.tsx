"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "KHU VỰC QUẢN LÝ",
    description: "Theo dõi credits, API key và mức sử dụng của bạn.",
  },
  "/plans": {
    title: "MUA CREDITS",
    description: "Chọn gói credits phù hợp để sử dụng trong tài khoản của bạn.",
  },
  "/my-plans": {
    title: "GÓI CỦA TÔI",
    description: "Xem các gói credits đang hoạt động và thời hạn sử dụng.",
  },
  "/billing": {
    title: "THANH TOÁN",
    description: "Quản lý đơn hàng, thanh toán và lịch sử giao dịch.",
  },
  "/coupons": {
    title: "MÃ GIẢM GIÁ",
    description: "Quản lý và sử dụng các mã ưu đãi dành riêng cho bạn.",
  },
  "/api-keys": {
    title: "API KEYS",
    description: "Tạo, quản lý và bảo vệ các API key trong tài khoản của bạn.",
  },
  "/api-docs": {
    title: "TÀI LIỆU API",
    description: "Hướng dẫn tích hợp API, endpoint chung và danh sách model hỗ trợ.",
  },
  "/usage": {
    title: "LỊCH SỬ SỬ DỤNG",
    description: "Theo dõi request, credits đã dùng và phát hiện bất thường.",
  },
  "/settings": {
    title: "CÀI ĐẶT",
    description: "Cập nhật hồ sơ, thông báo và các tùy chọn tài khoản.",
  },
  "/support": {
    title: "HỖ TRỢ",
    description: "Liên hệ và gửi yêu cầu hỗ trợ khi sử dụng TzoShop.",
  },
};

function getMeta(pathname: string) {
  const exact = pageMeta[pathname];
  if (exact) return exact;
  const matched = Object.keys(pageMeta)
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname.startsWith(`${p}/`));
  return matched ? pageMeta[matched] : pageMeta["/dashboard"];
}

export default function DashboardTopbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const pathname = usePathname();
  const meta = getMeta(pathname);

  return (
    <header className="sticky top-0 z-40 h-20 border-b-4 border-black bg-[#FFFDF5]">
      <div className="flex h-full items-center justify-between gap-3 px-5 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="flex h-11 w-11 items-center justify-center border-4 border-black bg-white shadow-[3px_3px_0px_0px_#000] lg:hidden"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-black uppercase text-black sm:text-xl">{meta.title}</h1>
            <p className="truncate text-xs font-bold text-black/70 sm:text-sm">{meta.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/plans"
            className="hidden h-11 items-center justify-center border-4 border-black bg-[#FFD93D] px-4 text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:flex"
          >
            MUA CREDITS
          </Link>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
