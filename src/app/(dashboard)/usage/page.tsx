"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getApiKeys,
  getUsageLogs,
  saveUsageLogs,
  parseCreditAmount,
  getTotalUsedCredits,
  formatCredits,
  type StoredApiKey,
  type StoredUsageLog,
} from "@/lib/mock-storage";
import {
  getAvailableModelsByFamilies,
  getModelById,
  type ModelFamily,
} from "@/lib/model-registry";
import { buttonStyles } from "@/lib/ui-styles";



function parseUsedCredits(value: string) {
  return Number(value.replace("-", "").replace(/\./g, "")) || 0;
}



const sampleUsageLogs = [
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
  const [selectedApiKeyFilter, setSelectedApiKeyFilter] = useState("all");
  const [selectedApiKeyId, setSelectedApiKeyId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [isCallingApi, setIsCallingApi] = useState(false);

  const [storedApiKeys, setStoredApiKeys] = useState<StoredApiKey[]>([]);
  const [usageLogs, setUsageLogs] = useState<StoredUsageLog[]>([]);

  useEffect(() => {
    setStoredApiKeys(getApiKeys());
    setUsageLogs(getUsageLogs());
  }, []);

  const activeApiKeys = useMemo(() => {
    return storedApiKeys.filter((key) => key.status === "Đang hoạt động");
  }, [storedApiKeys]);

  useEffect(() => {
    if (activeApiKeys.length === 0) {
      setSelectedApiKeyId("");
      return;
    }

    setSelectedApiKeyId((current) => {
      const stillExists = activeApiKeys.some((key) => key.id === current);

      if (stillExists) return current;

      return activeApiKeys[0].id;
    });
  }, [activeApiKeys]);

  const selectedApiKey = useMemo(() => {
    return activeApiKeys.find((key) => key.id === selectedApiKeyId) ?? null;
  }, [activeApiKeys, selectedApiKeyId]);

  const availableModelsForSelectedKey = useMemo(() => {
    if (!selectedApiKey) return [];
    return getAvailableModelsByFamilies([selectedApiKey.family]);
  }, [selectedApiKey]);

  useEffect(() => {
    if (availableModelsForSelectedKey.length === 0) {
      setSelectedModelId("");
      return;
    }

    setSelectedModelId((current) => {
      const stillExists = availableModelsForSelectedKey.some(
        (model) => model.id === current
      );

      if (stillExists) return current;

      return availableModelsForSelectedKey[0].id;
    });
  }, [availableModelsForSelectedKey]);

  const apiKeyFilterOptions = useMemo(() => {
    const names = usageLogs.map((log) => log.apiKey);
    return ["all", ...Array.from(new Set(names))];
  }, [usageLogs]);

  const displayedUsageLogs = usageLogs;

  async function handleMockApiCall() {
    const selectedModel = getModelById(selectedModelId);

    if (!selectedApiKey || !selectedModel) return;

    if (selectedModel.family !== selectedApiKey.family) {
      return;
    }

    setIsCallingApi(true);

    try {
      const response = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${selectedApiKey.fullKey ?? selectedApiKey.keyPreview}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: [
            {
              role: "user",
              content: "Hello from TzoShop usage test",
            },
          ],
        }),
      });

      const data = await response.json();

      const isSuccess = response.ok;
      const chargedCredits = Number(data?.usage?.charged_credits ?? 0);

      const newLog: StoredUsageLog = {
        id: `USE-${selectedApiKey.id}-${Date.now()}`,
        family: selectedModel.family,
        model: selectedModel.id,
        apiKey: selectedApiKey.name,
        credits: isSuccess
          ? `-${chargedCredits.toLocaleString("vi-VN")}`
          : "0",
        status: isSuccess ? "Thành công" : "Thất bại",
        time: "Vừa xong",
        errorReason: isSuccess
          ? undefined
          : data?.error?.message ?? "Request thất bại",
      };

      const nextLogs = [newLog, ...usageLogs];

      setUsageLogs(nextLogs);
      saveUsageLogs(nextLogs);
    } catch {
      const newLog: StoredUsageLog = {
        id: `USE-${selectedApiKey.id}-${Date.now()}`,
        family: selectedModel.family,
        model: selectedModel.id,
        apiKey: selectedApiKey.name,
        credits: "0",
        status: "Thất bại",
        time: "Vừa xong",
        errorReason: "Không thể kết nối tới API route mock.",
      };

      const nextLogs = [newLog, ...usageLogs];

      setUsageLogs(nextLogs);
      saveUsageLogs(nextLogs);
    } finally {
      setIsCallingApi(false);
    }
  }

  const usedCreditsToday = useMemo(() => {
    return usageLogs
      .filter((log) => log.status === "Thành công")
      .reduce((total, log) => {
        return total + Math.abs(parseCreditAmount(log.credits));
      }, 0);
  }, [usageLogs]);

  const successLogs = usageLogs.filter((item) => item.status === "Thành công");
  const totalUsedCredits = usedCreditsToday;

  const mostUsedFamily =
    successLogs.length > 0
      ? successLogs.reduce<Record<string, number>>((acc, item) => {
        acc[item.family] = (acc[item.family] ?? 0) + 1;
        return acc;
      }, {})
      : {};

  const topFamily =
    Object.entries(mostUsedFamily).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  const todayRequests = usageLogs.length;

  const failedRequestCount = useMemo(() => {
    return usageLogs.filter((log) => log.status === "Thất bại").length;
  }, [usageLogs]);

  const dynamicSummaryCards = [
    {
      label: "Credits đã dùng hôm nay",
      value: formatCredits(totalUsedCredits),
      desc: "Tính trên các request thành công",
    },
    {
      label: "Request hôm nay",
      value: todayRequests.toString(),
      desc: "Bao gồm nhiều dòng credits",
    },
    {
      label: "Request lỗi",
      value: failedRequestCount.toString(),
      desc: "Có thể do key hết hạn hoặc thiếu credits",
    },
    {
      label: "Dòng dùng nhiều nhất",
      value: topFamily,
      desc: "Theo dữ liệu sử dụng gần đây",
    },
  ];

  const filteredUsage = useMemo(() => {
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

      const matchesApiKey =
        selectedApiKeyFilter === "all" || item.apiKey === selectedApiKeyFilter;

      return matchesSearch && matchesFamily && matchesStatus && matchesApiKey;
    });
  }, [
    searchQuery,
    familyFilter,
    statusFilter,
    selectedApiKeyFilter,
    displayedUsageLogs,
  ]);

  function handleResetFilters() {
    setSearchQuery("");
    setFamilyFilter("all");
    setStatusFilter("all");
    setSelectedApiKeyFilter("all");
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

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedApiKeyId}
            onChange={(event) => setSelectedApiKeyId(event.target.value)}
            disabled={activeApiKeys.length === 0}
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            {activeApiKeys.length === 0 ? (
              <option value="">Chưa có API key hoạt động</option>
            ) : (
              activeApiKeys.map((key) => (
                <option key={key.id} value={key.id}>
                  {key.name} - {key.family}
                </option>
              ))
            )}
          </select>

          <select
            value={selectedModelId}
            onChange={(event) => setSelectedModelId(event.target.value)}
            disabled={availableModelsForSelectedKey.length === 0}
            className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            {availableModelsForSelectedKey.length === 0 ? (
              <option value="">Chưa có model khả dụng</option>
            ) : (
              availableModelsForSelectedKey.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))
            )}
          </select>

          <button
            type="button"
            onClick={handleMockApiCall}
            disabled={!selectedApiKeyId || !selectedModelId || isCallingApi}
            className={buttonStyles.primary}
          >
            {isCallingApi ? "Đang gọi API..." : "Gọi thử API"}
          </button>

          <button
            type="button"
            className={`inline-flex items-center justify-center ${buttonStyles.secondary}`}
          >
            Xuất báo cáo
          </button>
        </div>
      </div>

      {storedApiKeys.length === 0 && (
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
              className={`inline-flex items-center justify-center ${buttonStyles.primary}`}
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
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <div>
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
              placeholder="Tìm theo model, API key..."
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

          <div>
            <label
              htmlFor="apiKeyFilter"
              className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
            >
              API Key
            </label>

            <select
              id="apiKeyFilter"
              value={selectedApiKeyFilter}
              onChange={(event) => setSelectedApiKeyFilter(event.target.value)}
              className="w-full rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] px-4 py-3 text-sm font-medium text-[#0b0f0d] outline-none transition focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
            >
              {apiKeyFilterOptions.map((apiKey) => (
                <option key={apiKey} value={apiKey}>
                  {apiKey === "all" ? "Tất cả API key" : apiKey}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className={`h-11 w-full items-center justify-center transition ${buttonStyles.secondary}`}
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Danh sách sử dụng
            </h2>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-[#66736d]">
                Hiển thị {filteredUsage.length} / {displayedUsageLogs.length}{" "}
                request
              </p>

              <p className="text-xs font-medium text-[#9aa6a0]">
                Dữ liệu mẫu từ hệ thống
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {storedApiKeys.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  📊
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  Chưa có API key
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Bạn cần tạo API key trước khi có thể gọi thử API và ghi nhận
                  lịch sử sử dụng credits.
                </p>

                <Link
                  href="/api-keys"
                  className={`mt-6 inline-flex items-center justify-center ${buttonStyles.primary}`}
                >
                  Tạo API key
                </Link>
              </div>
            ) : activeApiKeys.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl">
                  ⚠️
                </div>

                <h2 className="mt-5 text-xl font-bold text-amber-950">
                  Không có API key đang hoạt động
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-amber-800">
                  Tất cả API key hiện tại đã bị thu hồi. Hãy tạo key mới để tiếp
                  tục gọi thử API.
                </p>

                <Link
                  href="/api-keys"
                  className={`mt-6 inline-flex items-center justify-center ${buttonStyles.warning}`}
                >
                  Quản lý API key
                </Link>
              </div>
            ) : filteredUsage.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  🧪
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  Chưa có lịch sử sử dụng
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Chọn một API key rồi bấm “Gọi thử API” để tạo request giả lập.
                  Request thành công sẽ bị trừ credits, request thất bại sẽ
                  không bị trừ.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsage.map((item) => {
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
                                  ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                                  : "rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
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

                          {!isSuccess && item.errorReason && (
                            <p className="mt-2 text-sm font-medium text-rose-600">
                              Lý do: {item.errorReason}
                            </p>
                          )}
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

            <Link
              href="/api-keys"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              Quản lý API keys
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
