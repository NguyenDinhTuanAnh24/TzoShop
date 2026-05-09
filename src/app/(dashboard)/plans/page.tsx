"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getApiKeyLimitForPlan } from "@/lib/mock-storage";
import {
  getModelsForPlanTier,
  type ModelFamily,
  type PlanTier,
} from "@/lib/model-registry";
import { buttonStyles } from "@/lib/ui-styles";

type PlanCategory = "main" | "long";

type PlanItem = {
  name: string;
  credits: string;
  duration: string;
  price: string;
  category: PlanCategory;
  family: ModelFamily;
  tier: PlanTier;
  popular?: boolean;
  models?: string[];
  apiKeyLimit?: number;
};

type ProductGroup = {
  family: ModelFamily;
  description: string;
  accent: string;
  plans: PlanItem[];
};

const productGroups: ProductGroup[] = [
  {
    family: "CodexAI",
    description:
      "Phù hợp cho lập trình, xử lý code, dùng cùng extension và công cụ hỗ trợ công việc.",
    accent: "from-emerald-900 to-emerald-500",
    plans: [
      {
        name: "CodexAI Trial",
        credits: "100K",
        duration: "7 ngày",
        price: "19.000đ",
        category: "main",
        family: "CodexAI",
        tier: "Trial",
        models: getModelsForPlanTier("CodexAI", "Trial"),
      },
      {
        name: "CodexAI Mini",
        credits: "250K",
        duration: "30 ngày",
        price: "39.000đ",
        category: "main",
        family: "CodexAI",
        tier: "Mini",
        models: getModelsForPlanTier("CodexAI", "Mini"),
      },
      {
        name: "CodexAI Plus",
        credits: "1M",
        duration: "45 ngày",
        price: "139.000đ",
        category: "main",
        family: "CodexAI",
        tier: "Plus",
        popular: true,
        models: getModelsForPlanTier("CodexAI", "Plus"),
      },
      {
        name: "CodexAI Pro",
        credits: "2M",
        duration: "60 ngày",
        price: "249.000đ",
        category: "main",
        family: "CodexAI",
        tier: "Pro",
        models: getModelsForPlanTier("CodexAI", "Pro"),
      },
      {
        name: "CodexAI Max",
        credits: "5M",
        duration: "90 ngày",
        price: "699.000đ",
        category: "main",
        family: "CodexAI",
        tier: "Max",
        models: getModelsForPlanTier("CodexAI", "Max"),
      },
      {
        name: "CodexAI Ultra",
        credits: "15M",
        duration: "180 ngày",
        price: "2.199.000đ",
        category: "main",
        family: "CodexAI",
        tier: "Ultra",
        models: getModelsForPlanTier("CodexAI", "Ultra"),
      },
      {
        name: "CodexAI Pro 3M",
        credits: "6M",
        duration: "90 ngày",
        price: "710.000đ",
        category: "long",
        family: "CodexAI",
        tier: "Pro",
        models: getModelsForPlanTier("CodexAI", "Pro"),
      },
      {
        name: "CodexAI Pro 6M",
        credits: "12M",
        duration: "180 ngày",
        price: "1.345.000đ",
        category: "long",
        family: "CodexAI",
        tier: "Pro",
        models: getModelsForPlanTier("CodexAI", "Pro"),
      },
      {
        name: "CodexAI Pro Year",
        credits: "24M",
        duration: "365 ngày",
        price: "2.540.000đ",
        category: "long",
        family: "CodexAI",
        tier: "Pro",
        models: getModelsForPlanTier("CodexAI", "Pro"),
      },
      {
        name: "CodexAI Max Year",
        credits: "60M",
        duration: "365 ngày",
        price: "7.130.000đ",
        category: "long",
        family: "CodexAI",
        tier: "Max",
        models: getModelsForPlanTier("CodexAI", "Max"),
      },
      {
        name: "CodexAI Enterprise",
        credits: "300M+",
        duration: "Tùy chỉnh",
        price: "Liên hệ",
        category: "long",
        family: "CodexAI",
        tier: "Enterprise",
        models: getModelsForPlanTier("CodexAI", "Enterprise"),
      },
    ],
  },
  {
    family: "Claude",
    description:
      "Phù hợp cho viết nội dung dài, phân tích tài liệu, học tập và xử lý công việc chuyên sâu.",
    accent: "from-orange-800 to-amber-400",
    plans: [
      {
        name: "Claude Trial",
        credits: "300K",
        duration: "7 ngày",
        price: "19.000đ",
        category: "main",
        family: "Claude",
        tier: "Trial",
        models: getModelsForPlanTier("Claude", "Trial"),
      },
      {
        name: "Claude Mini",
        credits: "1M",
        duration: "30 ngày",
        price: "69.000đ",
        category: "main",
        family: "Claude",
        tier: "Mini",
        models: getModelsForPlanTier("Claude", "Mini"),
      },
      {
        name: "Claude Plus",
        credits: "2.5M",
        duration: "45 ngày",
        price: "149.000đ",
        category: "main",
        family: "Claude",
        tier: "Plus",
        popular: true,
        models: getModelsForPlanTier("Claude", "Plus"),
      },
      {
        name: "Claude Pro",
        credits: "6M",
        duration: "90 ngày",
        price: "399.000đ",
        category: "main",
        family: "Claude",
        tier: "Pro",
        models: getModelsForPlanTier("Claude", "Pro"),
      },
      {
        name: "Claude Ultra",
        credits: "45M",
        duration: "365 ngày",
        price: "3.299.000đ",
        category: "main",
        family: "Claude",
        tier: "Ultra",
        models: getModelsForPlanTier("Claude", "Ultra"),
      },
      {
        name: "Claude Plus Year",
        credits: "30M",
        duration: "365 ngày",
        price: "1.520.000đ",
        category: "long",
        family: "Claude",
        tier: "Plus",
        models: getModelsForPlanTier("Claude", "Plus"),
      },
      {
        name: "Claude Pro Year",
        credits: "72M",
        duration: "365 ngày",
        price: "4.070.000đ",
        category: "long",
        family: "Claude",
        tier: "Pro",
        models: getModelsForPlanTier("Claude", "Pro"),
      },
      {
        name: "Claude Ultra Year",
        credits: "Tùy chỉnh",
        duration: "365 ngày",
        price: "Liên hệ",
        category: "long",
        family: "Claude",
        tier: "Ultra",
        models: getModelsForPlanTier("Claude", "Ultra"),
      },
    ],
  },
  {
    family: "Gemini",
    description:
      "Phù hợp cho nhu cầu đa dụng, xử lý nhanh, chi phí tốt và dùng hằng ngày.",
    accent: "from-blue-800 to-cyan-400",
    plans: [
      {
        name: "Gemini Trial",
        credits: "500K",
        duration: "7 ngày",
        price: "9.000đ",
        category: "main",
        family: "Gemini",
        tier: "Trial",
        models: getModelsForPlanTier("Gemini", "Trial"),
      },
      {
        name: "Gemini Mini",
        credits: "1M",
        duration: "30 ngày",
        price: "29.000đ",
        category: "main",
        family: "Gemini",
        tier: "Mini",
        models: getModelsForPlanTier("Gemini", "Mini"),
      },
      {
        name: "Gemini Plus",
        credits: "5M",
        duration: "60 ngày",
        price: "99.000đ",
        category: "main",
        family: "Gemini",
        tier: "Plus",
        popular: true,
        models: getModelsForPlanTier("Gemini", "Plus"),
      },
      {
        name: "Gemini Pro",
        credits: "10M",
        duration: "90 ngày",
        price: "179.000đ",
        category: "main",
        family: "Gemini",
        tier: "Pro",
        models: getModelsForPlanTier("Gemini", "Pro"),
      },
      {
        name: "Gemini Ultra",
        credits: "100M",
        duration: "365 ngày",
        price: "1.499.000đ",
        category: "main",
        family: "Gemini",
        tier: "Ultra",
        models: getModelsForPlanTier("Gemini", "Ultra"),
      },
      {
        name: "Gemini Plus Year",
        credits: "60M",
        duration: "365 ngày",
        price: "1.010.000đ",
        category: "long",
        family: "Gemini",
        tier: "Plus",
        models: getModelsForPlanTier("Gemini", "Plus"),
      },
      {
        name: "Gemini Pro Year",
        credits: "120M",
        duration: "365 ngày",
        price: "2.099.000đ",
        category: "long",
        family: "Gemini",
        tier: "Pro",
        models: getModelsForPlanTier("Gemini", "Pro"),
      },
      {
        name: "Gemini Ultra Year",
        credits: "250M",
        duration: "365 ngày",
        price: "3.499.000đ",
        category: "long",
        family: "Gemini",
        tier: "Ultra",
        models: getModelsForPlanTier("Gemini", "Ultra"),
      },
    ],
  },
  {
    family: "DeepSeek",
    description:
      "Phù hợp cho nhu cầu tiết kiệm, xử lý nhanh và dùng thường xuyên với chi phí thấp.",
    accent: "from-slate-900 to-blue-500",
    plans: [
      {
        name: "DeepSeek Trial",
        credits: "1M",
        duration: "7 ngày",
        price: "19.000đ",
        category: "main",
        family: "DeepSeek",
        tier: "Trial",
        models: getModelsForPlanTier("DeepSeek", "Trial"),
      },
      {
        name: "DeepSeek Mini",
        credits: "5M",
        duration: "30 ngày",
        price: "79.000đ",
        category: "main",
        family: "DeepSeek",
        tier: "Mini",
        models: getModelsForPlanTier("DeepSeek", "Mini"),
      },
      {
        name: "DeepSeek Plus",
        credits: "10M",
        duration: "60 ngày",
        price: "139.000đ",
        category: "main",
        family: "DeepSeek",
        tier: "Plus",
        popular: true,
        models: getModelsForPlanTier("DeepSeek", "Plus"),
      },
      {
        name: "DeepSeek Pro",
        credits: "30M",
        duration: "90 ngày",
        price: "399.000đ",
        category: "main",
        family: "DeepSeek",
        tier: "Pro",
        models: getModelsForPlanTier("DeepSeek", "Pro"),
      },
      {
        name: "DeepSeek Ultra",
        credits: "300M",
        duration: "365 ngày",
        price: "3.699.000đ",
        category: "main",
        family: "DeepSeek",
        tier: "Ultra",
        models: getModelsForPlanTier("DeepSeek", "Ultra"),
      },
      {
        name: "DeepSeek Plus Year",
        credits: "120M",
        duration: "365 ngày",
        price: "1.418.000đ",
        category: "long",
        family: "DeepSeek",
        tier: "Plus",
        models: getModelsForPlanTier("DeepSeek", "Plus"),
      },
      {
        name: "DeepSeek Pro Year",
        credits: "180M",
        duration: "365 ngày",
        price: "2.035.000đ",
        category: "long",
        family: "DeepSeek",
        tier: "Pro",
        models: getModelsForPlanTier("DeepSeek", "Pro"),
      },
      {
        name: "DeepSeek Ultra Year",
        credits: "600M",
        duration: "365 ngày",
        price: "7.028.000đ",
        category: "long",
        family: "DeepSeek",
        tier: "Ultra",
        models: getModelsForPlanTier("DeepSeek", "Ultra"),
      },
    ],
  },
];

