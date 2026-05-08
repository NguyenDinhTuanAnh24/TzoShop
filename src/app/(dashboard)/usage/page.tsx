"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ApiKeyItem = {
  id: string;
  name: string;
  family: string;
  keyPreview: string;
  fullKey?: string;
  status: "Đang hoạt động" | "Đã thu hồi";
  createdAt: string;
  lastUsed: string;
};

type UsageLogItem = {
  id: string;
  family: string;
  model: string;
  apiKey: string;
  credits: string;
  status: "Thành công" | "Thất bại";
  time: string;
};

const summaryCards = [
  {
    label: "Credits đã dùng hôm nay",
    value: "24.600",
    desc: "Tính trên các request thành công",
  },
  {
    label: "Request hôm nay",
    value: "128",
    desc: "Bao gồm nhiều dòng credits",
  },
  {
    label: "Request lỗi",
    value: "3",
    desc: "Có thể do key hết hạn hoặc thiếu credits",
  },
  {
    label: "Dòng dùng nhiều nhất",
    value: "CodexAI",
    desc: "Theo dữ liệu sử dụng gần đây",
  },
];

const usageItems = [
  {
    id: "USG-1001",
    family: "CodexAI",
    model: "gpt-5.3-codex",
    apiKey: "Extension chính",
    credits: "12.500",
    status: "Thành công",
    time: "Hôm nay, 10:24",
  },
  {
    id: "USG-1002",
    family: "Claude",
    model: "claude-sonnet-4.5",
    apiKey: "Key thử nghiệm",
    credits: "8.200",
    status: "Thành công",
    time: "Hôm nay, 09:12",
  },
  {
    id: "USG-1003",
    family: "Gemini",
    model: "gemini-3-flash-preview",
    apiKey: "Extension chính",
    credits: "3.900",
    status: "Thành công",
    time: "Hôm qua, 21:30",
  },
  {
    id: "USG-1004",
    family: "DeepSeek",
    model: "deepseek-v4-flash",
    apiKey: "Key cũ",
    credits: "0",
    status: "Thất bại",
    time: "Hôm qua, 18:05",
  },
  {
    id: "USG-1005",
    family: "CodexAI",
    model: "gpt-5-codex",
    apiKey: "Extension chính",
    credits: "6.700",
    status: "Thành công",
    time: "07/05/2026, 22:11",
  },
];

