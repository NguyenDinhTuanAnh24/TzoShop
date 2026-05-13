"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Clock3,
  KeyRound,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ApiPlan = {
  id: string;
  name: string;
  slug: string;
  apiFamily: "CODEXAI" | "CLAUDE" | "GEMINI" | "DEEPSEEK";
  tier: "Trial" | "Mini" | "Plus" | "Pro" | "Max" | "Ultra" | "Enterprise";
  credits: string;
  durationDays: number | null;
  priceVnd: number;
  apiKeyLimit: number;
  allowedModels: string[];
  allowedReasoning: string[];
  isPopular: boolean;
  isActive: boolean;
  isContactOnly?: boolean;
};

type UserCoupon = {
  id: string;
  code: string;
  name: string;
  discountPercent: number;
  minOrderAmount: number;
};

function getFamilyLabel(apiFamily: ApiPlan["apiFamily"]) {
  const familyMap: Record<ApiPlan["apiFamily"], string> = {
    CODEXAI: "CodexAI",
    CLAUDE: "Claude",
    GEMINI: "Gemini",
    DEEPSEEK: "DeepSeek",
  };
  return familyMap[apiFamily];
}

function formatCreditAmount(value: string) {
  const amount = Number(value);
  if (amount >= 1_000_000_000) return `${amount / 1_000_000_000}B`;
  if (amount >= 1_000_000) return `${amount / 1_000_000}M`;
  if (amount >= 1_000) return `${amount / 1_000}K`;
  return amount.toLocaleString("vi-VN");
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function isContactPlan(plan: ApiPlan) {
  const name = plan.name.toLowerCase();
  const tier = plan.tier.toLowerCase();
  return (
    plan.isContactOnly === true ||
    plan.priceVnd === null ||
    plan.priceVnd === 0 ||
    name.includes("enterprise") ||
    name.includes("custom") ||
    name.includes("liên hệ") ||
    tier.includes("enterprise") ||
    tier.includes("custom")
  );
}

function hasRealPrice(plan: ApiPlan) {
  return !isContactPlan(plan) && typeof plan.priceVnd === "number" && plan.priceVnd > 0;
}

function getPlanAudienceText(plan: ApiPlan) {
  const tier = plan.tier.toLowerCase();
  if (tier.includes("enterprise")) return "Dành cho nhu cầu lớn hoặc đội nhóm.";
  if (plan.apiFamily === "CODEXAI") return "Phù hợp lập trình, IDE và extension.";
  if (plan.apiFamily === "CLAUDE") return "Phù hợp viết nội dung, phân tích và xử lý văn bản.";
  if (plan.apiFamily === "GEMINI") return "Phù hợp đa nhiệm, tốc độ tốt và chi phí cân bằng.";
  if (plan.apiFamily === "DEEPSEEK") return "Phù hợp tối ưu chi phí khi dùng thường xuyên.";
  return "Phù hợp nhiều nhu cầu sử dụng khác nhau.";
}

function getDurationLabel(plan: ApiPlan) {
  if (plan.durationDays && plan.durationDays > 0) return `${plan.durationDays} ngày`;
  return "Dùng đến khi hết credits";
}

const familyTabs = ["CodexAI", "Claude", "Gemini", "DeepSeek"];
const tierTabs = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Trial", value: "Trial" },
  { label: "Mini", value: "Mini" },
  { label: "Plus", value: "Plus" },
  { label: "Pro", value: "Pro" },
  { label: "Max", value: "Max" },
  { label: "Ultra", value: "Ultra" },
  { label: "Enterprise", value: "Enterprise" },
];
const durationTabs = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Gói chính", value: "Gói chính" },
  { label: "Gói dài hạn", value: "Gói dài hạn" },
];
const sortOptions = [
  { label: "Đề xuất", value: "recommended" },
  { label: "Giá thấp", value: "price-asc" },
  { label: "Giá cao", value: "price-desc" },
  { label: "Credits", value: "credits-desc" },
  { label: "Thời hạn", value: "duration-desc" },
  { label: "Gói liên hệ", value: "contact" },
];