const familyTabs = ["CodexAI", "Claude", "Gemini", "DeepSeek"];

const categoryTabs: {
  label: string;
  value: PlanCategory;
}[] = [
  { label: "Gói chính", value: "main" },
  { label: "Gói dài hạn", value: "long" },
];

const tierTabs: {
  label: string;
  value: "all" | PlanTier;
}[] = [
  { label: "Tất cả", value: "all" },
  { label: "Trial", value: "Trial" },
  { label: "Mini", value: "Mini" },
  { label: "Plus", value: "Plus" },
  { label: "Pro", value: "Pro" },
  { label: "Max", value: "Max" },
  { label: "Ultra", value: "Ultra" },
  { label: "Enterprise", value: "Enterprise" },
];

function PlanCard({
  plan,
  onSelect,
}: {
  plan: PlanItem;
  onSelect: (plan: PlanItem) => void;
}) {
  const isContact = plan.price === "Liên hệ";

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
        plan.popular
          ? "border-[#0d8f73] bg-[#f4fffb]"
          : "border-black/10 bg-white"
      }`}
    >
      {plan.popular && (
        <span className="absolute right-5 top-5 rounded-full bg-[#0d8f73] px-3 py-1 text-xs font-bold text-white">
          Phổ biến
        </span>
      )}

      <div className="flex-1">
        <p className="pr-20 text-lg font-bold text-[#0b0f0d]">{plan.name}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl bg-[#f6f8f7] p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
              Giá gói
            </p>
            <p className="mt-1 text-lg font-bold text-[#0b0f0d]">
              {plan.price}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f6f8f7] p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
              Credits
            </p>
            <p className="mt-1 text-lg font-bold text-[#0b0f0d]">
              {plan.credits}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f6f8f7] p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
              Thời hạn
            </p>
            <p className="mt-1 text-lg font-bold text-[#0b0f0d]">
              {plan.duration}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f6f8f7] p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
              API keys
            </p>
            <p className="mt-1 text-lg font-bold text-[#0b0f0d]">
              {plan.apiKeyLimit && plan.apiKeyLimit >= 50
                ? "Tối đa 50 key"
                : `Tối đa ${plan.apiKeyLimit} key`}
            </p>
          </div>
        </div>

        {plan.models && plan.models.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-bold text-[#0b0f0d]">Model hỗ trợ</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {plan.models.slice(0, 4).map((model) => (
                <span
                  key={model}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {model}
                </span>
              ))}

              {plan.models.length > 4 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  +{plan.models.length - 4} model
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className={`mt-6 flex h-11 w-full items-center justify-center transition ${
          isContact ? buttonStyles.secondary : buttonStyles.primary
        }`}
      >
        {isContact ? "Liên hệ tư vấn" : "Chọn gói này"}
      </button>
    </div>
  );
}

export default function PlansPage() {
  const [selectedFamily, setSelectedFamily] = useState("CodexAI");
  const [selectedCategory, setSelectedCategory] =
    useState<PlanCategory>("main");
  const [selectedTier, setSelectedTier] = useState<"all" | PlanTier>("all");
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);

  const selectedGroup = productGroups.find(
    (group) => group.family === selectedFamily
  )!;

  const filteredPlans = useMemo(() => {
    return selectedGroup.plans
      .filter((plan) => {
        const matchCategory = plan.category === selectedCategory;
        const matchTier = selectedTier === "all" || plan.tier === selectedTier;

        return matchCategory && matchTier;
      })
      .map((plan) => ({
        ...plan,
        apiKeyLimit: getApiKeyLimitForPlan(plan.name),
      }));
  }, [selectedGroup, selectedCategory, selectedTier]);

  const recommendedPlan = useMemo(() => {
    const raw =
      selectedGroup.plans.find((plan) => plan.popular) ?? selectedGroup.plans[0];
    return {
      ...raw,
      apiKeyLimit: getApiKeyLimitForPlan(raw.name),
    };
  }, [selectedGroup]);

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#08745e]">
              Cửa hàng credits
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0b0f0d]">
              Chọn gói credits phù hợp
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6b66]">
              Chọn dòng AI, loại gói và cấp độ dịch vụ. Trang này là khu vực
              mua credits chính trong tài khoản của bạn.
            </p>
          </div>

          <Link
            href="/my-plans"
            className={`inline-flex items-center justify-center ${buttonStyles.secondary}`}
          >
            Xem gói của tôi
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {productGroups.map((group) => {
            const isActive = selectedFamily === group.family;

            return (
              <button
                key={group.family}
                type="button"
                onClick={() => {
                  setSelectedFamily(group.family);
                  setSelectedTier("all");
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-[#0d8f73] bg-[#f4fffb] shadow-sm"
                    : "border-black/10 bg-white hover:bg-[#f8fbfa]"
                }`}
              >
                <div
                  className={`h-2 w-16 rounded-full bg-gradient-to-r ${group.accent}`}
                />

                <p className="mt-3 text-base font-bold text-[#0b0f0d]">
                  {group.family}
                </p>

                <p className="mt-1 text-sm text-[#5f6b66]">
                  {group.plans.length} gói khả dụng
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#08745e]">
                Đang xem
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[#0b0f0d]">
                {selectedGroup.family}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f6b66]">
                {selectedGroup.description}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f6f8f7] px-4 py-3">
              <p className="text-sm text-[#5f6b66]">Gói đang hiển thị</p>
              <p className="mt-1 text-2xl font-bold text-[#0b0f0d]">
                {filteredPlans.length}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(tab.value);
                    setSelectedTier("all");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-[#0d8f73] text-white"
                      : "bg-[#f3f5f4] text-[#5f6b66] hover:bg-[#e8eeee]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tierTabs.map((tab) => {
              const isActive = selectedTier === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedTier(tab.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#0b0f0d] text-white"
                      : "border border-black/10 bg-white text-[#5f6b66] hover:bg-[#f6f8f7]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} onSelect={setSelectedPlan} />
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <div className="mt-6 rounded-3xl border border-dashed border-black/15 bg-[#f8fbfa] p-8 text-center">
              <p className="text-lg font-bold text-[#0b0f0d]">
                Không có gói phù hợp
              </p>
              <p className="mt-2 text-sm text-[#5f6b66]">
                Hãy đổi bộ lọc hoặc chọn dòng AI khác.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#0d8f73]/30 bg-[#f4fffb] p-5">
            <p className="text-sm font-bold text-[#08745e]">Gợi ý cho bạn</p>

            <h4 className="mt-3 text-xl font-bold text-[#0b0f0d]">
              {recommendedPlan.name}
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#5f6b66]">
              Đây là gói cân bằng nhất trong dòng {selectedGroup.family}, phù
              hợp cho đa số người dùng.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xs font-bold uppercase text-[#7a8782]">
                  Credits
                </p>
                <p className="mt-1 font-bold text-[#0b0f0d]">
                  {recommendedPlan.credits}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3">
                <p className="text-xs font-bold uppercase text-[#7a8782]">
                  Giá
                </p>
                <p className="mt-1 font-bold text-[#0b0f0d]">
                  {recommendedPlan.price}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlan(recommendedPlan)}
              className={`mt-5 flex w-full items-center justify-center transition ${buttonStyles.primary}`}
            >
              Chọn gói đề xuất
            </button>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-base font-bold text-[#0b0f0d]">
              Cách chọn theo cấp gói
            </p>

            <div className="mt-4 space-y-3 text-sm leading-6 text-[#5f6b66]">
              <p>
                <span className="font-bold text-[#0b0f0d]">Trial:</span>{" "}
                dùng thử trong thời gian ngắn.
              </p>
              <p>
                <span className="font-bold text-[#0b0f0d]">Mini:</span>{" "}
                nhu cầu nhẹ, dùng cá nhân.
              </p>
              <p>
                <span className="font-bold text-[#0b0f0d]">Plus:</span>{" "}
                lựa chọn cân bằng nhất.
              </p>
              <p>
                <span className="font-bold text-[#0b0f0d]">Pro / Max:</span>{" "}
                dùng thường xuyên, cần nhiều credits.
              </p>
              <p>
                <span className="font-bold text-[#0b0f0d]">Ultra:</span>{" "}
                nhu cầu lớn hoặc dùng dài hạn.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-[#0b0f0d] p-5 text-white">
            <p className="text-base font-bold">Cần gói riêng?</p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Nếu bạn cần số lượng credits lớn, thời hạn riêng hoặc xuất hóa
              đơn, hãy chọn gói liên hệ.
            </p>
          </div>
        </aside>
      </section>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-[560px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#08745e]">
                  Xác nhận gói
                </p>

                <h3 className="mt-2 text-2xl font-bold text-[#0b0f0d]">
                  {selectedPlan.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#5f6b66]">
                  Kiểm tra lại thông tin gói trước khi tiếp tục thanh toán.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-lg font-bold text-[#0b0f0d] transition hover:bg-[#f6f8f7]"
                aria-label="Đóng modal"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#f6f8f7] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
                  Credits
                </p>
                <p className="mt-2 text-xl font-bold text-[#0b0f0d]">
                  {selectedPlan.credits}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6f8f7] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
                  Thời hạn
                </p>
                <p className="mt-2 text-xl font-bold text-[#0b0f0d]">
                  {selectedPlan.duration}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6f8f7] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
                  Giới hạn key
                </p>
                <p className="mt-2 text-xl font-bold text-[#0b0f0d]">
                  {selectedPlan.apiKeyLimit && selectedPlan.apiKeyLimit >= 50
                    ? "Tối đa 50 key"
                    : `Tối đa ${selectedPlan.apiKeyLimit} key`}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-[#f6f8f7] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
                Giá thanh toán
              </p>
              <p className="mt-2 text-3xl font-extrabold text-[#0b0f0d]">
                {selectedPlan.price}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-black/5 bg-[#f7f8f6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8782]">
                API keys
              </p>
              <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                Gói này cho phép tạo tối đa {selectedPlan.apiKeyLimit} API key.
              </p>
            </div>

            {selectedPlan.models && selectedPlan.models.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-bold text-[#0b0f0d]">
                  Model hỗ trợ trong gói
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedPlan.models &&
                    selectedPlan.models.slice(0, 6).map((model) => (
                      <span
                        key={model}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {model}
                      </span>
                    ))}

                  {selectedPlan.models && selectedPlan.models.length > 6 && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      +{selectedPlan.models.length - 6} model
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-900">
                Lưu ý trước khi thanh toán
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Sau khi thanh toán thành công, credits sẽ được cộng vào tài khoản của
                bạn. Ở bước hiện tại, đây mới là giao diện xác nhận, chưa nối PayOS thật.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className={`flex items-center justify-center transition ${buttonStyles.secondary}`}
              >
                Hủy
              </button>

              {selectedPlan.price === "Liên hệ" ? (
                <Link
                  href="/settings"
                  className={`flex items-center justify-center transition ${buttonStyles.primary}`}
                >
                  Liên hệ tư vấn
                </Link>
              ) : (
                <Link
                  href={`/billing?plan=${encodeURIComponent(
                    selectedPlan.name,
                  )}&credits=${encodeURIComponent(
                    selectedPlan.credits,
                  )}&duration=${encodeURIComponent(
                    selectedPlan.duration,
                  )}&price=${encodeURIComponent(
                    selectedPlan.price,
                  )}&apiKeyLimit=${selectedPlan.apiKeyLimit}`}
                  className={`flex items-center justify-center transition ${buttonStyles.primary}`}
                >
                  Tiếp tục thanh toán
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
