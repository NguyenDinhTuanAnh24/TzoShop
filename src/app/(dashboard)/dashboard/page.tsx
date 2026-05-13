"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock3,
  History,
  KeyRound,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Zap,
} from "lucide-react";
import { translateStatus } from "@/lib/format";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

type DashboardData = {
  credits: { total: string; remaining: string; used: string; charged: string };
  apiKeys: { total: number; active: number; revoked: number };
  usage: { totalRequests: number; successRequests: number; failedRequests: number; successRate: number };
  orders: { total: number; paid: number; pending: number; totalPaidAmount: number };
  plans: {
    id: string;
    apiFamily: string;
    creditsTotal: string;
    creditsRemaining: string;
    startsAt: string;
    expiresAt: string;
    product: { id: string; name: string; slug: string; apiFamily: string; tier: string } | null;
  }[];
  recentUsageLogs: {
    id: string;
    apiFamily: string;
    model: string;
    totalTokens: number;
    creditsCharged: string;
    status: string;
    createdAt: string;
    apiKey: { id: string; name: string; keyPrefix: string } | null;
  }[];
  recentOrders: {
    id: string;
    orderCode: string;
    status: string;
    amountVnd: number;
    createdAt: string;
    paidAt: string | null;
    product: { id: string; name: string; slug: string; apiFamily: string; tier: string } | null;
  }[];
};

