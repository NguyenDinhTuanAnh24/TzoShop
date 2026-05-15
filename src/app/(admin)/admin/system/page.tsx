"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ElementType } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Database,
  Globe,
  HardDrive,
  Mail,
  ShieldCheck,
  Siren,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { TextFadeInUp } from "@/components/animations/text-fade-in-up";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

type StatusInfo = {
  status: "CONFIGURED" | "WARNING" | "MISSING" | "ERROR";
  label: string;
  message: string;
};

type SystemData = {
  config: {
    database: boolean;
    payos: boolean;
    resend: boolean;
    googleOAuth: boolean;
    encryptionSecret: boolean;
  };
  details?: Record<string, StatusInfo | undefined>;
  dbConnected: boolean;
  stats: {
    activeProviders: number;
    activeModels: number;
  };
  recentOrders: {
    id: string;
    amountVnd: number;
    updatedAt: string;
    user: { email: string };
    product: { name: string };
  }[];
  recentUsage: {
    id: string;
    model: string;
    status: string;
    createdAt: string;
    user: { email: string };
  }[];
};

type ServiceCard = {
  key: string;
  title: string;
  description: string;
  status: StatusInfo["status"];
  lastChecked: string;
  icon: ElementType;
  detail?: StatusInfo;
};

function mapStatusLabel(status: StatusInfo["status"]) {
  if (status === "CONFIGURED") return "Hoạt động";
  if (status === "WARNING") return "Cảnh báo";
  if (status === "ERROR") return "Lỗi";
  return "Chưa cấu hình";
}

function mapStatusClass(status: StatusInfo["status"]) {
  if (status === "CONFIGURED") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (status === "WARNING") return "border-amber-100 bg-amber-50 text-amber-700";
  if (status === "ERROR") return "border-rose-100 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-100 text-slate-600";
}

function SystemSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <Skeleton className="h-5 w-40 rounded-full" />
        <Skeleton className="mt-4 h-10 w-64 rounded-xl" />
        <Skeleton className="mt-3 h-5 w-[640px] max-w-full rounded-full" />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-52 rounded-full" />
        <Skeleton className="mt-4 h-10 w-80 rounded-xl" />
      </section>
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="mt-5 h-4 w-28 rounded-full" />
            <Skeleton className="mt-3 h-8 w-24 rounded-xl" />
          </div>
        ))}
      </section>
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="mt-4 h-5 w-40 rounded-full" />
            <Skeleton className="mt-2 h-4 w-full rounded-full" />
            <Skeleton className="mt-2 h-4 w-2/3 rounded-full" />
          </div>
        ))}
      </section>
    </div>
  );
}