const DEFAULT_VISIBLE_MODELS = 4;
const DEFAULT_VISIBLE_PLANS = 6;

const brutalBtn =
  "inline-flex items-center justify-center border-4 border-black text-black font-black uppercase shadow-[5px_5px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "border-2 border-black px-3 py-2 text-xs transition-all duration-100",
        active
          ? "bg-[#FFD93D] font-black shadow-[2px_2px_0px_0px_#000]"
          : "bg-white font-bold hover:-translate-y-0.5 hover:bg-[#FFD93D]"
      )}
    >
      {children}
    </button>
  );
}

function PlansPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14" />
              <Skeleton className="h-5 w-36" />
            </div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-full max-w-[460px]" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-4 border-black bg-white p-5 shadow-[5px_5px_0px_0px_#000]">
              <Skeleton className="h-2 w-14" />
              <Skeleton className="mt-5 h-6 w-24" />
              <Skeleton className="mt-2 h-4 w-20" />
            </div>
          ))}
        </div>
      </section>

      <section className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-7 w-28" />
              {[...Array(5)].map((__, j) => (
                <Skeleton key={j} className="h-9 w-20" />
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex min-h-[360px] flex-col border-4 border-black bg-[#FFFDF5] p-5 shadow-[7px_7px_0px_0px_#000] md:p-6">
              <Skeleton className="h-6 w-40" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-5 h-20 w-full border-4 border-black" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
              <Skeleton className="mt-4 h-14 w-full border-2 border-black" />
              <Skeleton className="mt-auto h-8 w-28" />
              <Skeleton className="mt-4 h-12 w-full" />
            </div>
          ))}
        </div>
        <aside className="space-y-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function PlansPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [plansError, setPlansError] = useState("");
  const { toast, showToast, clearToast } = useToast(3000);

  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState("Tất cả");
  const [selectedPlanType, setSelectedPlanType] = useState("Tất cả");
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<ApiPlan | null>(null);
  const [isConfirmBuyOpen, setIsConfirmBuyOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [expandedModelPlans, setExpandedModelPlans] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasHandledProductQuery, setHasHandledProductQuery] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponData, setCouponData] = useState<{
    valid: boolean;
    discountAmount: number;
    finalAmount: number;
    message?: string;
    code?: string;
  } | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [myCoupons, setMyCoupons] = useState<UserCoupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  const loadPlans = useCallback(async () => {
    try {
      setIsLoadingPlans(true);
      setPlansError("");
      const response = await fetch("/api/plans", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? "Lỗi tải gói credits.");
      setPlans(data.data ?? []);
    } catch {
      setPlansError("Không thể tải danh sách gói credits.");
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPlans();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadPlans]);

  useEffect(() => {
    if (hasHandledProductQuery || isLoadingPlans || plans.length === 0) return;
    const productIdFromPricing = searchParams.get("product");
    if (!productIdFromPricing) return;
    const targetPlan = plans.find((p) => p.id === productIdFromPricing);
    if (!targetPlan) return;
    const timer = window.setTimeout(() => {
      setSelectedFamily(getFamilyLabel(targetPlan.apiFamily));
      setSelectedPlanToBuy(targetPlan);
      setIsConfirmBuyOpen(true);
      setHasHandledProductQuery(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hasHandledProductQuery, isLoadingPlans, plans, searchParams]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const familyLabel = getFamilyLabel(plan.apiFamily);
      const isLongTerm = plan.slug.match(/-(3m|6m|year|enterprise)$/);
      const matchesFamily = selectedFamily === null || familyLabel === selectedFamily;
      const matchesTier = selectedTier === "Tất cả" || plan.tier === selectedTier;
      const matchesPlanType =
        selectedPlanType === "Tất cả" ||
        (selectedPlanType === "Gói chính" && !isLongTerm) ||
        (selectedPlanType === "Gói dài hạn" && isLongTerm);
      return matchesFamily && matchesTier && matchesPlanType;
    });
  }, [plans, selectedFamily, selectedTier, selectedPlanType]);

  const sortedPlans = useMemo(() => {
    let plansCopy = [...filteredPlans];
    if (sortBy === "price-asc" || sortBy === "price-desc") plansCopy = plansCopy.filter(hasRealPrice);
    if (sortBy === "contact") plansCopy = plansCopy.filter(isContactPlan);
    switch (sortBy) {
      case "price-asc":
        return plansCopy.sort((a, b) => a.priceVnd - b.priceVnd);
      case "price-desc":
        return plansCopy.sort((a, b) => b.priceVnd - a.priceVnd);
      case "credits-desc":
        return plansCopy.sort((a, b) => Number(b.credits) - Number(a.credits));
      case "duration-desc":
        return plansCopy.sort((a, b) => (b.durationDays ?? 0) - (a.durationDays ?? 0));
      default:
        return plansCopy.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
  }, [filteredPlans, sortBy]);

  const displayedPlans = useMemo(
    () => (isExpanded ? sortedPlans : sortedPlans.slice(0, DEFAULT_VISIBLE_PLANS)),
    [sortedPlans, isExpanded]
  );
  const featuredPlanId = useMemo(() => {
    const popular = sortedPlans.find((p) => p.isPopular);
    if (popular) return popular.id;
    const fallback = sortedPlans.find((p) => !isContactPlan(p));
    return fallback?.id ?? null;
  }, [sortedPlans]);

  function handleChoosePlan(plan: ApiPlan) {
    if (isContactPlan(plan)) {
      router.push("/support?type=custom-plan");
      return;
    }
    setSelectedPlanToBuy(plan);
    setCouponCode("");
    setCouponData(null);
    setIsConfirmBuyOpen(true);
  }

  const handleValidateCoupon = useCallback(async () => {
    if (!couponCode || !selectedPlanToBuy || isValidatingCoupon) return;
    try {
      setIsValidatingCoupon(true);
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, productId: selectedPlanToBuy.id }),
      });
      const result = await res.json();
      setCouponData({
        valid: !!result.valid,
        discountAmount: result.discountAmount || 0,
        finalAmount: result.finalAmount || 0,
        message: result.message,
        code: result.code,
      });
      if (result.valid) showToast("Áp dụng mã giảm giá thành công!", "success");
      else showToast(result.message || "Mã giảm giá không hợp lệ.", "error");
    } catch {
      showToast("Lỗi kiểm tra mã giảm giá.", "error");
    } finally {
      setIsValidatingCoupon(false);
    }
  }, [couponCode, selectedPlanToBuy, isValidatingCoupon, showToast]);

  async function loadMyCoupons() {
    try {
      setIsLoadingCoupons(true);
      const res = await fetch("/api/coupons/my");
      const result = await res.json();
      if (result.success) setMyCoupons(result.data.available);
    } catch {
      showToast("Không thể tải kho mã.", "error");
    } finally {
      setIsLoadingCoupons(false);
    }
  }

  function handleSelectCoupon(code: string) {
    setCouponCode(code);
    setIsCouponModalOpen(false);
  }

  useEffect(() => {
    if (!couponCode || !isConfirmBuyOpen || couponData) return;
    const timer = window.setTimeout(() => {
      void handleValidateCoupon();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [couponCode, isConfirmBuyOpen, couponData, handleValidateCoupon]);

  async function handleConfirmBuyPlan() {
    if (!selectedPlanToBuy || isCreatingOrder) return;
    try {
      setIsCreatingOrder(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedPlanToBuy.id,
          couponCode: couponData?.valid ? couponData.code : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message ?? "Cannot create order");
      if (result.data?.freeOrder) {
        showToast("Mua gói thành công! Gói đã được kích hoạt.", "success");
        setIsConfirmBuyOpen(false);
        setSelectedPlanToBuy(null);
        if (result.data.creditBucketId) router.push(`/api-keys?bucketId=${result.data.creditBucketId}`);
        else router.push("/my-plans");
        return;
      }
      showToast("Đơn hàng đã được tạo.", "success");
      setIsConfirmBuyOpen(false);
      setSelectedPlanToBuy(null);
      router.push("/billing");
    } catch (error) {
      console.error(error);
      showToast("Không thể tạo đơn hàng.", "error");
    } finally {
      setIsCreatingOrder(false);
    }
  }

  return (
    <div className="space-y-8 overflow-x-hidden px-5 py-6 md:px-6 lg:px-8 lg:py-8" aria-busy={isLoadingPlans}>
      <section className="relative overflow-visible border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="pointer-events-none absolute -right-3 -top-3 h-10 w-10 border-4 border-black bg-[#A78BFA]" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[5px_5px_0px_0px_#000]">
                <ShoppingCart className="h-7 w-7 text-black" />
              </div>
              <span className="border-2 border-black bg-[#C7F0D8] px-3 py-1 text-xs font-black uppercase tracking-wide text-black">CỬA HÀNG CREDITS</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-black md:text-4xl">Tất cả gói credits</h1>
            <p className="text-sm font-bold text-black/70 md:text-base">Chọn dòng AI và gói credits phù hợp với nhu cầu sử dụng của bạn.</p>
          </div>
          <Link href="/my-plans" className={`${brutalBtn} h-11 bg-white px-5 hover:bg-[#FFD93D]`}>XEM GÓI CỦA TÔI</Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {familyTabs.map((family) => {
            const isActive = selectedFamily === family;
            return (
              <button
                key={family}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setSelectedFamily(isActive ? null : family);
                  setIsExpanded(false);
                }}
                className={cn(
                  "relative min-h-[120px] overflow-visible border-4 border-black bg-white p-5 text-left shadow-[5px_5px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_#000]",
                  isActive && "bg-[#FFD93D]"
                )}
              >
                <span className="mb-2 inline-flex border-2 border-black bg-[#FFD93D] px-2 py-1 text-[10px] font-black uppercase text-black">AI FAMILY</span>
                <div
                  className={cn(
                    "h-2 w-14 border-2 border-black",
                    family === "CodexAI" && "bg-[#C7F0D8]",
                    family === "Claude" && "bg-[#F59E0B]",
                    family === "Gemini" && "bg-[#A78BFA]",
                    family === "DeepSeek" && "bg-[#2563EB]"
                  )}
                />
                <p className="mt-5 text-xl font-black text-black">{family}</p>
                <p className="mt-1 text-sm font-bold text-black/70">Khám phá</p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="rounded-[10px] border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black">
                  <span className="flex h-7 w-7 items-center justify-center border-2 border-black bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]"><Clock3 className="h-3.5 w-3.5" /></span>
                  Hiệu lực
                </span>
                {durationTabs.map((tab) => (
                  <FilterChip key={tab.value} active={selectedPlanType === tab.value} onClick={() => setSelectedPlanType(tab.value)}>
                    {tab.label}
                  </FilterChip>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black">
                  <span className="flex h-7 w-7 items-center justify-center border-2 border-black bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]"><Zap className="h-3.5 w-3.5" /></span>
                  Cấp độ
                </span>
                {tierTabs.map((tab) => (
                  <FilterChip key={tab.value} active={selectedTier === tab.value} onClick={() => setSelectedTier(tab.value)}>
                    {tab.label}
                  </FilterChip>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black">
                  <span className="flex h-7 w-7 items-center justify-center border-2 border-black bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]"><ArrowUpDown className="h-3.5 w-3.5" /></span>
                  Sắp xếp
                </span>
                {sortOptions.map((opt) => (
                  <FilterChip key={opt.value} active={sortBy === opt.value} onClick={() => setSortBy(opt.value)}>
                    {opt.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-4">
            {isLoadingPlans ? (
              <PlansPageSkeleton />
            ) : plansError ? (
              <div className="border-4 border-black bg-[#FF6B6B] p-10 text-center shadow-[8px_8px_0px_0px_#000]">
                <h3 className="text-xl font-black text-black">KHÔNG THỂ TẢI DỮ LIỆU</h3>
                <p className="mt-2 text-sm font-bold text-black/80">{plansError}</p>
                <button onClick={loadPlans} className={`${brutalBtn} mt-6 h-11 bg-white px-6 hover:bg-[#FFD93D]`}>
                  <RefreshCw className="mr-2 h-4 w-4" />THỬ LẠI
                </button>
              </div>
            ) : displayedPlans.length === 0 ? (
              <div className="min-h-[240px] border-4 border-black bg-[#FFFDF5] p-10 text-center shadow-[8px_8px_0px_0px_#000]">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[5px_5px_0px_0px_#000]">
                  <Search className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-black text-black">KHÔNG TÌM THẤY GÓI PHÙ HỢP</h3>
                <p className="mt-2 font-bold text-black/70">Hãy thử đổi bộ lọc hoặc chọn nhóm gói khác.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFamily(null);
                    setSelectedTier("Tất cả");
                    setSelectedPlanType("Tất cả");
                    setSortBy("recommended");
                  }}
                  className={`${brutalBtn} mt-6 h-11 bg-white px-6 hover:bg-[#FFD93D]`}
                >
                  XÓA BỘ LỌC
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {displayedPlans.map((plan) => {
                  const isFeatured = featuredPlanId === plan.id;
                  const isExpandedModel = expandedModelPlans.includes(plan.id);
                  const modelCount = plan.allowedModels.length;
                  return (
                    <article
                      key={plan.id}
                      className={cn(
                        "relative flex min-h-[360px] flex-col overflow-visible border-4 border-black bg-[#FFFDF5] p-5 shadow-[7px_7px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-[9px_9px_0px_0px_#000] md:p-6",
                        isFeatured && "shadow-[9px_9px_0px_0px_#000]"
                      )}
                    >
                      {isFeatured && (
                        <>
                          <span className="absolute -right-3 -top-3 border-2 border-black bg-[#FFD93D] px-2 py-1 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                            NÊN CHỌN
                          </span>
                          <span className="pointer-events-none absolute -bottom-3 -left-3 h-7 w-7 border-4 border-black bg-[#A78BFA]" />
                        </>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "mb-2 h-2 w-14 border-2 border-black",
                              plan.apiFamily === "CODEXAI" && "bg-[#00A878]",
                              plan.apiFamily === "CLAUDE" && "bg-[#F59E0B]",
                              plan.apiFamily === "GEMINI" && "bg-[#38BDF8]",
                              plan.apiFamily === "DEEPSEEK" && "bg-[#2563EB]"
                            )}
                          />
                          <h3 className="text-xl font-black leading-tight text-black md:text-2xl">{plan.name}</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                            {getFamilyLabel(plan.apiFamily)}
                          </span>
                          {plan.isPopular && (
                            <span className="inline-flex border-2 border-black bg-[#FF6B6B] px-2 py-1 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                              HOT
                            </span>
                          )}
                          {isFeatured && (
                            <span className="inline-flex border-2 border-black bg-[#FFD93D] px-2 py-1 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                              ĐỀ XUẤT
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-sm font-bold leading-relaxed text-black/70">{getPlanAudienceText(plan)}</p>

                      <div className="mt-5 border-4 border-black bg-[#C7F0D8] p-4 shadow-[4px_4px_0px_0px_#000]">
                        <p className="text-3xl font-black leading-none text-black">{formatCreditAmount(plan.credits)}</p>
                        <p className="mt-1 text-xs font-black uppercase text-black/70">
                          {plan.tier === "Enterprise" ? "Gói dung lượng lớn" : "Dùng đến khi hết credits"}
                        </p>
                      </div>

                      <div className="mt-4 space-y-2 font-bold text-black">
                        <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
                          <span className="text-xs font-black uppercase text-black/70">API keys</span>
                          <span className="font-black text-black">{plan.apiKeyLimit} keys</span>
                        </div>
                        <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
                          <span className="text-xs font-black uppercase text-black/70">Hiệu lực</span>
                          <span className="font-black text-black">{getDurationLabel(plan)}</span>
                        </div>
                      </div>

                      <div className="mt-4 border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]">
                        <p className="text-xs font-black uppercase text-black/70">Models hỗ trợ</p>
                        <p className="mt-1 text-sm font-black text-black">
                          {modelCount === 0
                            ? "Đang cập nhật models"
                            : modelCount > DEFAULT_VISIBLE_MODELS
                              ? `${DEFAULT_VISIBLE_MODELS} model +${modelCount - DEFAULT_VISIBLE_MODELS}`
                              : `Hỗ trợ ${modelCount} models`}
                        </p>
                        {modelCount > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedModelPlans((prev) =>
                                prev.includes(plan.id) ? prev.filter((id) => id !== plan.id) : [...prev, plan.id]
                              )
                            }
                            className="mt-2 inline-flex items-center border-2 border-black bg-[#FFD93D] px-2 py-1 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]"
                          >
                            <AppIcon icon={isExpandedModel ? ChevronUp : ChevronDown} className="mr-1 h-3 w-3" />
                            {isExpandedModel ? "THU GỌN" : "XEM MODELS"}
                          </button>
                        )}
                        {isExpandedModel && modelCount > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {plan.allowedModels.map((m) => (
                              <span key={m} className="inline-flex break-all border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="mt-auto pt-5 text-3xl font-black text-black">{isContactPlan(plan) ? "Liên hệ" : formatCurrency(plan.priceVnd)}</p>
                      <button
                        onClick={() => handleChoosePlan(plan)}
                        disabled={plan.allowedModels.length === 0 && !isContactPlan(plan)}
                        className={cn(
                          `${brutalBtn} mt-4 h-12 w-full justify-center px-5`,
                          isContactPlan(plan) ? "bg-[#A78BFA]" : "bg-[#FF6B6B]",
                          plan.allowedModels.length === 0 && !isContactPlan(plan) && "cursor-not-allowed opacity-50 grayscale"
                        )}
                      >
                        {isContactPlan(plan) ? "LIÊN HỆ TƯ VẤN" : "CHỌN GÓI"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {!isLoadingPlans && sortedPlans.length > DEFAULT_VISIBLE_PLANS && (
              <div className="flex justify-center pt-6">
                <button onClick={() => setIsExpanded(!isExpanded)} className={`${brutalBtn} h-11 bg-white px-6 hover:bg-[#FFD93D]`}>
                  <AppIcon icon={isExpanded ? ChevronUp : ChevronDown} className="mr-2 h-4 w-4" />
                  {isExpanded ? "THU GỌN DANH SÁCH" : `XEM THÊM ${sortedPlans.length - DEFAULT_VISIBLE_PLANS} GÓI`}
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:h-fit">
          <div className="rounded-[10px] border-4 border-black bg-[#C7F0D8] p-5 shadow-[6px_6px_0px_0px_#000]">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#C7F0D8] shadow-[2px_2px_0px_0px_#000]">
                <Sparkles className="h-5 w-5 text-black" />
              </span>
              <h3 className="text-lg font-black uppercase text-black">GỢI Ý CHỌN NHANH</h3>
            </div>
            <div className="space-y-2 text-xs font-bold leading-relaxed text-black/80">
              <p>• Mới dùng: chọn Trial hoặc Mini.</p>
              <p>• Dùng cá nhân: chọn Plus.</p>
              <p>• Dùng nhiều: chọn Pro hoặc Max.</p>
              <p>• Đội nhóm/doanh nghiệp: chọn Enterprise.</p>
            </div>
          </div>

          <div className="rounded-[10px] border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000]">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]">
                <KeyRound className="h-5 w-5 text-black" />
              </span>
              <h3 className="text-lg font-black text-black">Gói theo cấp</h3>
            </div>
            <div className="space-y-2 text-xs font-bold leading-relaxed text-black/70">
              <p>• <b>Trial:</b> Trải nghiệm tính năng</p>
              <p>• <b>Mini/Plus:</b> Dùng cá nhân</p>
              <p>• <b>Pro/Max:</b> Tần suất cao</p>
              <p>• <b>Enterprise:</b> Quy mô lớn</p>
            </div>
          </div>
        </aside>
      </div>

      {isConfirmBuyOpen && selectedPlanToBuy && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000]">
            <h2 className="text-xl font-black uppercase text-black">XÁC NHẬN MUA GÓI</h2>
            <p className="mt-2 text-sm font-bold text-black/70">
              {couponData?.valid && couponData.finalAmount === 0
                ? "Bạn đang sử dụng mã giảm giá 100%. Gói credits sẽ được kích hoạt ngay lập tức."
                : "Sau khi xác nhận, hệ thống sẽ tạo đơn hàng chờ thanh toán."}
            </p>

            <div className="mt-5 space-y-2 border-4 border-black bg-[#FFFDF5] p-4 text-sm font-bold text-black">
              <p>Gói: <b>{selectedPlanToBuy.name}</b></p>
              <p>Dòng AI: <b>{getFamilyLabel(selectedPlanToBuy.apiFamily)}</b></p>
              <p>Credits: <b>{formatCreditAmount(selectedPlanToBuy.credits)}</b></p>
              <p>Hiệu lực: <b>{selectedPlanToBuy.durationDays && selectedPlanToBuy.durationDays > 0 ? `${selectedPlanToBuy.durationDays} ngày` : "Không giới hạn"}</b></p>
              <p>API key: <b>{selectedPlanToBuy.apiKeyLimit} key</b></p>
              <p>Giá gốc: <b>{formatCurrency(selectedPlanToBuy.priceVnd)}</b></p>
              {couponData?.valid && <p>Giảm giá: <b>-{formatCurrency(couponData.discountAmount)}</b></p>}
              <p className="text-base">Tổng thanh toán: <b>{couponData?.valid ? formatCurrency(couponData.finalAmount) : formatCurrency(selectedPlanToBuy.priceVnd)}</b></p>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-[11px] font-black uppercase text-black/70">Mã giảm giá (nếu có)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã ưu đãi..."
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponData(null);
                  }}
                  className="h-11 w-full border-4 border-black bg-white px-3 text-sm font-bold text-black outline-none focus:bg-[#FFD93D]/25"
                />
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  disabled={!couponCode || isValidatingCoupon}
                  className={`${brutalBtn} h-11 bg-[#FFD93D] px-4 text-xs disabled:opacity-50`}
                >
                  {isValidatingCoupon ? "..." : "ÁP DỤNG"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCouponModalOpen(true);
                  loadMyCoupons();
                }}
                className="text-xs font-black uppercase text-black underline"
              >
                Chọn từ kho mã giảm giá của tôi
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isCreatingOrder}
                onClick={() => {
                  setIsConfirmBuyOpen(false);
                  setSelectedPlanToBuy(null);
                }}
                className={`${brutalBtn} h-11 bg-white px-6 hover:bg-[#FFD93D]`}
              >
                HỦY
              </button>
              <button type="button" onClick={handleConfirmBuyPlan} disabled={isCreatingOrder} className={`${brutalBtn} h-11 bg-[#FF6B6B] px-6 disabled:opacity-50`}>
                {isCreatingOrder ? "ĐANG XỬ LÝ..." : "XÁC NHẬN MUA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase text-black">MÃ GIẢM GIÁ CỦA TÔI</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-black"><XCircle className="h-5 w-5" /></button>
            </div>

            <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
              {isLoadingCoupons ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : myCoupons.length === 0 ? (
                <p className="py-10 text-center text-sm font-bold text-black/70">Bạn chưa có mã giảm giá nào.</p>
              ) : (
                myCoupons.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCoupon(c.code)}
                    className="w-full border-4 border-black bg-[#FFFDF5] p-4 text-left shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-black">{c.name}</p>
                        <p className="text-xs font-black uppercase text-black/70">{c.code}</p>
                      </div>
                      <p className="text-lg font-black text-black">-{c.discountPercent}%</p>
                    </div>
                    <p className="mt-2 text-[10px] font-bold uppercase text-black/70">Đơn từ {formatCurrency(c.minOrderAmount)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={<PlansPageSkeleton />}>
      <PlansPageContent />
    </Suspense>
  );
}