function formatCreditsValue(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("vi-VN").format(num);
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function getUsagePercent(remaining: string, total: string) {
  const r = Number(remaining);
  const t = Number(total);
  if (!t || t <= 0) return 0;
  const used = t - r;
  return Math.min(100, Math.max(0, Math.round((used / t) * 100)));
}

function brutalBtn(primary?: boolean) {
  return cn(
    "inline-flex h-12 items-center justify-center border-4 border-black px-6 text-sm font-black uppercase text-black shadow-[5px_5px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
    primary ? "bg-[#FF6B6B]" : "bg-white hover:bg-[#FFD93D]"
  );
}

function DashboardPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-9 w-52" />
            <Skeleton className="h-4 w-full max-w-[420px]" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-h-[120px] border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-9" />
            </div>
            <Skeleton className="mt-5 h-8 w-20" />
            <Skeleton className="mt-2 h-4 w-28" />
          </div>
        ))}
      </div>

      <section className="space-y-5">
        <Skeleton className="h-6 w-48" />
        <div className="min-h-[260px] border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000]" />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, clearToast } = useToast(3000);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Lỗi tải dashboard.");
      setData(json.data);
    } catch {
      showToast("Không thể tải dữ liệu tổng quan.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  if (isLoading) {
    return (
      <div className="space-y-8 overflow-x-hidden px-5 py-6 md:px-6 lg:px-8 lg:py-8" aria-busy="true">
        <DashboardPageSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8 overflow-x-hidden px-5 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="border-4 border-black bg-white p-6 text-sm font-bold text-black shadow-[6px_6px_0px_0px_#000]">
          Không có dữ liệu dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 overflow-x-hidden px-5 py-6 md:px-6 lg:px-8 lg:py-8">
      <section className="relative border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="pointer-events-none absolute -bottom-3 -right-3 h-10 w-10 border-4 border-black bg-[#A78BFA]" />
        <div className="pointer-events-none absolute -left-3 -top-3 h-8 w-8 border-4 border-black bg-[#FFD93D]" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center border-4 border-black bg-[#C7F0D8] shadow-[5px_5px_0px_0px_#000]">
                <LayoutDashboard className="h-7 w-7 text-black" strokeWidth={2.5} />
              </div>
              <span className="border-2 border-black bg-[#FFD93D] px-3 py-1 text-xs font-black uppercase text-black">Dashboard</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-black md:text-4xl">TỔNG QUAN</h2>
            <p className="text-sm font-bold text-black/70 md:text-base">Theo dõi credits, API key, đơn hàng và mức sử dụng của bạn.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/plans" className={brutalBtn(true)}>MUA CREDITS</Link>
            <Link href="/api-keys" className={brutalBtn(false)}>TẠO API KEY</Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Credits còn lại", value: formatCreditsValue(data?.credits.remaining ?? "0"), sub: "Có thể sử dụng", icon: Wallet, bg: "bg-[#C7F0D8]" },
          { label: "Credits đã dùng", value: formatCreditsValue(data?.credits.used ?? "0"), sub: "Đã tiêu thụ", icon: Zap, bg: "bg-[#A78BFA]" },
          { label: "API Keys", value: String(data?.apiKeys.active ?? 0), sub: "Đang hoạt động", icon: KeyRound, bg: "bg-[#FFD93D]" },
          { label: "Đơn hàng chờ", value: String(data?.orders.pending ?? 0), sub: "Cần xử lý", icon: Clock3, bg: "bg-[#FF6B6B]" },
        ].map((s) => (
          <article key={s.label} className="min-h-[120px] border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] md:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.08em] text-black">{s.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000] ${s.bg}`}>
                <s.icon className="h-4 w-4 text-black" />
              </div>
            </div>
            <p className="mt-5 text-3xl font-black leading-none text-black">{s.value}</p>
            <p className="mt-2 text-xs font-bold uppercase text-black/70">{s.sub}</p>
          </article>
        ))}
      </div>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]">
              <Package className="h-5 w-5 text-black" />
            </span>
            <h3 className="text-2xl font-black text-black">GÓI ĐANG HOẠT ĐỘNG</h3>
          </div>
          <Link href="/my-plans" className="inline-flex h-11 items-center justify-center border-4 border-black bg-white px-5 text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_#000] transition-all hover:bg-[#FFD93D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">XEM TẤT CẢ</Link>
        </div>

        {data?.plans.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center border-4 border-black bg-[#FFFDF5] p-8 text-center shadow-[8px_8px_0px_0px_#000] md:p-10">
            <div className="mb-5 flex h-16 w-16 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[5px_5px_0px_0px_#000]">
              <Package className="h-8 w-8 text-black" />
            </div>
            <h4 className="text-xl font-black text-black">BẠN CHƯA CÓ GÓI CREDITS NÀO</h4>
            <p className="mt-2 max-w-2xl text-sm font-bold text-black/70">Mua gói credits đầu tiên để bắt đầu tạo API key và sử dụng các model AI.</p>
            <Link href="/plans" className={`${brutalBtn(true)} mt-6`}>MUA CREDITS NGAY</Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.plans.slice(0, 3).map((plan) => {
              const usagePercent = getUsagePercent(plan.creditsRemaining, plan.creditsTotal);
              return (
                <article key={plan.id} className="space-y-4 border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-lg font-black text-black">{plan.product?.name ?? "Gói tùy chỉnh"}</p>
                    <StatusBadge status={plan.apiFamily} variant="neutral" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-wide text-black/70">Credits còn lại</p>
                    <p className="text-2xl font-black text-black">{formatCreditsValue(plan.creditsRemaining)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 border-4 border-black bg-[#E9E1D0] p-[1px]">
                      <div className="h-full bg-[#C7F0D8]" style={{ width: `${usagePercent}%` }} />
                    </div>
                    <p className="text-xs font-bold text-black/70">{formatCreditsValue(plan.creditsRemaining)} / {formatCreditsValue(plan.creditsTotal)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-black/70">
                    <span>Hạn dùng: {new Date(plan.expiresAt).toLocaleDateString("vi-VN")}</span>
                    <Link href="/api-keys" className="font-black uppercase text-black underline">Tạo API key</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#C7F0D8] shadow-[2px_2px_0px_0px_#000]"><History className="h-5 w-5" /></span>
              <h3 className="text-xl font-black text-black">SỬ DỤNG GẦN ĐÂY</h3>
            </div>
            <Link href="/usage" className="inline-flex h-10 items-center justify-center border-4 border-black bg-white px-4 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FFD93D]">CHI TIẾT</Link>
          </div>

          {!data?.recentUsageLogs?.length ? (
            <div className="border-4 border-black bg-[#FFFDF5] p-8 text-center">
              <h4 className="text-lg font-black text-black">CHƯA CÓ LỊCH SỬ SỬ DỤNG</h4>
              <p className="mt-2 text-sm font-bold text-black/70">Khi bạn gọi API, lịch sử sử dụng sẽ hiển thị tại đây.</p>
              <Link href="/api-docs" className="mt-4 inline-flex h-11 items-center justify-center border-4 border-black bg-[#FFD93D] px-4 text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_#000]">XEM HƯỚNG DẪN API</Link>
            </div>
          ) : (
            <div className="space-y-0 border-4 border-black">
              {[...data.recentUsageLogs]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map((log) => (
                  <div key={log.id} className="flex items-center justify-between gap-3 border-b-2 border-black bg-[#FFFDF5] p-4 last:border-b-0">
                    <div>
                      <p className="text-sm font-black text-black">{log.model}</p>
                      <p className="text-xs font-bold text-black/70">{new Date(log.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={translateStatus(log.status)} variant={log.status === "SUCCESS" ? "success" : "danger"} />
                      <p className="mt-1 text-sm font-black text-black">{formatCreditsValue(log.creditsCharged)}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        <section className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]"><ShoppingCart className="h-5 w-5" /></span>
              <h3 className="text-xl font-black text-black">ĐƠN HÀNG GẦN ĐÂY</h3>
            </div>
            <Link href="/billing" className="inline-flex h-10 items-center justify-center border-4 border-black bg-white px-4 text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FFD93D]">TẤT CẢ</Link>
          </div>

          {!data?.recentOrders?.length ? (
            <div className="border-4 border-black bg-[#FFFDF5] p-8 text-center">
              <h4 className="text-lg font-black text-black">CHƯA CÓ ĐƠN HÀNG</h4>
              <p className="mt-2 text-sm font-bold text-black/70">Các đơn mua credits của bạn sẽ được hiển thị tại đây.</p>
              <Link href="/plans" className="mt-4 inline-flex h-11 items-center justify-center border-4 border-black bg-[#FF6B6B] px-4 text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_#000]">MUA CREDITS</Link>
            </div>
          ) : (
            <div className="space-y-0 border-4 border-black">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 border-b-2 border-black bg-[#FFFDF5] p-4 last:border-b-0">
                  <div>
                    <p className="text-sm font-black text-black">{order.product?.name ?? "Gói nạp"}</p>
                    <p className="text-xs font-bold text-black/70">#{order.orderCode} • {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={translateStatus(order.status)} variant={order.status === "PAID" ? "success" : order.status === "PENDING" ? "warning" : "danger"} />
                    <p className="mt-1 text-sm font-black text-black">{formatCurrency(order.amountVnd)}</p>
                    {order.status === "PENDING" && <Link href="/billing" className="text-xs font-black uppercase text-black underline">Thanh toán</Link>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  );
}