export default function AdminSystemPage() {
  const [data, setData] = useState<SystemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<StatusInfo | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const { toast, showToast, clearToast } = useToast(3000);

  const fetchSystemStatus = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        const [resSystem, resStatus] = await Promise.all([fetch("/api/admin/system"), fetch("/api/admin/system-status")]);
        const [resultSystem, resultStatus] = await Promise.all([resSystem.json(), resStatus.json()]);
        if (!resSystem.ok || !resultSystem.success) {
          showToast(resultSystem?.message || "Không thể tải trạng thái hệ thống", "error");
          return;
        }
        const nextData = { ...resultSystem.data };
        if (resStatus.ok && resultStatus.success) nextData.details = resultStatus.data;
        setData(nextData);
        setLastCheckedAt(new Date());
      } catch {
        showToast("Không thể tải trạng thái hệ thống", "error");
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [showToast],
  );

  const refetchHealth = useCallback(async () => {
    try {
      setIsChecking(true);
      const res = await fetch("/api/admin/system-status");
      const result = await res.json();
      if (!res.ok || !result.success) {
        showToast("Không thể kiểm tra trạng thái hệ thống", "error");
        return;
      }
      setData((prev) => (prev ? { ...prev, details: result.data } : prev));
      setLastCheckedAt(new Date());
      showToast("Đã cập nhật trạng thái hệ thống", "success");
    } catch {
      showToast("Không thể kiểm tra trạng thái hệ thống", "error");
    } finally {
      setIsChecking(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchSystemStatus(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchSystemStatus]);

  const serviceCards = useMemo<ServiceCard[]>(() => {
    if (!data) return [];
    const details = data.details || {};
    const nowText = lastCheckedAt ? format(lastCheckedAt, "HH:mm:ss dd/MM/yyyy", { locale: vi }) : "Chưa kiểm tra";
    return [
      { key: "database", title: "Database", description: "Kết nối cơ sở dữ liệu chính.", status: details.database?.status || (data.dbConnected ? "CONFIGURED" : "ERROR"), lastChecked: nowText, icon: Database, detail: details.database },
      { key: "auth", title: "Auth / Session", description: "Google OAuth và phiên đăng nhập.", status: details.googleAuth?.status || (data.config.googleOAuth ? "CONFIGURED" : "MISSING"), lastChecked: nowText, icon: ShieldCheck, detail: details.googleAuth },
      { key: "storage", title: "Supabase Storage", description: "Lưu trữ file và avatar upload.", status: details.database?.status || (data.config.database ? "CONFIGURED" : "ERROR"), lastChecked: nowText, icon: HardDrive, detail: details.database },
      { key: "payment", title: "Payment / PayOS", description: "Kết nối thanh toán PayOS.", status: details.payos?.status || (data.config.payos ? "CONFIGURED" : "MISSING"), lastChecked: nowText, icon: CreditCard, detail: details.payos },
      { key: "email", title: "Email / Resend", description: "Gửi email thông báo hệ thống.", status: details.resend?.status || (data.config.resend ? "CONFIGURED" : "MISSING"), lastChecked: nowText, icon: Mail, detail: details.resend },
      { key: "providers", title: "AI Providers", description: "Trạng thái providers và models.", status: data.stats.activeProviders > 0 ? "CONFIGURED" : "WARNING", lastChecked: nowText, icon: Globe, detail: { status: data.stats.activeProviders > 0 ? "CONFIGURED" : "WARNING", label: "Providers AI", message: data.stats.activeProviders > 0 ? `${data.stats.activeProviders} provider đang hoạt động.` : "Chưa có provider hoạt động." } },
      { key: "webhook", title: "Webhook", description: "Theo dõi đồng bộ trạng thái thanh toán.", status: data.config.payos ? "CONFIGURED" : "MISSING", lastChecked: nowText, icon: Webhook, detail: { status: data.config.payos ? "CONFIGURED" : "MISSING", label: "Payment webhook", message: data.config.payos ? "Webhook có thể xử lý khi cấu hình PayOS đầy đủ." : "Thiếu cấu hình PayOS." } },
    ];
  }, [data, lastCheckedAt]);

  const summary = useMemo(() => {
    const ok = serviceCards.filter((s) => s.status === "CONFIGURED").length;
    const warning = serviceCards.filter((s) => s.status === "WARNING" || s.status === "MISSING").length;
    const error = serviceCards.filter((s) => s.status === "ERROR").length;
    return { ok, warning, error };
  }, [serviceCards]);

  const overall = useMemo(() => {
    if (summary.error > 0) return { label: "Một số dịch vụ đang gặp sự cố", cls: "text-rose-700", badge: "border-rose-100 bg-rose-50 text-rose-700", dot: "bg-rose-500" };
    if (summary.warning > 0) return { label: "Hệ thống có cảnh báo cần kiểm tra", cls: "text-amber-700", badge: "border-amber-100 bg-amber-50 text-amber-700", dot: "bg-amber-500" };
    return { label: "Hệ thống đang hoạt động ổn định", cls: "text-emerald-700", badge: "border-emerald-100 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
  }, [summary]);

  if (isLoading && !data) return <SystemSkeleton />;

  if (!data) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-950">Không thể tải trạng thái hệ thống</h2>
        <p className="mt-2 text-sm text-slate-600">Vui lòng thử lại sau ít phút.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-1">
      <TextFadeInUp as="section" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">Giám sát hệ thống</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Trạng thái hệ thống</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">Theo dõi tình trạng dịch vụ, kết nối hạ tầng, thanh toán, email và các provider AI của TzoShop.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <CosmicButton onClick={refetchHealth} disabled={isChecking}>
              <ShieldCheck className="h-4 w-4" />
              {isChecking ? "Đang kiểm tra..." : "Kiểm tra lại"}
            </CosmicButton>
            <Link href="/admin/providers" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Providers</Link>
            <Link href="/admin/audit-logs" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Nhật ký hệ thống</Link>
          </div>
        </div>
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.04} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tổng quan hệ thống</p>
            <h2 className={cn("mt-2 text-2xl font-extrabold", overall.cls)}>{overall.label}</h2>
            <p className="mt-2 text-sm text-slate-600">Lần kiểm tra gần nhất: {lastCheckedAt ? format(lastCheckedAt, "HH:mm:ss dd/MM/yyyy", { locale: vi }) : "Chưa có dữ liệu"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={cn("inline-flex rounded-full border px-3 py-1 text-sm font-semibold", overall.badge)}>Ổn định {summary.ok}</span>
            <span className="inline-flex rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">Cảnh báo {summary.warning}</span>
            <span className="inline-flex rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">Lỗi {summary.error}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
              <span className="relative flex h-3 w-3">
                <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-30", overall.dot)} />
                <span className={cn("relative inline-flex h-3 w-3 rounded-full", overall.dot)} />
              </span>
              Trạng thái realtime
            </span>
          </div>
        </div>
      </TextFadeInUp>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Dịch vụ ổn định", value: summary.ok, icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700" },
          { label: "Có cảnh báo", value: summary.warning, icon: AlertTriangle, cls: "bg-amber-50 text-amber-700" },
          { label: "Đang lỗi", value: summary.error, icon: Siren, cls: "bg-rose-50 text-rose-700" },
          { label: "Lần kiểm tra gần nhất", value: lastCheckedAt ? format(lastCheckedAt, "HH:mm", { locale: vi }) : "--:--", icon: Clock3, cls: "bg-indigo-50 text-indigo-700" },
        ].map((item, idx) => (
          <TextFadeInUp key={item.label} delay={Math.min(idx * 0.05, 0.25)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", item.cls)}><item.icon className="h-5 w-5" /></div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-extrabold text-slate-950">{typeof item.value === "number" ? item.value.toLocaleString("vi-VN") : item.value}</p>
          </TextFadeInUp>
        ))}
      </section>

      <TextFadeInUp as="section" delay={0.08} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-xl font-extrabold text-slate-950">Dịch vụ chính</h3>
          <p className="mt-1 text-sm text-slate-600">Theo dõi trạng thái các thành phần quan trọng trong hệ thống.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map((service, i) => (
            <TextFadeInUp key={service.key} delay={Math.min(i * 0.04, 0.25)} as="article" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><service.icon className="h-5 w-5" /></div>
                <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", mapStatusClass(service.status))}>{mapStatusLabel(service.status)}</span>
              </div>
              <h4 className="mt-4 text-lg font-extrabold text-slate-950">{service.title}</h4>
              <p className="mt-1 text-sm text-slate-600">{service.description}</p>
              <p className="mt-3 text-xs text-slate-500">Lần kiểm tra: {service.lastChecked}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => service.detail && setSelectedConfig(service.detail)} className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98]">
                  Chi tiết
                </button>
              </div>
            </TextFadeInUp>
          ))}
        </div>
      </TextFadeInUp>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TextFadeInUp as="article" delay={0.1} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-extrabold text-slate-950">Trạng thái providers AI</h3>
          <p className="mt-1 text-sm text-slate-600">Theo dõi số provider và model đang hoạt động.</p>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <p className="font-semibold text-slate-900">Providers hoạt động</p>
                <p className="text-sm text-slate-600">{data.stats.activeProviders} providers</p>
              </div>
              <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", data.stats.activeProviders > 0 ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-700")}>
                {data.stats.activeProviders > 0 ? "Hoạt động" : "Cảnh báo"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <p className="font-semibold text-slate-900">Models hoạt động</p>
                <p className="text-sm text-slate-600">{data.stats.activeModels} models</p>
              </div>
              <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", data.stats.activeModels > 0 ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-700")}>
                {data.stats.activeModels > 0 ? "Hoạt động" : "Cảnh báo"}
              </span>
            </div>
          </div>
          <Link href="/admin/providers" className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Quản lý providers</Link>
        </TextFadeInUp>

        <TextFadeInUp as="article" delay={0.12} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-extrabold text-slate-950">Thanh toán và webhook</h3>
          <p className="mt-1 text-sm text-slate-600">Giám sát PayOS và đồng bộ trạng thái đơn hàng.</p>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="font-semibold text-slate-900">PayOS API</p>
              <p className="mt-1 text-sm text-slate-600">{data.details?.payos?.message || "Chưa có dữ liệu kiểm tra."}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="font-semibold text-slate-900">Payment webhook</p>
              <p className="mt-1 text-sm text-slate-600">Theo dõi trạng thái webhook qua cấu hình PayOS.</p>
            </div>
          </div>
          <Link href="/admin/orders" className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Xem đơn hàng</Link>
        </TextFadeInUp>
      </section>

      <TextFadeInUp as="section" delay={0.14} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-extrabold text-slate-950">Lưu trữ và email</h3>
        <p className="mt-1 text-sm text-slate-600">Trạng thái dịch vụ gửi email và lưu trữ file.</p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="font-semibold text-slate-900">Supabase Storage</p>
            <p className="mt-1 text-sm text-slate-600">{data.details?.database?.status === "CONFIGURED" ? "Storage có thể hoạt động khi database ổn định." : "Cần kiểm tra cấu hình storage."}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="font-semibold text-slate-900">Resend Email</p>
            <p className="mt-1 text-sm text-slate-600">{data.details?.resend?.message || "Chưa có dữ liệu kiểm tra email."}</p>
          </div>
        </div>
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.16} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-extrabold text-slate-950">Cảnh báo gần đây</h3>
        <div className="mt-4 space-y-3">
          {serviceCards.filter((s) => s.status !== "CONFIGURED").length === 0 ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="font-semibold text-emerald-700">Không có cảnh báo mới</p>
              <p className="mt-1 text-sm text-emerald-700/80">Các dịch vụ chính đang hoạt động ổn định.</p>
            </div>
          ) : (
            serviceCards
              .filter((s) => s.status !== "CONFIGURED")
              .map((s) => (
                <div key={s.key} className={cn("rounded-2xl border p-4", s.status === "ERROR" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50")}>
                  <p className={cn("font-semibold", s.status === "ERROR" ? "text-rose-700" : "text-amber-700")}>{s.title}</p>
                  <p className={cn("mt-1 text-sm", s.status === "ERROR" ? "text-rose-700/80" : "text-amber-700/80")}>{s.detail?.message || s.description}</p>
                </div>
              ))
          )}
        </div>
      </TextFadeInUp>

      <Modal
        open={Boolean(selectedConfig)}
        onClose={() => setSelectedConfig(null)}
        title="Chi tiết health check"
        description="Thông tin trạng thái dịch vụ gần nhất."
        maxWidthClassName="max-w-2xl"
      >
        {selectedConfig ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dịch vụ</p>
              <p className="mt-1 text-lg font-extrabold text-slate-950">{selectedConfig.label}</p>
              <span className={cn("mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", mapStatusClass(selectedConfig.status))}>{mapStatusLabel(selectedConfig.status)}</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Chi tiết</p>
              <p className="mt-2 text-sm leading-6 text-slate-700 break-words">{selectedConfig.message}</p>
            </div>
          </div>
        ) : null}
      </Modal>

      {toast ? <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} /> : null}
    </div>
  );
}