export default function UsagePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);

  useEffect(() => {
    const storedKeys = JSON.parse(
      window.localStorage.getItem("tzoshop_api_keys") ?? "[]",
    );

    setApiKeys(storedKeys);
  }, []);

  const generatedUsageLogs: UsageLogItem[] = useMemo(() => {
    const activeKeys = apiKeys.filter((key) => key.status === "Đang hoạt động");

    const modelByFamily: Record<string, string> = {
      CodexAI: "gpt-5.3-codex",
      Claude: "claude-sonnet-4.5",
      Gemini: "gemini-3-flash-preview",
      DeepSeek: "deepseek-v4-flash",
    };

    return activeKeys.flatMap((key, index) => [
      {
        id: `USE-${key.id}-001`,
        family: key.family,
        model: modelByFamily[key.family] ?? "model-default",
        apiKey: key.name,
        credits: index % 2 === 0 ? "-12.500" : "-8.200",
        status: "Thành công",
        time: "Hôm nay, 10:24",
      },
      {
        id: `USE-${key.id}-002`,
        family: key.family,
        model: modelByFamily[key.family] ?? "model-default",
        apiKey: key.name,
        credits: "-3.900",
        status: "Thành công",
        time: "Hôm nay, 09:12",
      },
    ]);
  }, [apiKeys]);

  const displayedUsageLogs = [...generatedUsageLogs, ...usageItems];

  const successLogs = displayedUsageLogs.filter(
    (item) => item.status === "Thành công",
  );

  const failedLogs = displayedUsageLogs.filter(
    (item) => item.status === "Thất bại",
  );

  const totalUsedCredits = successLogs.reduce((total, item) => {
    const numberValue = Number(item.credits.replace(/[^\d]/g, ""));
    return total + numberValue;
  }, 0);

  const mostUsedFamily =
    successLogs.length > 0
      ? successLogs.reduce<Record<string, number>>((acc, item) => {
          acc[item.family] = (acc[item.family] ?? 0) + 1;
          return acc;
        }, {})
      : {};

  const topFamily =
    Object.entries(mostUsedFamily).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  const dynamicSummaryCards = [
    {
      label: "Credits đã dùng hôm nay",
      value: totalUsedCredits.toLocaleString("vi-VN"),
      desc: "Tính trên các request thành công",
    },
    {
      label: "Request hôm nay",
      value: displayedUsageLogs.length.toString(),
      desc: "Bao gồm nhiều dòng credits",
    },
    {
      label: "Request lỗi",
      value: failedLogs.length.toString(),
      desc: "Có thể do key hết hạn hoặc thiếu credits",
    },
    {
      label: "Dòng dùng nhiều nhất",
      value: topFamily,
      desc: "Theo dữ liệu sử dụng gần đây",
    },
  ];

  const filteredUsageItems = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return displayedUsageLogs.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.id.toLowerCase().includes(normalizedSearch) ||
        item.family.toLowerCase().includes(normalizedSearch) ||
        item.model.toLowerCase().includes(normalizedSearch) ||
        item.apiKey.toLowerCase().includes(normalizedSearch);

      const matchesFamily =
        familyFilter === "all" || item.family.toLowerCase() === familyFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "success" && item.status === "Thành công") ||
        (statusFilter === "failed" && item.status === "Thất bại");

      return matchesSearch && matchesFamily && matchesStatus;
    });
  }, [searchQuery, familyFilter, statusFilter, displayedUsageLogs]);

  function handleResetFilters() {
    setSearchQuery("");
    setFamilyFilter("all");
    setStatusFilter("all");
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#057a60]">
            Lịch sử sử dụng
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-1px] text-[#0b0f0d]">
            Theo dõi mức dùng credits
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[#66736d]">
            Kiểm tra các lần sử dụng gần đây, dòng credits, model đã dùng, API
            key liên quan và số credits đã trừ.
          </p>
        </div>

        <button
          type="button"
          className="rounded-full border border-[#dfe5e1] bg-white px-5 py-3 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
        >
          Xuất báo cáo
        </button>
      </div>

      {apiKeys.length === 0 && (
        <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                Chưa có API key
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0b0f0d]">
                Bạn cần tạo API key trước khi có lịch sử sử dụng
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Khi API key được dùng với extension hoặc công cụ hỗ trợ, các
                lượt sử dụng và credits bị trừ sẽ hiển thị tại đây.
              </p>
            </div>

            <Link
              href="/api-keys"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
            >
              Tạo API key
            </Link>
          </div>
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

      <section className="mt-8 rounded-2xl border border-[#dfe5e1] bg-white p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Bộ lọc lịch sử
            </h2>

            <p className="mt-1 text-sm text-[#66736d]">
              Lọc theo dòng credits, trạng thái hoặc từ khóa.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
          >
            Xóa bộ lọc
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
            >
              Tìm kiếm
            </label>

            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm theo model, API key hoặc mã giao dịch"
              className="w-full rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] px-4 py-3 text-sm font-medium text-[#0b0f0d] outline-none transition placeholder:text-[#9aa6a0] focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
            />
          </div>

          <div>
            <label
              htmlFor="family"
              className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
            >
              Dòng credits
            </label>

            <select
              id="family"
              value={familyFilter}
              onChange={(event) => setFamilyFilter(event.target.value)}
              className="w-full rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] px-4 py-3 text-sm font-medium text-[#0b0f0d] outline-none transition focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
            >
              <option value="all">Tất cả</option>
              <option value="codexai">CodexAI</option>
              <option value="claude">Claude</option>
              <option value="gemini">Gemini</option>
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
            >
              Trạng thái
            </label>

            <select
              id="status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] px-4 py-3 text-sm font-medium text-[#0b0f0d] outline-none transition focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
            >
              <option value="all">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Danh sách sử dụng
            </h2>

            <p className="mt-1 text-sm text-[#66736d]">
              Đây là dữ liệu mẫu. Sau này sẽ lấy từ usage log thật trong hệ
              thống.
            </p>
          </div>

          <div className="space-y-4">
            {filteredUsageItems.map((item) => {
              const isSuccess = item.status === "Thành công";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#edf1ee] bg-white p-5 transition hover:border-[#cfd8d3]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-mono text-xs font-bold text-[#9aa6a0]">
                          {item.id}
                        </p>

                        <span
                          className={
                            isSuccess
                              ? "rounded-full bg-[#e9fbf6] px-3 py-1 text-xs font-bold text-[#057a60]"
                              : "rounded-full bg-[#fff5f5] px-3 py-1 text-xs font-bold text-[#b42318]"
                          }
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-[#0b0f0d]">
                        {item.family}
                      </h3>

                      <p className="mt-1 font-mono text-sm text-[#66736d]">
                        {item.model}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p
                        className={
                          isSuccess
                            ? "text-lg font-bold text-[#057a60]"
                            : "text-lg font-bold text-[#b42318]"
                        }
                      >
                        {isSuccess ? "-" : ""}
                        {item.credits} credits
                      </p>

                      <p className="mt-2 text-sm text-[#9aa6a0]">
                        {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 rounded-2xl bg-[#f7f8f6] p-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                        API key
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                        {item.apiKey}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                        Model
                      </p>
                      <p className="mt-1 font-mono text-xs font-bold text-[#0b0f0d]">
                        {item.model}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                        Thời gian
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredUsageItems.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#cfd8d3] bg-[#f7f8f6] p-8 text-center">
                <p className="font-semibold text-[#0b0f0d]">
                  Không tìm thấy lịch sử phù hợp
                </p>

                <p className="mt-2 text-sm text-[#66736d]">
                  Hãy thử đổi từ khóa, dòng credits hoặc trạng thái lọc.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Cách đọc lịch sử
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Mỗi dòng tương ứng với một lần sử dụng qua API key.",
                "Credits chỉ bị trừ khi request được xử lý thành công.",
                "Request thất bại nên được kiểm tra nguyên nhân trước khi thử lại.",
                "Nếu thấy sử dụng bất thường, hãy kiểm tra hoặc thu hồi API key.",
              ].map((note) => (
                <div key={note} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
                  <p className="text-sm leading-6 text-[#47524d]">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-[#0b0f0d] p-6 text-white">
            <h2 className="text-xl font-bold">Phát hiện bất thường?</h2>

            <p className="mt-3 text-sm leading-6 text-white/72">
              Nếu credits bị trừ ngoài ý muốn, hãy kiểm tra API key đang hoạt
              động và thu hồi key nghi ngờ bị lộ.
            </p>

            <a
              href="/api-keys"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full !bg-white px-5 py-3 text-sm font-bold !text-[#0b0f0d]"
            >
              Quản lý API keys
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
