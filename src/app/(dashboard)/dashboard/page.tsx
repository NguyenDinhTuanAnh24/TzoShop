"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getPurchasedPlans,
  getUsageLogs,
  getTotalUsedCredits,
  parseCreditAmount,
  formatCredits,
  type StoredPurchasedPlan,
  type StoredUsageLog,
} from "@/lib/mock-storage";

const stats = [
  {
    label: "Credits còn lại",
    value: "1.250.000",
    desc: "Tổng credits khả dụng trong tài khoản",
  },
  {
    label: "API Keys",
    value: "2",
    desc: "Đang hoạt động",
  },
  {
    label: "Lượt dùng hôm nay",
    value: "128",
    desc: "Cập nhật theo thời gian sử dụng",
  },
];

const quickActions = [
  {
    title: "Tạo API key",
    desc: "Tạo key mới để dùng với extension hoặc công cụ hỗ trợ.",
    href: "/api-keys",
  },
  {
    title: "Mua thêm credits",
    desc: "Chọn thêm gói phù hợp khi credits sắp hết.",
    href: "/plans",
  },
  {
    title: "Xem lịch sử sử dụng",
    desc: "Theo dõi các lần sử dụng và mức credits đã trừ.",
    href: "/usage",
  },
];

const recentUsage = [
  {
    name: "CodexAI",
    model: "gpt-5.3-codex",
    credits: "12.500",
    time: "Hôm nay, 10:24",
  },
  {
    name: "Claude",
    model: "claude-sonnet-4.5",
    credits: "8.200",
    time: "Hôm nay, 09:12",
  },
  {
    name: "Gemini",
    model: "gemini-3-flash-preview",
    credits: "3.900",
    time: "Hôm qua, 21:30",
  },
];

const activePlans = [
  {
    name: "CodexAI Plus",
    family: "CodexAI",
    isExpiringSoon: false,
  },
  {
    name: "Claude Mini",
    family: "Claude",
    isExpiringSoon: true,
  },
  {
    name: "Gemini Trial",
    family: "Gemini",
    isExpiringSoon: false,
  },
];

const expiringSoonCount = activePlans.filter(
  (plan) => plan.isExpiringSoon
).length;

function getPlanBadgeClass(family: string) {
  switch (family) {
    case "CodexAI":
      return "bg-[#e6f6ef] text-[#08745e]";
    case "Claude":
      return "bg-[#fff4df] text-[#9a5b00]";
    case "Gemini":
      return "bg-[#f1edff] text-[#5b3bb5]";
    case "DeepSeek":
      return "bg-[#eef4ff] text-[#2855a5]";
    default:
      return "bg-[#f3f5f4] text-[#5f6b66]";
  }
}

