"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import { ConfirmToast } from "@/components/ui/confirm-toast";
import { useConfirm } from "@/hooks/use-confirm";
import { 
  KeyRound, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import Skeleton from "react-loading-skeleton";
import { CardListSkeleton } from "@/components/ui/page-skeleton";
import DashboardSubNav from "@/components/dashboard/dashboard-sub-nav";

type ApiFamily = "CODEXAI" | "CLAUDE" | "GEMINI" | "DEEPSEEK";

type ApiKeyItem = {
  id: string;
  name: string;
  apiFamily: ApiFamily;
  keyPrefix: string;
  maskedKey?: string;
  isActive: boolean;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  creditBucket: {
    id: string;
    apiFamily: ApiFamily;
    apiKeyLimit: number;
    creditsTotal: string;
    creditsRemaining: string;
    expiresAt: string;
    product: {
      id: string;
      name: string;
      slug: string;
      tier: string;
    } | null;
  } | null;
};

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

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [plans, setPlans] = useState<MyPlanItem[]>([]);

  const [selectedCreditBucketId, setSelectedCreditBucketId] = useState("");
  const [keyName, setKeyName] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [visibleKeyIds, setVisibleKeyIds] = useState<string[]>([]);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});

  const { toast, showToast, clearToast } = useToast(3000);
  const {
    confirmState,
    isConfirming,
    askConfirm,
    closeConfirm,
    handleConfirm,
  } = useConfirm();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [plansRes, keysRes] = await Promise.all([
        fetch("/api/my-plans", { cache: "no-store" }),
        fetch("/api/api-keys", { cache: "no-store" }),
      ]);

      const plansData = await plansRes.json();
      const keysData = await keysRes.json();

      if (!plansRes.ok) throw new Error(plansData?.error?.message ?? "Lỗi tải gói credits.");
      if (!keysRes.ok) throw new Error(keysData?.error?.message ?? "Lỗi tải API keys.");

      setPlans(plansData.data ?? []);
      setApiKeys(keysData.data ?? []);
    } catch (error) {
      showToast("Không thể tải dữ liệu.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activePlans = useMemo(() => plans.filter(p => p.isActive), [plans]);
  const selectedBucket = useMemo(() => plans.find(p => p.id === selectedCreditBucketId), [plans, selectedCreditBucketId]);

  const handleCreate = async () => {
    if (!selectedCreditBucketId || !keyName.trim()) return;

    try {
      setIsCreating(true);
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: keyName.trim(),
          creditBucketId: selectedCreditBucketId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? "Lỗi tạo API key.");

      showToast("API key mới đã được tạo.", "success");
      setKeyName("");
      setSelectedCreditBucketId("");
      await loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Lỗi tạo API key.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys/${id}/revoke`, { method: "PATCH" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? "Lỗi thu hồi API key.");

      showToast("Đã thu hồi API key.", "success");
      await loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Lỗi thu hồi API key.", "error");
    }
  };

  const handleReveal = async (id: string) => {
    if (visibleKeyIds.includes(id)) {
      setVisibleKeyIds(prev => prev.filter(kid => kid !== id));
      return;
    }

    if (revealedKeys[id]) {
      setVisibleKeyIds(prev => [...prev, id]);
      return;
    }

    try {
      const res = await fetch(`/api/api-keys/${id}/reveal`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Lỗi hiển thị API key.");

      setRevealedKeys(prev => ({ ...prev, [id]: data.data.fullKey }));
      setVisibleKeyIds(prev => [...prev, id]);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Không thể hiển thị API key này.", "error");
    }
  };

  const handleCopy = async (id: string) => {
    let keyToCopy = revealedKeys[id];

    if (!keyToCopy) {
      try {
        const res = await fetch(`/api/api-keys/${id}/reveal`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message ?? "Lỗi lấy API key.");
        keyToCopy = data.data.fullKey;
        setRevealedKeys(prev => ({ ...prev, [id]: keyToCopy }));
      } catch (error) {
        showToast("Không thể copy API key này.", "error");
        return;
      }
    }

    await navigator.clipboard.writeText(keyToCopy);
    showToast("Đã copy API key.", "success");
  };

  const btnPrimary = "rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 px-6 py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2";
  const btnSecondary = "rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 px-5 py-2 text-sm font-bold transition-all flex items-center justify-center gap-2";
  const btnDanger = "rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 px-5 py-2 text-sm font-bold transition-all flex items-center justify-center gap-2";

  return (
    <div className="space-y-10 pb-20">
      <DashboardSubNav 
        items={[
          { label: "API Keys", href: "/api-keys" },
          { label: "Tài liệu API", href: "/api-docs" },
          { label: "Lịch sử sử dụng", href: "/usage" },
        ]} 
      />
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <AppIcon icon={KeyRound} className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">API Keys</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Tạo và quản lý API key để kết nối ứng dụng với hệ thống credits.
          </p>
        </div>
      </div>

      {/* Create Section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <AppIcon icon={ShieldCheck} className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-black text-slate-900">Tạo API key mới</h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton height={200} borderRadius="1.5rem" />
          </div>
        ) : activePlans.length === 0 ? (
          <div className="rounded-[32px] bg-slate-50/50 p-6 sm:p-10 text-center ring-1 ring-slate-100">
            <p className="text-slate-600 font-bold">Bạn cần mua gói credits trước khi tạo API key.</p>
            <div className="mt-6 flex justify-center">
              <Link href="/plans" className={btnPrimary}>
                <Plus className="h-4 w-4" />
                Mua credits
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tên API key</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Ví dụ: Extension Chrome, Cursor IDE..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Chọn gói credits</label>
                <select
                  value={selectedCreditBucketId}
                  onChange={(e) => setSelectedCreditBucketId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
                >
                  <option value="">Chọn gói credits đang dùng</option>
                  {activePlans.map((plan) => (
                    <option key={plan.id} value={plan.id} disabled={plan.activeApiKeys >= plan.apiKeyLimit}>
                      {plan.product?.name ?? getFamilyLabel(plan.apiFamily)} ({plan.activeApiKeys}/{plan.apiKeyLimit} keys)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedBucket && (
              <div className="flex flex-wrap gap-4 sm:gap-6 rounded-2xl bg-emerald-50/50 p-5 ring-1 ring-emerald-100/50">
                <div className="flex items-center gap-2">
                  <AppIcon icon={Zap} className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/60">Dòng:</span>
                  <span className="text-sm font-black text-emerald-900">{getFamilyLabel(selectedBucket.apiFamily)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AppIcon icon={CheckCircle2} className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/60">Credits:</span>
                  <span className="text-sm font-black text-emerald-600">{formatCredits(selectedBucket.creditsRemaining)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AppIcon icon={KeyRound} className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/60">Sức chứa:</span>
                  <span className="text-sm font-black text-emerald-900">{selectedBucket.activeApiKeys}/{selectedBucket.apiKeyLimit} keys</span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating || !selectedCreditBucketId || !keyName.trim()}
                className={btnPrimary + " w-full sm:w-auto"}
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang tạo...
                  </span>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Tạo API key
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* List Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppIcon icon={KeyRound} className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900">Danh sách API keys</h2>
          </div>
          <button onClick={loadData} className={btnSecondary + " h-9 px-3 sm:h-10 sm:px-5"} title="Làm mới">
            <AppIcon icon={Info} className="h-4 w-4" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>

        {isLoading ? (
          <CardListSkeleton count={3} />
        ) : apiKeys.length === 0 ? (
          <div className="rounded-[40px] border border-dashed border-slate-300 bg-slate-50/50 p-10 sm:p-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 mb-6">
              <AppIcon icon={KeyRound} className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Bạn chưa có API key nào.</h3>
            <p className="mt-2 text-slate-500 font-medium">Sử dụng form bên trên để tạo key đầu tiên và bắt đầu kết nối.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {apiKeys.map((apiKey) => {
              const isVisible = visibleKeyIds.includes(apiKey.id);
              const revealedValue = revealedKeys[apiKey.id];

              return (
                <article
                  key={apiKey.id}
                  className="group relative flex flex-col rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
                >
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-black text-slate-900 truncate">{apiKey.name}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 ring-1 ring-slate-200">
                        {getFamilyLabel(apiKey.apiFamily)}
                      </span>
                      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        apiKey.isActive 
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" 
                          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                      }`}>
                        <AppIcon icon={apiKey.isActive ? CheckCircle2 : AlertCircle} className="h-3.5 w-3.5" />
                        {apiKey.isActive ? "Active" : "Revoked"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 sm:px-5 sm:py-3.5 ring-1 ring-slate-100 max-w-full overflow-x-auto">
                      <code className="font-mono text-sm font-black text-slate-700 tracking-tight whitespace-nowrap">
                        {isVisible ? (revealedValue ?? apiKey.keyPrefix) : apiKey.maskedKey ?? apiKey.keyPrefix}
                      </code>
                    </div>

                    <div className="flex flex-wrap gap-x-10 gap-y-3">
                      <div className="min-w-[140px]">
                        <p className="text-[13px] font-semibold text-slate-500">Gói:</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {apiKey.creditBucket?.product?.name ?? "Gói đã xóa"}
                        </p>
                      </div>

                      <div className="min-w-[140px]">
                        <p className="text-[13px] font-semibold text-slate-500">Tạo lúc:</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {new Date(apiKey.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>

                      <div className="min-w-[180px]">
                        <p className="text-[13px] font-semibold text-slate-500">Dùng gần nhất:</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 line-clamp-1">
                          {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleString("vi-VN") : "Chưa dùng"}
                        </p>
                      </div>
                    </div>
                  </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-50 pt-5 lg:mt-0 lg:border-none lg:pt-0">
                      {apiKey.isActive && (
                        <>
                          <button type="button" onClick={() => handleReveal(apiKey.id)} className={btnSecondary + " flex-1 sm:flex-none h-11"} title={isVisible ? "Ẩn" : "Hiện"}>
                            <AppIcon icon={isVisible ? EyeOff : Eye} className="h-4 w-4" />
                            {isVisible ? "Ẩn" : "Hiện"}
                          </button>
                          <button type="button" onClick={() => handleCopy(apiKey.id)} className={btnSecondary + " flex-1 sm:flex-none h-11"} title="Copy">
                            <AppIcon icon={Copy} className="h-4 w-4" />
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => askConfirm({
                              title: "Thu hồi API key?",
                              description: "API key này sẽ không thể sử dụng sau khi thu hồi. Hành động này không thể hoàn tác.",
                              confirmLabel: "Thu hồi ngay",
                              cancelLabel: "Hủy",
                              type: "danger",
                              onConfirm: () => handleRevoke(apiKey.id),
                            })}
                            className={btnDanger + " flex-1 sm:flex-none h-11"}
                            title="Thu hồi"
                          >
                            <AppIcon icon={Trash2} className="h-4 w-4" />
                            <span className="sm:inline hidden">Thu hồi</span>
                            <span className="sm:hidden inline">Xóa</span>
                          </button>
                        </>
                      )}
                    </div>
                  </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Toast & Confirm */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      {confirmState && (
        <ConfirmToast
          open={!!confirmState}
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel}
          cancelLabel={confirmState.cancelLabel}
          type={confirmState.type}
          isLoading={isConfirming}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
}
