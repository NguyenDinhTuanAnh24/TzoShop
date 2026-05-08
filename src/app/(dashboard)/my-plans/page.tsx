"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getPurchasedPlans,
  getUsageLogs,
  getUsedCreditsByFamily,
  parseCreditAmount,
  formatCredits,
  getModelsForPlan,
  getExpiryDate,
  formatDateVi,
  type StoredPurchasedPlan,
  type StoredUsageLog,
} from "@/lib/mock-storage";

const activePlans = [
  {
    name: "CodexAI Plus",
    family: "CodexAI",
    status: "Đang hoạt động" as const,
    creditsTotal: "1.000.000",
    creditsLeft: "824.500",
    usedPercent: 17.5,
    expiresAt: "12/06/2026",
    duration: "30 ngày",
    paidAt: "2026-05-13", // Mock date
  },
  {
    name: "Claude Mini",
    family: "Claude",
    status: "Sắp hết hạn" as const,
    creditsTotal: "200.000",
    creditsLeft: "12.400",
    usedPercent: 93.8,
    expiresAt: "15/05/2026",
    duration: "30 ngày",
    paidAt: "2026-04-15", // Mock date
  },
  {
    name: "Gemini Trial",
    family: "Gemini",
    status: "Đang hoạt động" as const,
    creditsTotal: "50.000",
    creditsLeft: "42.000",
    usedPercent: 16,
    expiresAt: "28/05/2026",
    duration: "14 ngày",
    paidAt: "2026-05-14", // Mock date
  },
];

const expiredPlans = [
  {
    name: "DeepSeek Trial",
    family: "DeepSeek",
    status: "Đã hết hạn",
    creditsLeft: "0",
    expiresAt: "01/05/2026",
  },
  {
    name: "CodexAI Trial",
    family: "CodexAI",
    status: "Đã hết hạn",
    creditsLeft: "0",
    expiresAt: "25/04/2026",
  },
];

