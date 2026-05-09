"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Copy } from "lucide-react";
import {
  getPurchasedPlans,
  getApiKeys,
  saveApiKeys as saveApiKeysToStorage,
  getApiKeyLimitForPlan,
  type StoredPurchasedPlan,
  type StoredApiKey,
} from "@/lib/mock-storage";
import { buttonStyles } from "@/lib/ui-styles";

// Using StoredApiKey as the primary type

function maskApiKey(fullKey?: string, keyPreview?: string) {
  if (!fullKey) return keyPreview ?? "••••••••••••••••";

  const prefix = fullKey.slice(0, 6);
  const suffix = fullKey.slice(-4);

  return `${prefix}${"•".repeat(18)}${suffix}`;
}

export default function ApiKeysPage() {
  const [purchasedPlans, setPurchasedPlans] = useState<StoredPurchasedPlan[]>(
    [],
  );

  useEffect(() => {
    setPurchasedPlans(getPurchasedPlans());
  }, []);

  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);

  function saveApiKeys(nextKeys: StoredApiKey[]) {
    setApiKeys(nextKeys);
    saveApiKeysToStorage(nextKeys);
  }

  useEffect(() => {
    const storedKeys = getApiKeys();

    if (storedKeys.length > 0) {
      setApiKeys(storedKeys);
      return;
    }

    const defaultKeys: StoredApiKey[] = [
      {
        id: "key_001",
        name: "Extension chính",
        family: "CodexAI",
        keyPreview: "tz_live_••••••••••••x91a",
        status: "Đang hoạt động",
        createdAt: "08/05/2026",
        lastUsed: "Hôm nay, 10:24",
      },
      {
        id: "key_002",
        name: "Key test cũ",
        family: "Claude",
        keyPreview: "tz_live_••••••••••••p72k",
        status: "Đã thu hồi",
        createdAt: "01/05/2026",
        lastUsed: "03/05/2026",
      },
    ];

    setApiKeys(defaultKeys);
    saveApiKeysToStorage(defaultKeys);
  }, []);

  const availableFamilies = useMemo(() => {
    const families = purchasedPlans.map((plan) => plan.family);
    return Array.from(new Set(families));
  }, [purchasedPlans]);

  const apiKeyLimitByFamily = useMemo(() => {
    return purchasedPlans.reduce<Record<string, number>>((acc, plan) => {
      const limit = plan.apiKeyLimit ?? getApiKeyLimitForPlan(plan.name);
      acc[plan.family] = Math.max(acc[plan.family] ?? 0, limit);
      return acc;
    }, {});
  }, [purchasedPlans]);

  const activeApiKeyCountByFamily = useMemo(() => {
    return apiKeys.reduce<Record<string, number>>((acc, key) => {
      if (key.status !== "Đang hoạt động") return acc;
      acc[key.family] = (acc[key.family] ?? 0) + 1;
      return acc;
    }, {});
  }, [apiKeys]);

  const totalActiveKeys = useMemo(() => {
    return apiKeys.filter((key) => key.status === "Đang hoạt động").length;
  }, [apiKeys]);

  const totalKeyLimit = useMemo(() => {
    return Object.values(apiKeyLimitByFamily).reduce((total, limit) => {
      return total + limit;
    }, 0);
  }, [apiKeyLimitByFamily]);

  const availableFamiliesCanCreateKey = useMemo(() => {
    return availableFamilies.filter((family) => {
      const limit = apiKeyLimitByFamily[family] ?? 0;
      const activeCount = activeApiKeyCountByFamily[family] ?? 0;

      return activeCount < limit;
    });
  }, [availableFamilies, apiKeyLimitByFamily, activeApiKeyCountByFamily]);

  const hasAnyPlan = availableFamilies.length > 0;

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<StoredApiKey | null>(null);
  const [createError, setCreateError] = useState("");
  const [visibleKeyIds, setVisibleKeyIds] = useState<string[]>([]);
  const [copiedKeyId, setCopiedKeyId] = useState("");

  useEffect(() => {
    if (!selectedFamily && availableFamiliesCanCreateKey.length > 0) {
      setSelectedFamily(availableFamiliesCanCreateKey[0]);
    }
  }, [availableFamiliesCanCreateKey, selectedFamily]);

  function toggleKeyVisibility(keyId: string) {
    setVisibleKeyIds((current) => {
      if (current.includes(keyId)) {
        return current.filter((id) => id !== keyId);
      }

      return [...current, keyId];
    });
  }

  function handleOpenCreateModal() {
    setCreateError("");
    setKeyName("");
    if (availableFamiliesCanCreateKey.length > 0) {
      setSelectedFamily(availableFamiliesCanCreateKey[0]);
    }
    setOpenCreateModal(true);
  }

  function handleCreateApiKey() {
    setCreateError("");

    if (!keyName.trim() || !selectedFamily) {
      return;
    }

    const keyLimit = apiKeyLimitByFamily[selectedFamily] ?? 0;
    const activeKeyCount = activeApiKeyCountByFamily[selectedFamily] ?? 0;

    if (activeKeyCount >= keyLimit) {
      setCreateError(
        `Dòng ${selectedFamily} đã đạt giới hạn ${keyLimit} API key của gói hiện tại.`,
      );
      return;
    }

    const randomPart = Math.random().toString(36).slice(2, 18);
    const rawKey = `tz_${randomPart}_${Date.now()}`;

    const newKey: StoredApiKey = {
      id: `KEY-${Date.now()}`,
      name: keyName.trim(),
      family: selectedFamily,
      keyPreview: `${rawKey.slice(0, 8)}...${rawKey.slice(-6)}`,
      fullKey: rawKey,
      status: "Đang hoạt động",
      createdAt: "Vừa tạo",
      lastUsed: "Chưa sử dụng",
    };

    saveApiKeys([newKey, ...apiKeys]);

    setCreatedKey(rawKey);
    setKeyName("");
    setOpenCreateModal(false);
  }

  async function handleCopy(value: string) {
    await navigator.clipboard.writeText(value);

    setCopiedKey(value);

    window.setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  }

  async function handleCopyApiKey(key: StoredApiKey) {
    const value = key.fullKey ?? key.keyPreview;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedKeyId(key.id);

      window.setTimeout(() => {
        setCopiedKeyId("");
      }, 1500);
    } catch {
      setCopiedKeyId("");
    }
  }

  function handleConfirmRevoke() {
    if (!revokeTarget) return;

    const nextKeys = apiKeys.map((key) =>
      key.id === revokeTarget.id
        ? {
            ...key,
            status: "Đã thu hồi" as const,
          }
        : key,
    );

    saveApiKeys(nextKeys);
    setRevokeTarget(null);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#057a60]">
            API Keys
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-1px] text-[#0b0f0d]">
            Quản lý API Keys
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[#66736d]">
            Tạo và quản lý API key để sử dụng cùng extension hoặc công cụ hỗ trợ
            tương thích. Không chia sẻ key công khai để tránh phát sinh sử dụng
            ngoài ý muốn.
          </p>

          {availableFamilies.length > 0 &&
            availableFamiliesCanCreateKey.length === 0 && (
              <p className="mt-3 text-sm font-bold text-amber-700">
                Tất cả dòng credits hiện tại đã đạt giới hạn API key. Hãy thu hồi
                key cũ hoặc nâng cấp gói.
              </p>
            )}
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          disabled={!hasAnyPlan || availableFamiliesCanCreateKey.length === 0}
          className={buttonStyles.primary}
        >
          Tạo API key
        </button>
      </div>



      {createdKey && (
        <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                Tạo thành công
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0b0f0d]">
                API key đã sẵn sàng
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                API key đã được tạo thành công. Key sẽ được che mặc định trong
                danh sách, bạn có thể bấm biểu tượng con mắt để xem lại hoặc copy
                bất cứ lúc nào.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreatedKey(null)}
              className={buttonStyles.secondary}
            >
              Đóng
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <code className="break-all text-sm font-bold text-[#0b0f0d]">
              {createdKey}
            </code>

            <button
              type="button"
              onClick={() => handleCopy(createdKey)}
              className={`inline-flex items-center justify-center ${buttonStyles.primary}`}
            >
              {copiedKey === createdKey ? "Đã sao chép" : "Sao chép"}
            </button>
          </div>
        </div>
      )}

      <section className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-[#dfe5e1] bg-white p-6">
          <p className="text-sm font-semibold text-[#66736d]">
            Giới hạn API keys
          </p>
          <p className="mt-3 text-3xl font-bold tracking-[-0.8px] text-[#0b0f0d]">
            {totalActiveKeys}/{totalKeyLimit}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#66736d]">
            Tổng key đang hoạt động / tổng key được phép tạo
          </p>
        </div>
      </section>

      <div className="grid gap-6">
        <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0b0f0d]">
                Danh sách API key
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Đây là dữ liệu mẫu, sau này sẽ được lấy theo tài khoản người
                dùng.
              </p>
            </div>

            <div className="rounded-full bg-[#f7f8f6] px-4 py-2 text-sm font-semibold text-[#47524d]">
              {apiKeys.length} key
            </div>
          </div>

          <div className="space-y-4">
            {purchasedPlans.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl">
                  🔑
                </div>

                <h2 className="mt-5 text-xl font-bold text-amber-950">
                  Bạn cần mua credits trước
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-amber-800">
                  API key chỉ có thể được tạo theo dòng credits mà bạn đang sở
                  hữu. Hãy mua một gói CodexAI, Claude, Gemini hoặc DeepSeek để
                  bắt đầu.
                </p>

                <Link
                  href="/plans"
                  className={`mt-6 inline-flex items-center justify-center ${buttonStyles.warning}`}
                >
                  Mua credits
                </Link>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  🔐
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  Chưa có API key nào
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Tạo API key để bắt đầu sử dụng credits. Mỗi gói sẽ có giới hạn
                  số key tối đa theo cấp Trial, Mini, Plus, Pro, Max, Ultra hoặc
                  Enterprise.
                </p>

                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  disabled={availableFamiliesCanCreateKey.length === 0}
                  className={`mt-6 inline-flex items-center justify-center ${buttonStyles.primary}`}
                >
                  Tạo API key
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {apiKeys.map((item) => {
                  const isActive = item.status === "Đang hoạt động";

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#edf1ee] bg-white p-5 transition hover:border-[#cfd8d3]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-[#0b0f0d]">
                              {item.name}
                            </h3>

                            <span
                              className={
                                isActive
                                  ? "rounded-full bg-[#e9fbf6] px-3 py-1 text-xs font-bold text-[#057a60]"
                                  : "rounded-full bg-[#f1f2f1] px-3 py-1 text-xs font-bold text-[#66736d]"
                              }
                            >
                              {item.status}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                            <code className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
                              {visibleKeyIds.includes(item.id)
                                ? item.fullKey ?? item.keyPreview
                                : maskApiKey(item.fullKey, item.keyPreview)}
                            </code>

                            <button
                              type="button"
                              onClick={() => toggleKeyVisibility(item.id)}
                              className={buttonStyles.icon}
                              title={
                                visibleKeyIds.includes(item.id)
                                  ? "Ẩn API key"
                                  : "Hiện API key"
                              }
                            >
                              {visibleKeyIds.includes(item.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyApiKey(item)}
                              className={buttonStyles.icon}
                              title="Copy API key"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>

                          {copiedKeyId === item.id && (
                            <p className="mt-2 text-xs font-medium text-emerald-700">
                              Đã copy API key.
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={!isActive}
                            onClick={() => setRevokeTarget(item)}
                            className={
                              isActive
                                ? buttonStyles.danger
                                : buttonStyles.secondary
                            }
                          >
                            Thu hồi
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 rounded-2xl bg-[#f7f8f6] p-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                            Dòng AI
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                            {item.family}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                            Ngày tạo
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                            {item.createdAt}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                            Sử dụng gần nhất
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                            {item.lastUsed}
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

        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                Cần tích hợp API?
              </p>

              <h2 className="mt-2 text-lg font-bold text-slate-950">
                Xem tài liệu API đầy đủ
              </h2>

              <p className="mt-1 text-sm text-emerald-900">
                Xem endpoint chung, cách truyền API key, danh sách model và ví
                dụ gọi API.
              </p>
            </div>

            <Link
              href="/api-docs"
              className={`inline-flex items-center justify-center ${buttonStyles.primary}`}
            >
              Mở tài liệu API
            </Link>
          </div>
        </section>

        <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
          <h2 className="text-xl font-bold text-[#0b0f0d]">Lưu ý bảo mật</h2>

          <div className="mt-5 space-y-4">
            {[
              "Không chia sẻ API key công khai.",
              "Không đưa API key lên GitHub hoặc ảnh chụp màn hình.",
              "Nếu nghi ngờ key bị lộ, hãy thu hồi và tạo key mới.",
              "Theo dõi credits thường xuyên để phát hiện sử dụng bất thường.",
            ].map((note) => (
              <div key={note} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
                <p className="text-sm leading-6 text-[#47524d]">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe5e1] bg-[#0b0f0d] p-6 text-white">
          <h2 className="text-xl font-bold">Cần tạo key mới?</h2>

          <p className="mt-3 text-sm leading-6 text-white/72">
            Mỗi key nên dùng cho một công cụ hoặc một mục đích riêng để dễ
            quản lý và thu hồi khi cần.
          </p>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            disabled={!hasAnyPlan || availableFamiliesCanCreateKey.length === 0}
            className={`${buttonStyles.whiteOnGreen} mt-5 w-full`}
          >
            Tạo API key
          </button>
        </div>
      </div>

      {openCreateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <button
            type="button"
            aria-label="Đóng modal"
            onClick={() => setOpenCreateModal(false)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-xl rounded-[28px] border border-[#dfe5e1] bg-white p-6 shadow-[0_24px_80px_rgba(11,15,13,0.18)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#057a60]">
                  New API Key
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-[-0.5px] text-[#0b0f0d]">
                  Tạo API key mới
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#66736d]">
                  Đặt tên dễ nhớ để bạn biết key này dùng cho extension hoặc
                  công cụ nào.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenCreateModal(false)}
                className={buttonStyles.secondary}
              >
                Đóng
              </button>
            </div>

            {createError && (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {createError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateApiKey();
              }}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="keyName"
                  className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
                >
                  Tên API key
                </label>

                <input
                  id="keyName"
                  name="keyName"
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Ví dụ: Extension chính"
                  className="w-full rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] px-4 py-3 text-sm font-medium text-[#0b0f0d] outline-none transition placeholder:text-[#9aa6a0] focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="apiFamily"
                  className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
                >
                  Dòng credits sử dụng
                </label>

                <select
                  id="apiFamily"
                  name="apiFamily"
                  value={selectedFamily}
                  onChange={(event) => setSelectedFamily(event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#0d8f73]"
                >
                  {availableFamilies.map((family) => {
                    const activeCount = activeApiKeyCountByFamily[family] ?? 0;
                    const limit = apiKeyLimitByFamily[family] ?? 0;
                    const isFull = activeCount >= limit;

                    return (
                      <option key={family} value={family} disabled={isFull}>
                        {family} - {activeCount}/{limit} keys{" "}
                        {isFull ? "(đã đầy)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] p-4">
                <p className="text-sm font-bold text-[#0b0f0d]">
                  Lưu ý trước khi tạo key
                </p>

                <p className="mt-2 text-sm leading-6 text-[#66736d]">
                  API key chỉ nên dùng cho một công cụ hoặc một mục đích riêng.
                  Không chia sẻ key công khai hoặc đưa lên GitHub.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenCreateModal(false)}
                  className={buttonStyles.secondary}
                >
                  Hủy
                </button>

                <button
                  type="button"
                  onClick={handleCreateApiKey}
                  disabled={!keyName.trim() || !selectedFamily}
                  className={`flex items-center justify-center transition ${buttonStyles.primary}`}
                >
                  Tạo key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {revokeTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <button
            type="button"
            aria-label="Đóng modal"
            onClick={() => setRevokeTarget(null)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-lg rounded-[28px] border border-[#ffd7d7] bg-white p-6 shadow-[0_24px_80px_rgba(11,15,13,0.18)]">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b42318]">
                Xác nhận thu hồi
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-[-0.5px] text-[#0b0f0d]">
                Thu hồi API key này?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#66736d]">
                Sau khi thu hồi, key này sẽ không thể tiếp tục sử dụng với
                extension hoặc công cụ hỗ trợ. Hành động này nên được thực hiện
                khi key không còn dùng nữa hoặc nghi ngờ đã bị lộ.
              </p>
            </div>

            <div className="rounded-2xl border border-[#edf1ee] bg-[#f7f8f6] p-4">
              <p className="text-sm font-semibold text-[#0b0f0d]">
                {revokeTarget.name}
              </p>

              <p className="mt-2 font-mono text-sm font-bold text-[#47524d]">
                {revokeTarget.keyPreview}
              </p>

              <p className="mt-2 text-sm text-[#66736d]">
                Dòng credits: {revokeTarget.family}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                className={buttonStyles.secondary}
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleConfirmRevoke}
                className={`flex items-center justify-center transition ${buttonStyles.danger}`}
              >
                Xác nhận thu hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
