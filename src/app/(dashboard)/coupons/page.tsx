"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Tag, TicketPercent } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { PageHeader } from "@/components/ui/page-header";
import { AppCard } from "@/components/ui/app-card";
import { AppButton } from "@/components/ui/app-button";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";
import { CouponsPageSkeleton } from "@/components/dashboard/coupons/coupons-page-skeleton";

type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscountVnd: number | null;
  endsAt: string | null;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<{ available: Coupon[]; used: Coupon[] }>({
    available: [],
    used: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "used">("available");
  const { toast, showToast, clearToast } = useToast();

  const loadCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/coupons/my");
      const result = await res.json();
      if (result.success) setCoupons(result.data);
    } catch {
      showToast("Không thể tải danh sách mã giảm giá.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCoupons();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadCoupons]);

  const formatVnd = (val: number) => new Intl.NumberFormat("vi-VN").format(val) + "đ";

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    showToast("Đã sao chép mã giảm giá.", "success");
  };

  const list = coupons[activeTab];

  if (isLoading) {
    return (
      <main className="space-y-8" aria-busy="true">
        <CouponsPageSkeleton />
      </main>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        title="KHO MÃ GIẢM GIÁ"
        description="Quản lý và sử dụng các mã ưu đãi dành riêng cho bạn."
        icon={<TicketPercent className="h-8 w-8" />}
      />

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("available")}
            className={`border-4 border-black px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000] ${
              activeTab === "available" ? "bg-[#FFD93D]" : "bg-white"
            }`}
          >
            CÓ THỂ DÙNG ({coupons.available.length})
          </button>
          <button
            onClick={() => setActiveTab("used")}
            className={`border-4 border-black px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000] ${
              activeTab === "used" ? "bg-[#FFD93D]" : "bg-white"
            }`}
          >
            ĐÃ DÙNG ({coupons.used.length})
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <section className="min-w-0">
            <div className="space-y-6">
              {list.length === 0 ? (
                <AppCard className="p-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000]">
                    <TicketPercent className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-black">
                    {activeTab === "available" ? "BẠN CHƯA CÓ MÃ GIẢM GIÁ NÀO" : "CHƯA CÓ MÃ NÀO ĐÃ DÙNG"}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-black/70">
                    {activeTab === "available"
                      ? "Các mã ưu đãi dành cho tài khoản của bạn sẽ xuất hiện tại đây."
                      : "Những mã bạn đã sử dụng sẽ được lưu lại tại đây."}
                  </p>
                </AppCard>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {list.map((coupon) => (
                    <AppCard key={coupon.id} className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#C7F0D8]">
                            <Tag className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-black">{coupon.name}</p>
                            <p className="text-xs font-black uppercase text-black/70">{coupon.code}</p>
                          </div>
                        </div>
                        <p className="text-2xl font-black text-black">-{coupon.discountPercent}%</p>
                      </div>
                      <p className="text-xs font-bold text-black/70">Đơn tối thiểu: {formatVnd(coupon.minOrderAmount)}</p>
                      {coupon.maxDiscountVnd && (
                        <p className="text-xs font-bold text-black/70">Giảm tối đa: {formatVnd(coupon.maxDiscountVnd)}</p>
                      )}
                      <p className="mt-1 text-xs font-bold text-black/70">
                        {coupon.endsAt ? `Hết hạn: ${format(new Date(coupon.endsAt), "dd/MM/yyyy", { locale: vi })}` : "Vô thời hạn"}
                      </p>
                      {activeTab === "available" ? (
                        <AppButton variant="secondary" className="mt-4 w-full" onClick={() => void copyCode(coupon.code)}>
                          <Copy className="mr-2 h-4 w-4" />COPY MÃ
                        </AppButton>
                      ) : (
                        <div className="mt-4 flex items-center justify-center gap-2 border-2 border-black bg-[#E9E1D0] py-2 text-xs font-black uppercase">
                          <CheckCircle2 className="h-4 w-4" /> ĐÃ DÙNG
                        </div>
                      )}
                    </AppCard>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="min-w-0 xl:sticky xl:top-24">
            <AppCard className="bg-[#C7F0D8] p-6">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-base font-black uppercase text-black">LƯU Ý SỬ DỤNG</h3>
              </div>
              <ul className="space-y-2 text-xs font-bold text-black/80">
                <li>• Mỗi đơn hàng chỉ áp dụng tối đa 1 mã giảm giá.</li>
                <li>• Mã chỉ có hiệu lực khi đơn hàng thanh toán thành công.</li>
                <li>• Nếu đơn bị hủy hoặc hết hạn, mã sẽ được hoàn lại kho.</li>
              </ul>
            </AppCard>
          </aside>
        </div>
      </div>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  );
}

