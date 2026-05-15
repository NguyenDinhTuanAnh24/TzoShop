"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { ArrowRight, CreditCard, DollarSign, Download, Package, RefreshCw, ShoppingCart, Target, TrendingUp, Wallet, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import { downloadCsv } from "@/lib/download-csv";
import { translateStatus } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TextFadeInUp } from "@/components/animations/text-fade-in-up";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type RevenueData = {
  summary: {
    totalRevenueVnd: number;
    todayRevenueVnd: number;
    monthRevenueVnd: number;
    paidOrders: number;
    pendingOrders: number;
    creditsSold: string;
    creditsGranted: string;
    averageOrderValueVnd: number;
  };
  revenueByDay: {
    date: string;
    revenueVnd: number;
    paidOrders: number;
  }[];
  revenueByFamily: {
    apiFamily: string;
    revenueVnd: number;
    paidOrders: number;
    creditsSold: string;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    apiFamily: string;
    paidOrders: number;
    revenueVnd: number;
    creditsSold: string;
  }[];
  recentPaidOrders: {
    id: string;
    orderCode: string;
    userEmail: string;
    productName: string;
    apiFamily: string;
    amountVnd: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
  }[];
};

type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

const revenueChartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "#7c3aed",
  },
  orders: {
    label: "Đơn hàng",
    color: "#4f46e5",
  },
} satisfies ChartConfig;

