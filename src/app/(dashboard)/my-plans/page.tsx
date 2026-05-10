"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Zap,
  History,
  CheckCircle2,
  KeyRound,
  Clock3,
  AlertCircle,
  Cpu,
  Plus
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import Skeleton from "react-loading-skeleton";
import { StatCardsSkeleton, CardListSkeleton } from "@/components/ui/page-skeleton";
import DashboardSubNav from "@/components/dashboard/dashboard-sub-nav";

type ApiFamily = "CODEXAI" | "CLAUDE" | "GEMINI" | "DEEPSEEK";

type MyPlanItem = {
  id: string;
  apiFamily: ApiFamily;
  creditsTotal: string;
  creditsRemaining: string;
  usedCredits: string;
  apiKeyLimit: number;
  activeApiKeys: number;
  allowedModels: string[];
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    tier: string;
  } | null;
};

function getFamilyLabel(apiFamily: ApiFamily) {
  const familyMap: Record<ApiFamily, string> = {
    CODEXAI: "CodexAI",
    CLAUDE: "Claude",
    GEMINI: "Gemini",
    DEEPSEEK: "DeepSeek",
  };
  return familyMap[apiFamily];
}

function formatCredits(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("vi-VN").format(num);
}

function getBucketStatus(remaining: string, expiresAt: string, isActive: boolean) {
  const now = new Date();
  const exp = new Date(expiresAt);
  const rem = Number(remaining);

  if (!isActive) return "REVOKED";
  if (exp < now) return "EXPIRED";
  if (rem <= 0) return "DEPLETED";
  return "ACTIVE";
}

export default function MyPlansPage() {
  const [buckets, setBuckets] = useState<MyPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModelBucketIds, setExpandedModelBucketIds] = useState<Set<string>>(new Set());
  const { toast, showToast, clearToast } = useToast(3000);

  const toggleExpandModel = (id: string) => {
    setExpandedModelBucketIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/my-plans", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? "Lỗi tải dữ liệu.");
      setBuckets(data.data ?? []);
    } catch (error) {
      showToast("Không thể tải dữ liệu gói.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const activeBuckets = buckets.filter(b => b.isActive);
    const totalRemaining = buckets.reduce((sum, b) => sum + Number(b.creditsRemaining), 0);
    const totalUsed = buckets.reduce((sum, b) => sum + Number(b.usedCredits), 0);
    const activeKeys = buckets.reduce((sum, b) => sum + b.activeApiKeys, 0);

    return { totalRemaining, totalUsed, activeCount: activeBuckets.length, activeKeys };
  }, [buckets]);

  const btnPrimary = "rounded-full bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2";

  return (
    <div className="space-y-10 pb-20">
      <DashboardSubNav 
        items={[
          { label: "Mua credits", href: "/plans" },
          { label: "Gói của tôi", href: "/my-plans" },
        ]} 
      />
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <AppIcon icon={Package} className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Gói của tôi</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Theo dõi credits, thời hạn và quản lý các gói credits đã sở hữu.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Credits còn lại</p>
              <AppIcon icon={Zap} className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{formatCredits(stats.totalRemaining)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Credits đã dùng</p>
              <AppIcon icon={History} className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{formatCredits(stats.totalUsed)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Gói hoạt động</p>
              <AppIcon icon={CheckCircle2} className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.activeCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">API Key đang dùng</p>
              <AppIcon icon={KeyRound} className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{stats.activeKeys}</p>
          </div>
        </div>
      )}

      {/* Buckets List */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-black text-slate-900">Danh sách gói sở hữu</h2>
          <Link href="/plans" className={btnPrimary + " w-full sm:w-auto"}>
            <Plus className="h-4 w-4" />
            Mua thêm credits
          </Link>
        </div>

        {isLoading ? (
          <CardListSkeleton count={2} />
        ) : buckets.length === 0 ? (
          <div className="rounded-[40px] border border-dashed border-slate-300 bg-slate-50/50 p-10 sm:p-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 mb-6">
              <AppIcon icon={Package} className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Bạn chưa sở hữu gói nào.</h3>
            <p className="mt-2 text-slate-500 font-medium">Khám phá cửa hàng để chọn gói credits phù hợp ngay.</p>
            <div className="mt-8 flex justify-center">
              <Link href="/plans" className={btnPrimary + " w-full sm:w-auto"}>
                <Plus className="h-4 w-4" />
                Mua gói đầu tiên ngay
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {buckets.map((bucket) => {
              const status = getBucketStatus(bucket.creditsRemaining, bucket.expiresAt, bucket.isActive);
              const remainingNum = Number(bucket.creditsRemaining);
              const totalNum = Number(bucket.creditsTotal);
              const progress = totalNum > 0 ? Math.round((remainingNum / totalNum) * 100) : 0;

              return (
                <article
                  key={bucket.id}
                  className="group relative rounded-[32px] border border-slate-200 bg-white p-5 sm:p-8 shadow-sm transition-all hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex-1 min-w-0 space-y-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                          <AppIcon icon={Package} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-black text-slate-900 truncate">{bucket.product?.name ?? "Gói Tùy Chỉnh"}</h3>
                            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                              }`}>
                              <AppIcon icon={status === "ACTIVE" ? CheckCircle2 : AlertCircle} className="h-3.5 w-3.5" />
                              {status === "ACTIVE" ? "Đang hoạt động" : status === "EXPIRED" ? "Hết hạn" : status === "DEPLETED" ? "Hết credits" : "Đã thu hồi"}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{getFamilyLabel(bucket.apiFamily)}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase">
                            <AppIcon icon={Zap} className="h-3.5 w-3.5" />
                            Credits còn lại
                          </p>
                          <p className="text-sm font-black text-slate-900">{progress}%</p>
                        </div>
                        <div className="h-3 w-full rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progress > 20 ? "bg-emerald-500" : "bg-rose-500"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm font-black gap-2">
                          <span className="text-emerald-600 truncate">{formatCredits(bucket.creditsRemaining)}</span>
                          <span className="text-slate-300 truncate">/ {formatCredits(bucket.creditsTotal)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid shrink-0 gap-4 sm:grid-cols-2 lg:w-[400px] border-t border-slate-50 pt-6 lg:border-none lg:pt-0">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <AppIcon icon={KeyRound} className="h-3.5 w-3.5 text-slate-400" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">API Keys</p>
                        </div>
                        <p className="text-base font-black text-slate-900">{bucket.activeApiKeys} / {bucket.apiKeyLimit}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <AppIcon icon={Clock3} className="h-3.5 w-3.5 text-slate-400" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hạn dùng</p>
                        </div>
                        <p className="text-base font-black text-slate-900">{new Date(bucket.expiresAt).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="col-span-full rounded-2xl bg-slate-50 p-4 sm:p-5 ring-1 ring-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <AppIcon icon={Cpu} className="h-4 w-4 text-slate-500" />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Models được phép</p>
                          </div>
                        </div>

                        {bucket.allowedModels && bucket.allowedModels.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {(expandedModelBucketIds.has(bucket.id)
                                ? bucket.allowedModels
                                : bucket.allowedModels.slice(0, 6)
                              ).map((m) => (
                                <span
                                  key={m}
                                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>

                            {bucket.allowedModels.length > 6 && (
                              <button
                                onClick={() => toggleExpandModel(bucket.id)}
                                className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm"
                              >
                                {expandedModelBucketIds.has(bucket.id) ? (
                                  "Thu gọn"
                                ) : (
                                  `Xem tất cả ${bucket.allowedModels.length} model`
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-slate-500 italic">
                            Chưa có model được cấu hình.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  );
}
