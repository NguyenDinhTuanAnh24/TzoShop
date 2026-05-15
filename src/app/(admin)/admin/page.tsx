"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Inbox,
  Key,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { Skeleton } from "@/components/ui/skeleton";
import { TextFadeInUp } from "@/components/animations/text-fade-in-up";
import { formatVnd, translateStatus } from "@/lib/format";
import { cn } from "@/lib/utils";

type AdminStats = {
  totalUsers: number;
  revenueVnd: number;
  pendingOrders: number;
  openTickets: number;
  creditsSold: string;
  creditsGranted: string;
  activeApiKeys: number;
  activeModels: number;
  activeProviders: number;
};

type RecentOrder = {
  id: string;
  orderCode: string;
  amountVnd: number;
  status: string;
  createdAt: string;
  user: {
    email: string;
  };
};

type RecentTicket = {
  id: string;
  subject: string;
  email: string;
  priority: string;
  status: string;
  createdAt: string;
};

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="mt-4 h-10 w-64 rounded-xl" />
        <Skeleton className="mt-3 h-5 w-[560px] max-w-full rounded-full" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Skeleton className="h-11 w-44 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="mt-5 h-4 w-28 rounded-full" />
            <Skeleton className="mt-3 h-8 w-32 rounded-xl" />
            <Skeleton className="mt-3 h-4 w-40 rounded-full" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-72 rounded-full" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-44 rounded-lg" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
}