function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} đ`;
}

function formatNum(value: string | number) {
  return new Intl.NumberFormat("vi-VN").format(Number(value));
}

function familyClass(family: string) {
  if (family === "CODEXAI") return "border-indigo-100 bg-indigo-50 text-indigo-700";
  if (family === "CLAUDE") return "border-orange-100 bg-orange-50 text-orange-700";
  if (family === "GEMINI") return "border-sky-100 bg-sky-50 text-sky-700";
  if (family === "DEEPSEEK") return "border-violet-100 bg-violet-50 text-violet-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

function orderStatusClass(status: string) {
  if (status === "PAID") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (status === "PENDING") return "border-amber-100 bg-amber-50 text-amber-700";
  if (status === "CANCELLED") return "border-rose-100 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-100 text-slate-600";
}

function RevenueSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="mt-4 h-10 w-60 rounded-xl" />
        <Skeleton className="mt-3 h-5 w-[560px] max-w-full rounded-full" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Skeleton className="h-11 w-28 rounded-xl" />
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      </section>
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="mt-5 h-4 w-32 rounded-full" />
            <Skeleton className="mt-3 h-8 w-36 rounded-xl" />
            <Skeleton className="mt-2 h-4 w-40 rounded-full" />
          </div>
        ))}
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-56 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-80 rounded-full" />
          <div className="mt-6">
            <Skeleton className="h-[320px] w-full rounded-2xl" />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-60 rounded-lg" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast, showToast, clearToast } = useToast(3000);

  const fetchRevenueData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const res = await fetch("/api/admin/revenue", { cache: "no-store" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();
      setData(result);
    } catch {
      setLoadError("Vui lòng thử lại sau ít phút.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchRevenueData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRevenueData]);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await downloadCsv("/api/admin/revenue/export", `tzoshop-revenue-${format(new Date(), "yyyy-MM-dd")}.csv`);
      showToast("Đã xuất CSV thành công.", "success");
    } catch {
      showToast("Không thể xuất CSV.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const revenueChartData = useMemo<RevenuePoint[]>(
    () =>
      (data?.revenueByDay || []).slice(-7).map((item) => ({
        date: item.date.split("-").slice(1).reverse().join("/"),
        revenue: item.revenueVnd,
        orders: item.paidOrders,
      })),
    [data?.revenueByDay]
  );
  const isRevenueEmpty = useMemo(() => revenueChartData.every((item) => item.revenue === 0 && item.orders === 0), [revenueChartData]);
  const maxOrders = useMemo(() => Math.max(...revenueChartData.map((item) => item.orders), 0), [revenueChartData]);
  const yMaxOrders = Math.max(maxOrders, 4);
  const yOrderTicks = Array.from({ length: yMaxOrders + 1 }, (_, index) => index);
  const periodTotal = useMemo(() => revenueChartData.reduce((sum, item) => sum + item.revenue, 0), [revenueChartData]);

  const totalFamilyRevenue = useMemo(
    () => (data?.revenueByFamily || []).reduce((sum, item) => sum + item.revenueVnd, 0),
    [data?.revenueByFamily]
  );

  if (isLoading && !data) return <RevenueSkeleton />;

  if (loadError && !data) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-950">Không thể tải dữ liệu doanh thu</h2>
        <p className="mt-2 text-sm text-slate-600">{loadError}</p>
        <button
          type="button"
          onClick={() => void fetchRevenueData()}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Thử lại
        </button>
      </section>
    );
  }

  if (!data) return null;

  const statCards = [
    { label: "Tổng doanh thu", value: formatVnd(data.summary.totalRevenueVnd), desc: "Toàn bộ thời gian", icon: Wallet, iconClass: "bg-emerald-50 text-emerald-600" },
    { label: "Doanh thu hôm nay", value: formatVnd(data.summary.todayRevenueVnd), desc: "Trong ngày hiện tại", icon: DollarSign, iconClass: "bg-indigo-50 text-indigo-600" },
    { label: "Doanh thu tháng này", value: formatVnd(data.summary.monthRevenueVnd), desc: "Theo tháng hiện tại", icon: TrendingUp, iconClass: "bg-sky-50 text-sky-600" },
    { label: "Giá trị đơn TB", value: formatVnd(data.summary.averageOrderValueVnd), desc: "Mỗi đơn thanh toán", icon: Target, iconClass: "bg-violet-50 text-violet-600" },
    { label: "Đơn đã thanh toán", value: `${formatNum(data.summary.paidOrders)} đơn`, desc: "Đơn hàng thành công", icon: ShoppingCart, iconClass: "bg-emerald-50 text-emerald-600" },
    { label: "Chờ thanh toán", value: `${formatNum(data.summary.pendingOrders)} đơn`, desc: "Đơn hàng đang chờ", icon: CreditCard, iconClass: "bg-amber-50 text-amber-600" },
    { label: "Credits đã bán", value: formatNum(data.summary.creditsSold), desc: "Từ đơn đã thanh toán", icon: Zap, iconClass: "bg-violet-50 text-violet-600" },
    { label: "Credits đã cấp", value: formatNum(data.summary.creditsGranted), desc: "Đã cấp cho tài khoản", icon: Package, iconClass: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="w-full space-y-6">
      <TextFadeInUp as="section" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
              Revenue
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Thống kê doanh thu</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Theo dõi doanh thu, đơn thanh toán và hiệu quả kinh doanh của TzoShop.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void fetchRevenueData()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98]"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading ? "animate-spin" : "")} />
              Làm mới
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportCsv}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className={cn("h-4 w-4", isExporting ? "animate-pulse" : "")} />
              {isExporting ? "Đang xuất..." : "Xuất CSV"}
            </button>
          </div>
        </div>
      </TextFadeInUp>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <TextFadeInUp
            key={card.label}
            delay={Math.min(index * 0.05, 0.25)}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.28)]"
          >
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", card.iconClass)}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.desc}</p>
          </TextFadeInUp>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TextFadeInUp as="section" delay={0.06} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Doanh thu theo thời gian</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Hiển thị 7 ngày gần nhất để theo dõi xu hướng doanh thu và số đơn.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tổng giai đoạn</p>
              <p className="mt-1 text-lg font-extrabold text-slate-950">{formatVnd(periodTotal)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/30 p-4">
            <ChartContainer config={revenueChartConfig} className="h-[320px] w-full">
              <ComposedChart accessibilityLayer data={revenueChartData} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} interval="preserveStartEnd" minTickGap={28} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  yAxisId="revenue"
                  hide
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  allowDecimals={false}
                  domain={[0, "dataMax"]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const numberValue = Number(value);
                    if (numberValue >= 1000000) return `${Math.round(numberValue / 1000000)}M`;
                    if (numberValue >= 1000) return `${Math.round(numberValue / 1000)}K`;
                    return String(Math.round(numberValue));
                  }}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  allowDecimals={false}
                  domain={[0, yMaxOrders]}
                  ticks={yOrderTicks}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent className="[&_.flex-1]:justify-start [&_.flex-1]:gap-2" formatter={(value, name) => <span className="font-sans">{name === "revenue" ? formatVnd(Number(value)) : `${Math.round(Number(value))} đơn`}</span>} />} />
                <Area yAxisId="revenue" type="monotone" dataKey="revenue" fill="url(#revenueGradient)" stroke="var(--color-revenue)" strokeWidth={3} dot={{ r: 3, fill: "var(--color-revenue)", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 2 }} />
                <Bar yAxisId="orders" dataKey="orders" fill="url(#ordersGradient)" radius={[8, 8, 0, 0]} maxBarSize={32} />
              </ComposedChart>
            </ChartContainer>
          </div>

          {isRevenueEmpty ? (
            <p className="mt-3 text-sm text-slate-500">Chưa có doanh thu trong khoảng thời gian này.</p>
          ) : null}
        </TextFadeInUp>

        <TextFadeInUp as="section" delay={0.1} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-950">Doanh thu theo dòng AI</h2>
          <p className="mt-1 text-sm text-slate-600">Phân bổ doanh thu theo từng dòng credits.</p>
          {data.revenueByFamily.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">Chưa có doanh thu theo dòng AI.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {data.revenueByFamily.map((item) => {
                const percent = totalFamilyRevenue > 0 ? (item.revenueVnd / totalFamilyRevenue) * 100 : 0;
                return (
                  <div key={item.apiFamily} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", familyClass(item.apiFamily))}>{item.apiFamily}</span>
                      <p className="text-sm font-extrabold text-slate-900">{formatVnd(item.revenueVnd)}</p>
                    </div>
                    <p className="mb-2 text-xs text-slate-500">{percent.toFixed(1)}% • {item.paidOrders} đơn</p>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600" style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TextFadeInUp>
      </section>

      <TextFadeInUp as="section" delay={0.14} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">Đơn hàng thanh toán gần đây</h2>
            <p className="text-sm text-slate-600">Các đơn hàng đã thanh toán gần nhất.</p>
          </div>
          <Link href="/admin/orders?status=PAID" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {data.recentPaidOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-600">Chưa có đơn hàng thanh toán.</div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Gói credits</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPaidOrders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100 transition hover:bg-indigo-50/30">
                    <td className="px-4 py-3 font-semibold text-slate-900">#{order.orderCode}</td>
                    <td className="px-4 py-3 max-w-[240px] truncate text-slate-700">{order.userEmail}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="max-w-[240px] truncate text-slate-800">{order.productName}</span>
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", familyClass(order.apiFamily))}>{order.apiFamily}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatVnd(order.amountVnd)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", orderStatusClass(order.status))}>
                        {translateStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{order.paidAt ? format(new Date(order.paidAt), "dd/MM HH:mm") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TextFadeInUp>

      {toast ? <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} /> : null}
    </div>
  );
}