export default function DashboardPage() {
  const [purchasedPlans, setPurchasedPlans] = useState<StoredPurchasedPlan[]>(
    [],
  );
  const [usageLogs, setUsageLogs] = useState<StoredUsageLog[]>([]);

  useEffect(() => {
    setPurchasedPlans(getPurchasedPlans());
    setUsageLogs(getUsageLogs());
  }, []);

  const totalUsedCredits = useMemo(() => {
    return getTotalUsedCredits(usageLogs);
  }, [usageLogs]);

  const searchParams = useSearchParams();

  const purchasedPlan = searchParams.get("plan");
  const purchasedCredits = searchParams.get("credits");
  const purchasedFamily = searchParams.get("family");

  const newDashboardPlan =
    purchasedPlan && purchasedCredits
      ? {
          name: purchasedPlan,
          family: purchasedFamily ?? purchasedPlan.split(" ")[0],
          credits: purchasedCredits,
        }
      : null;

  const purchasedDashboardPlans = purchasedPlans.map((plan) => ({
    name: plan.name,
    family: plan.family,
    credits: plan.credits,
    isExpiringSoon: false,
  }));

  const displayedActivePlans = [
    ...purchasedDashboardPlans,
    ...activePlans.filter(
      (samplePlan) =>
        !purchasedDashboardPlans.some(
          (purchasedPlan) => purchasedPlan.name === samplePlan.name
        )
    ),
  ];

  const purchasedCreditsTotal = useMemo(() => {
    return purchasedPlans.reduce((total, plan) => {
      return total + parseCreditAmount(plan.credits);
    }, 0);
  }, [purchasedPlans]);

  const baseCredits = 1350000;
  const totalCredits = baseCredits + purchasedCreditsTotal;
  const remainingCredits = Math.max(totalCredits - totalUsedCredits, 0);

  const latestPurchasedPlan = purchasedPlans[0] ?? null;

  const dynamicStats = [
    {
      label: "Credits còn lại",
      value: formatCredits(remainingCredits),
      desc: "Tổng credits khả dụng trong tài khoản",
    },
    {
      label: "Đã sử dụng",
      value: formatCredits(totalUsedCredits),
      desc: "Tổng credits đã tiêu tốn gần đây",
    },
    {
      label: "API Keys",
      value: "2",
      desc: "Đang hoạt động",
    },
    {
      label: "Lượt dùng hôm nay",
      value: usageLogs.length.toString(),
      desc: "Cập nhật theo thời gian sử dụng",
    },
  ];

  return (
    <div>
      <section className="rounded-[28px] bg-[linear-gradient(135deg,#064c3f_0%,#0b7a63_50%,#00b894_100%)] p-8 text-white shadow-[0_20px_60px_rgba(11,122,99,0.18)]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            TzoShop Dashboard
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-1px] md:text-5xl">
            Quản lý credits, API key và mức sử dụng của bạn
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/82">
            Theo dõi gói đang dùng, kiểm tra credits còn lại và quản lý các kết
            nối với extension hoặc công cụ hỗ trợ.
          </p>
        </div>
      </section>

      {latestPurchasedPlan && (
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                Gói vừa kích hoạt
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0b0f0d]">
                {latestPurchasedPlan.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                {latestPurchasedPlan.credits} credits đã được cộng vào tài khoản.
                Bạn có thể tạo API key hoặc bắt đầu sử dụng với key hiện có.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/my-plans"
                className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-200 bg-white px-5 text-sm font-bold text-[#08745e] transition hover:bg-emerald-50"
              >
                Xem gói của tôi
              </Link>

              <Link
                href="/api-keys"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
              >
                Tạo API key
              </Link>
            </div>
          </div>
        </div>
      )}

      <section className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dynamicStats.map((item) => (
          <div
            key={item.label}
            className="h-full rounded-2xl border border-black/10 bg-white p-6"
          >
            <p className="text-sm text-[#5f6b66]">
              {item.label}
            </p>

            <p className="mt-3 text-3xl font-bold tracking-[-0.8px] text-[#0b0f0d]">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-[#5f6b66]">
              {item.desc}
            </p>
          </div>
        ))}

        {/* Card mới: Gói đang dùng */}
        <div className="h-full rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-[#5f6b66]">Gói đang dùng</p>

          <div className="mt-3 flex items-end gap-2">
            <h3 className="text-3xl font-bold leading-none text-[#0b0f0d]">
              {displayedActivePlans.length}
            </h3>

            <span className="pb-1 text-sm font-medium text-[#5f6b66]">
              gói đang hoạt động
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {displayedActivePlans.slice(0, 3).map((plan, index) => (
              <span
                key={`${plan.name}-${plan.family}-${index}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPlanBadgeClass(
                  plan.family
                )}`}
              >
                {plan.name}
              </span>
            ))}

            {displayedActivePlans.length > 3 && (
              <span className="rounded-full bg-[#f3f5f4] px-3 py-1 text-xs font-semibold text-[#5f6b66]">
                +{displayedActivePlans.length - 3} gói khác
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-[#5f6b66]">
            {expiringSoonCount > 0
              ? `${expiringSoonCount} gói sắp hết hạn, nên kiểm tra để mua thêm nếu cần.`
              : "Tất cả gói hiện tại vẫn còn hiệu lực."}
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-[#0b0f0d]">
              Thao tác nhanh
            </h3>

            <p className="mt-1 text-sm text-[#66736d]">
              Các hành động thường dùng trong tài khoản.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-bold text-[#0b0f0d]">{action.title}</p>

                <p className="mt-3 text-sm leading-6 text-[#5f6b66]">
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-[#0b0f0d]">
              Lịch sử gần đây
            </h3>

            <p className="mt-1 text-sm text-[#66736d]">
              Một số hoạt động sử dụng mới nhất.
            </p>
          </div>

          <div className="space-y-4">
            {recentUsage.map((item) => (
              <div
                key={`${item.name}-${item.time}`}
                className="rounded-2xl border border-[#edf1ee] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#0b0f0d]">{item.name}</p>

                    <p className="mt-1 font-mono text-xs text-[#66736d]">
                      {item.model}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-[#057a60]">
                    -{item.credits}
                  </p>
                </div>

                <p className="mt-3 text-sm text-[#9aa6a0]">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
