"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type PurchasedPlan = {
  id: string;
  name: string;
  family: string;
  credits: string;
  amount: string;
  paidAt: string;
};

function getModelsForPlan(planName: string, family: string) {
  const normalizedName = planName.toLowerCase();

  if (family === "CodexAI") {
    if (normalizedName.includes("trial") || normalizedName.includes("mini")) {
      return ["gpt-5.3-codex", "gpt-5.1-codex", "gpt-5-codex"];
    }

    if (normalizedName.includes("plus")) {
      return [
        "gpt-5.3-codex",
        "gpt-5.1-codex",
        "gpt-5-codex",
        "gpt-5.4-mini",
        "gpt-5.1",
        "gpt-5-mini",
      ];
    }

    if (normalizedName.includes("pro")) {
      return [
        "gpt-5.3-codex",
        "gpt-5.1-codex",
        "gpt-5-codex",
        "gpt-5.5",
        "gpt-5.4",
        "gpt-5.2",
        "gpt-5",
      ];
    }

    if (normalizedName.includes("max")) {
      return ["gpt-5.4-pro", "gpt-5.2-pro", "gpt-5-pro", "gpt-5.5"];
    }

    if (normalizedName.includes("ultra")) {
      return ["gpt-5.5-pro", "gpt-5.4-pro", "gpt-5.2-pro", "gpt-5-pro"];
    }
  }

  if (family === "Claude") {
    if (normalizedName.includes("trial")) {
      return ["claude-haiku-4.5"];
    }

    if (normalizedName.includes("mini")) {
      return ["claude-haiku-4.5", "claude-sonnet-4.5"];
    }

    if (normalizedName.includes("plus")) {
      return ["claude-haiku-4.5", "claude-sonnet-4.5", "claude-sonnet-4.6"];
    }

    if (normalizedName.includes("pro")) {
      return ["claude-opus-4.5", "claude-sonnet-4.6"];
    }

    if (normalizedName.includes("max")) {
      return ["claude-opus-4.5", "claude-opus-4.6"];
    }

    if (normalizedName.includes("ultra")) {
      return ["claude-opus-4.7", "claude-opus-4.6", "claude-sonnet-4.6"];
    }
  }

  if (family === "Gemini") {
    if (normalizedName.includes("trial")) {
      return ["gemini-3.1-flash-lite-preview"];
    }

    if (normalizedName.includes("mini")) {
      return ["gemini-3.1-flash-lite-preview", "gemini-3-flash-preview"];
    }

    if (normalizedName.includes("plus")) {
      return [
        "gemini-3.1-flash-lite-preview",
        "gemini-3-flash-preview",
        "gemini-2.5-pro",
      ];
    }

    if (normalizedName.includes("pro")) {
      return ["gemini-2.5-pro", "gemini-3.1-pro-preview"];
    }

    if (normalizedName.includes("max") || normalizedName.includes("ultra")) {
      return ["Tất cả Gemini model"];
    }
  }

  if (family === "DeepSeek") {
    if (normalizedName.includes("trial") || normalizedName.includes("mini")) {
      return ["deepseek-v4-flash"];
    }

    return ["deepseek-v4-flash", "deepseek-v4-pro"];
  }

  return ["Model sẽ được cập nhật theo gói"];
}

const activePlans = [
  {
    name: "CodexAI Plus",
    family: "CodexAI",
    status: "Đang hoạt động",
    creditsTotal: "1.000.000",
    creditsLeft: "620.000",
    usedPercent: 38,
    expiresAt: "22/06/2026",
    duration: "45 ngày",
    models: ["gpt-5.3-codex", "gpt-5.1-codex", "gpt-5-codex", "gpt-5.4-mini"],
  },
  {
    name: "Claude Mini",
    family: "Claude",
    status: "Sắp hết hạn",
    creditsTotal: "1.000.000",
    creditsLeft: "120.000",
    usedPercent: 88,
    expiresAt: "14/05/2026",
    duration: "30 ngày",
    models: ["claude-haiku-4.5", "claude-sonnet-4.5"],
  },
  {
    name: "Gemini Trial",
    family: "Gemini",
    status: "Đang hoạt động",
    creditsTotal: "500.000",
    creditsLeft: "410.000",
    usedPercent: 18,
    expiresAt: "12/05/2026",
    duration: "7 ngày",
    models: ["gemini-3-flash-preview", "gemini-3.1-flash-lite-preview"],
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

const summaryCards = [
  {
    label: "Tổng gói đang dùng",
    value: "3",
    desc: "Gói còn hiệu lực",
  },
  {
    label: "Tổng credits còn lại",
    value: "1.150.000",
    desc: "Tính trên các gói còn hạn",
  },
  {
    label: "Gói sắp hết hạn",
    value: "1",
    desc: "Nên kiểm tra để mua thêm nếu cần",
  },
];

export default function MyPlansPage() {
  const [purchasedPlans, setPurchasedPlans] = useState<PurchasedPlan[]>([]);

  useEffect(() => {
    const storedPlans = JSON.parse(
      window.localStorage.getItem("tzoshop_purchased_plans") ?? "[]"
    );

    setPurchasedPlans(storedPlans);
  }, []);

  const purchasedActivePlans = purchasedPlans.map((plan) => ({
    name: plan.name,
    family: plan.family,
    status: "Đang hoạt động" as const,
    creditsTotal: plan.credits,
    creditsLeft: plan.credits,
    usedPercent: 0,
    expiresAt: "Theo thời hạn gói",
    duration: "-",
    models: getModelsForPlan(plan.name, plan.family),
  }));

  const displayedActivePlans = [
    ...purchasedActivePlans,
    ...activePlans.filter(
      (samplePlan) =>
        !purchasedActivePlans.some(
          (purchasedPlan) => purchasedPlan.name === samplePlan.name
        )
    ),
  ];

  const latestPurchasedPlan = purchasedPlans[0] ?? null;

  const dynamicSummaryCards = [
    {
      label: "Tổng gói đang dùng",
      value: String(displayedActivePlans.length),
      desc: "Gói còn hiệu lực",
    },
    {
      label: "Tổng credits còn lại",
      value: "1.150.000",
      desc: "Tính trên các gói còn hạn",
    },
    {
      label: "Gói sắp hết hạn",
      value: "1",
      desc: "Nên kiểm tra để mua thêm nếu cần",
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
                Đây là dữ liệu mẫu. Sau này sẽ lấy theo tài khoản người dùng.
              </p>
            </div>

            <div className="space-y-5">
              {displayedActivePlans.map((plan, index) => {
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
                          {plan.creditsLeft}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7f8f6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                          Tổng credits
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#0b0f0d]">
                          {plan.creditsTotal}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7f8f6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                          Hết hạn
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#0b0f0d]">
                          {plan.expiresAt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#0b0f0d]">
                          Mức sử dụng
                        </p>

                        <p className="text-sm font-bold text-[#057a60]">
                          {plan.usedPercent}%
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

                    <div className="mt-5">
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