function orderStatusClass(status: string) {
  if (status === "PAID") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (status === "PENDING") return "border-amber-100 bg-amber-50 text-amber-700";
  if (status === "CANCELLED") return "border-rose-100 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-100 text-slate-600";
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [resStats, resOrders, resTickets] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/support"),
      ]);

      const [dataStats, dataOrders, dataTickets] = await Promise.all([
        resStats.json(),
        resOrders.json(),
        resTickets.json(),
      ]);

      if (dataStats.success) setStats(dataStats.data);
      if (dataOrders.success) setRecentOrders(dataOrders.data.slice(0, 5));
      if (dataTickets.success) setRecentTickets(dataTickets.data.slice(0, 5));

      if (!dataStats.success && !dataOrders.success && !dataTickets.success) {
        setLoadError("Vui lòng thử lại sau ít phút.");
      }
    } catch {
      setLoadError("Vui lòng thử lại sau ít phút.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Doanh thu",
        value: formatVnd(stats?.revenueVnd || 0),
        desc: "Tổng doanh thu đã thanh toán",
        icon: DollarSign,
        iconClassName: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Đơn hàng",
        value: (recentOrders.length || 0).toLocaleString(),
        desc: "Đơn hàng gần đây",
        icon: ShoppingCart,
        iconClassName: "bg-indigo-50 text-indigo-700",
      },
      {
        label: "Người dùng",
        value: (stats?.totalUsers || 0).toLocaleString(),
        desc: "Tài khoản đã đăng ký",
        icon: Users,
        iconClassName: "bg-sky-50 text-sky-700",
      },
      {
        label: "Credits đã bán",
        value: Number(stats?.creditsSold || 0).toLocaleString(),
        desc: "Credits cấp thành công",
        icon: Zap,
        iconClassName: "bg-violet-50 text-violet-700",
      },
      {
        label: "API keys",
        value: (stats?.activeApiKeys || 0).toLocaleString(),
        desc: "Khóa API đang hoạt động",
        icon: Key,
        iconClassName: "bg-amber-50 text-amber-700",
      },
      {
        label: "Đơn chờ xử lý",
        value: (stats?.pendingOrders || 0).toLocaleString(),
        desc: "Cần xác nhận thêm",
        icon: AlertTriangle,
        iconClassName: "bg-rose-50 text-rose-700",
      },
    ],
    [recentOrders.length, stats?.activeApiKeys, stats?.creditsSold, stats?.pendingOrders, stats?.revenueVnd, stats?.totalUsers]
  );

  const quickActions = [
    { href: "/admin/products", label: "Thêm gói credits", primary: true },
    { href: "/admin/orders", label: "Quản lý đơn hàng" },
    { href: "/admin/users", label: "Quản lý người dùng" },
    { href: "/admin/coupons", label: "Mã giảm giá" },
    { href: "/admin/audit-logs", label: "Nhật ký hệ thống" },
  ];

  if (isLoading) return <AdminDashboardSkeleton />;

  if (loadError && !stats) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-950">Không thể tải dữ liệu quản trị</h2>
        <p className="mt-2 text-sm text-slate-600">{loadError}</p>
        <button
          type="button"
          onClick={() => void fetchData()}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Thử lại
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-1">
      <TextFadeInUp as="section" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
              Khu vực quản trị
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Theo dõi tổng quan doanh thu, người dùng, đơn hàng và hoạt động credits của TzoShop.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <CosmicButton href="/admin/products" className="min-w-[180px]">Quản lý gói credits</CosmicButton>
            <CosmicButton href="/admin/orders" variant="secondary" className="min-w-[180px]">Xem đơn hàng</CosmicButton>
          </div>
        </div>
      </TextFadeInUp>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <TextFadeInUp
            key={card.label}
            delay={Math.min(index * 0.05, 0.25)}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.28)]"
          >
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", card.iconClassName)}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-3 truncate text-2xl font-extrabold text-slate-950">{card.value}</p>
            <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
          </TextFadeInUp>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <TextFadeInUp as="article" delay={0.08} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Đơn hàng gần đây</h2>
              <p className="text-sm text-slate-600">Theo dõi các giao dịch mới nhất trên hệ thống.</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              aria-label="Xem tất cả đơn hàng"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-slate-900">Chưa có đơn hàng gần đây</p>
              <p className="mt-1 text-sm text-slate-600">Dữ liệu mới sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Mã đơn</th>
                      <th className="px-4 py-3">Người dùng</th>
                      <th className="px-4 py-3">Số tiền</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-100 transition hover:bg-indigo-50/30">
                        <td className="px-4 py-3 font-semibold text-slate-900">#{order.orderCode}</td>
                        <td className="px-4 py-3 min-w-0 max-w-48 truncate text-slate-700">{order.user.email}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{formatVnd(order.amountVnd)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", orderStatusClass(order.status))}>
                            {translateStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 lg:hidden">
                {recentOrders.map((order) => (
                  <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">#{order.orderCode}</p>
                      <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", orderStatusClass(order.status))}>
                        {translateStatus(order.status)}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm text-slate-700">{order.user.email}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">{formatVnd(order.amountVnd)}</span>
                      <span className="text-slate-600">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </TextFadeInUp>

        <TextFadeInUp as="article" delay={0.12} className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">Cảnh báo cần chú ý</h2>
            {stats && (stats.pendingOrders > 0 || stats.openTickets > 0) ? (
              <div className="mt-5 space-y-3">
                {stats.pendingOrders > 0 ? (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                    Có {stats.pendingOrders.toLocaleString()} đơn hàng đang chờ xử lý.
                  </div>
                ) : null}
                {stats.openTickets > 0 ? (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800">
                    Có {stats.openTickets.toLocaleString()} yêu cầu hỗ trợ đang mở.
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
                <p className="font-semibold">Không có cảnh báo mới</p>
                <p className="mt-1">Hệ thống đang hoạt động ổn định.</p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">Thao tác nhanh</h2>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {quickActions.map((action) =>
                action.primary ? (
                  <CosmicButton key={action.href} href={action.href} className="justify-center">
                    {action.label}
                  </CosmicButton>
                ) : (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {action.label}
                  </Link>
                )
              )}
            </div>
          </section>
        </TextFadeInUp>
      </section>

      <TextFadeInUp as="section" delay={0.16} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">Ticket hỗ trợ mới</h2>
            <p className="text-sm text-slate-600">Các yêu cầu cần phản hồi từ đội ngũ quản trị.</p>
          </div>
          <Link
            href="/admin/support"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Xem tất cả
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center text-sm text-slate-600">
            Chưa có ticket mới cần xử lý.
          </div>
        ) : (
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <article key={ticket.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{ticket.subject}</p>
                  <p className="truncate text-sm text-slate-600">{ticket.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", orderStatusClass(ticket.status))}>
                    {translateStatus(ticket.status)}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </TextFadeInUp>
    </div>
  );
}