export default function MyPlansPage() {
  const [purchasedPlans, setPurchasedPlans] = useState<StoredPurchasedPlan[]>(
    [],
  );
  const [usageLogs, setUsageLogs] = useState<StoredUsageLog[]>([]);

  useEffect(() => {
    setPurchasedPlans(getPurchasedPlans());
    setUsageLogs(getUsageLogs());
  }, []);

  const usedCreditsByFamily = useMemo(() => {
    return getUsedCreditsByFamily(usageLogs);
  }, [usageLogs]);

  const purchasedActivePlans = purchasedPlans.map((plan) => ({
    name: plan.name,
    family: plan.family,
    status: "Đang hoạt động" as const,
    creditsTotal: plan.credits,
    creditsLeft: plan.credits,
    usedPercent: 0,
    expiresAt: "Theo thời hạn gói",
    duration: plan.duration || "-",
    paidAt: plan.paidAt || new Date().toISOString(),
    models: getModelsForPlan(plan.name, plan.family),
  }));

  const displayedActivePlans = [
    ...purchasedActivePlans,
    ...activePlans.filter(
      (samplePlan) =>
        !purchasedActivePlans.some(
          (purchasedPlan) => purchasedPlan.name === samplePlan.name,
        ),
    ),
  ];

  const plansWithRemainingCredits = useMemo(() => {
    return displayedActivePlans.map((plan) => {
      const total = parseCreditAmount(plan.creditsTotal);
      const used = usedCreditsByFamily[plan.family] ?? 0;
      const remaining = Math.max(total - used, 0);
      const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;

      return {
        ...plan,
        models: getModelsForPlan(plan.name, plan.family),
        expiresAt: formatDateVi(getExpiryDate(plan.paidAt, plan.duration)),
        remainingCredits: remaining,
        usedCredits: used,
        totalCreditsNum: total,
        creditsLeft: formatCredits(remaining),
        usedPercent: percent,
      };
    });
  }, [displayedActivePlans, usedCreditsByFamily]);

  const latestPurchasedPlan = purchasedPlans[0] ?? null;

  const dynamicSummaryCards = [
    {
      label: "Tổng gói đang dùng",
      value: String(plansWithRemainingCredits.length),
      desc: "Gói còn hiệu lực",
    },
    {
      label: "Tổng credits còn lại",
      value: formatCredits(
        plansWithRemainingCredits.reduce(
          (sum, p) => sum + p.remainingCredits,
          0,
        ),
      ),
      desc: "Tính trên các gói còn hạn",
    },
    {
      label: "Gói sắp hết hạn",
      value: String(
        plansWithRemainingCredits.filter((p) => p.status === "Sắp hết hạn")
          .length,
      ),
      desc: "Nên kiểm tra để mua thêm",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#057a60]">
            Gói của tôi
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-1px] text-[#0b0f0d]">
            Gói credits đang sử dụng
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[#66736d]">
            Theo dõi các gói credits đã mua, số credits còn lại, thời hạn sử
            dụng và dòng AI tương ứng trong tài khoản của bạn.
          </p>
        </div>

        <Link
          href="/plans"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
        >
          Mua thêm credits
        </Link>
      </div>

      {latestPurchasedPlan && (
        <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
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
                Bạn có thể bắt đầu sử dụng gói này với API key hiện có hoặc tạo
                API key mới.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-200 bg-white px-5 text-sm font-bold text-[#08745e] transition hover:bg-emerald-50"
              >
                Về dashboard
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

      <section className="grid gap-5 md:grid-cols-3">
        {dynamicSummaryCards.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#dfe5e1] bg-white p-6"
          >
            <p className="text-sm font-semibold text-[#66736d]">
              {item.label}
            </p>

            <p className="mt-3 text-3xl font-bold tracking-[-0.8px] text-[#0b0f0d]">
              {item.value}
            </p>

            <p className="mt-2 text-sm leading-6 text-[#66736d]">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0b0f0d]">
                Gói đang hoạt động
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Dữ liệu được cập nhật dựa trên lịch sử sử dụng thực tế.
              </p>
            </div>

            <div className="space-y-5">
              {plansWithRemainingCredits.map((plan, index) => {
                const isWarning = plan.status === "Sắp hết hạn";

                return (
                  <div
                    key={`${plan.name}-${plan.family}-${index}`}
                    className="rounded-2xl border border-[#edf1ee] bg-white p-5 transition hover:border-[#cfd8d3]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-[#0b0f0d]">
                            {plan.name}
                          </h3>

                          <span
                            className={
                              isWarning
                                ? "rounded-full bg-[#fff7e6] px-3 py-1 text-xs font-bold text-[#a15c00]"
                                : "rounded-full bg-[#e9fbf6] px-3 py-1 text-xs font-bold text-[#057a60]"
                            }
                          >
                            {plan.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-[#66736d]">
                          Dòng credits: {plan.family}
                        </p>
                      </div>

                      <Link
                        href="/plans"
                        className="rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
                      >
                        Mua thêm
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-[#f7f8f6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                          Credits còn lại
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#0b0f0d]">
                          {formatCredits(plan.remainingCredits)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7f8f6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                          Đã sử dụng
                        </p>
                        <p className="mt-1 text-xl font-bold text-[#47524d]">
                          {formatCredits(plan.usedCredits)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7f8f6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                          Tổng credits
                        </p>
                        <p className="mt-1 text-xl font-bold text-[#47524d]">
                          {formatCredits(plan.totalCreditsNum)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#0b0f0d]">
                          Mức sử dụng
                        </p>

                        <p className="text-sm font-bold text-[#057a60]">
                          {plan.usedPercent.toFixed(1)}%
                        </p>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-[#edf1ee]">
                        <div
                          className={
                            isWarning
                              ? "h-full rounded-full bg-[#f59e0b]"
                              : "h-full rounded-full bg-[#00d4a4]"
                          }
                          style={{ width: `${plan.usedPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-3 text-sm font-semibold text-[#0b0f0d]">
                          Model hỗ trợ
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {plan.models.slice(0, 4).map((model) => (
                            <span
                              key={model}
                              className="rounded-full border border-[#dfe5e1] bg-[#f7f8f6] px-3 py-1 font-mono text-xs text-[#47524d]"
                            >
                              {model}
                            </span>
                          ))}

                          {plan.models.length > 4 && (
                            <span className="rounded-full border border-[#dfe5e1] bg-[#f7f8f6] px-3 py-1 text-xs font-bold text-[#47524d]">
                              +{plan.models.length - 4} model
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                          Hết hạn vào
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                          {plan.expiresAt}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0b0f0d]">
                Gói đã hết hạn
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Các gói cũ được giữ lại để bạn dễ theo dõi lịch sử sử dụng.
              </p>
            </div>

            <div className="space-y-3">
              {expiredPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#edf1ee] bg-[#f7f8f6] p-4"
                >
                  <div>
                    <p className="font-bold text-[#0b0f0d]">{plan.name}</p>
                    <p className="mt-1 text-sm text-[#66736d]">
                      {plan.family} · Hết hạn ngày {plan.expiresAt}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#f1f2f1] px-3 py-1 text-xs font-bold text-[#66736d]">
                    {plan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Gợi ý chọn gói
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Mới dùng thử nên bắt đầu bằng gói nhỏ để kiểm tra mức sử dụng thực tế.",
                "Nếu dùng thường xuyên với extension, nên chọn gói có thời hạn dài hơn.",
                "Nên mua riêng từng dòng credits theo đúng nhu cầu sử dụng.",
                "Khi credits còn thấp, hãy mua thêm trước để tránh gián đoạn.",
              ].map((note) => (
                <div key={note} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
                  <p className="text-sm leading-6 text-[#47524d]">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-[#0b0f0d] p-6 text-white">
            <h2 className="text-xl font-bold">Cần thêm credits?</h2>

            <p className="mt-3 text-sm leading-6 text-white/72">
              Bạn có thể mua thêm gói cùng dòng credits hoặc chọn dòng khác nếu
              nhu cầu sử dụng thay đổi.
            </p>

            <Link
              href="/plans"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full !bg-white px-5 py-3 text-sm font-bold !text-[#0b0f0d]"
            >
              Xem bảng giá
            </Link>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Lưu ý về credits
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#66736d]">
              Credits sẽ được trừ theo quá trình sử dụng. Khi gói hết hạn hoặc
              credits về 0, bạn cần mua thêm gói mới để tiếp tục sử dụng.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
