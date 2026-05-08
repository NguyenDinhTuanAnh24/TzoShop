"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

type PurchasedPlan = {
  id: string;
  name: string;
  family: string;
  credits: string;
  amount: string;
  paidAt: string;
};

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



export default function ApiKeysPage() {
  const [purchasedPlans, setPurchasedPlans] = useState<PurchasedPlan[]>([]);

  useEffect(() => {
    const storedPlans = JSON.parse(
      window.localStorage.getItem("tzoshop_purchased_plans") ?? "[]"
    );

    setPurchasedPlans(storedPlans);
  }, []);

  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);

  function saveApiKeys(nextKeys: ApiKeyItem[]) {
    setApiKeys(nextKeys);
    window.localStorage.setItem("tzoshop_api_keys", JSON.stringify(nextKeys));
  }

  useEffect(() => {
    const storedKeys = JSON.parse(
      window.localStorage.getItem("tzoshop_api_keys") ?? "[]",
    );

    if (storedKeys.length > 0) {
      setApiKeys(storedKeys);
      return;
    }

    setApiKeys([
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
    ]);
  }, []);

  const availableFamilies = useMemo(() => {
    const families = purchasedPlans.map((plan) => plan.family);
    return Array.from(new Set(families));
  }, [purchasedPlans]);

  const hasAnyPlan = availableFamilies.length > 0;

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyItem | null>(null);

  useEffect(() => {
    if (!selectedFamily && availableFamilies.length > 0) {
      setSelectedFamily(availableFamilies[0]);
    }
  }, [availableFamilies, selectedFamily]);

  function handleCreateApiKey() {
    if (!keyName.trim() || !selectedFamily) {
      return;
    }

    const randomPart = Math.random().toString(36).slice(2, 18);
    const fullKey = `tz_live_${randomPart}_${Date.now().toString(36)}`;

    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: keyName.trim(),
      family: selectedFamily,
      keyPreview: `${fullKey.slice(0, 12)}••••••••${fullKey.slice(-4)}`,
      fullKey,
      status: "Đang hoạt động",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      lastUsed: "Chưa sử dụng",
    };

    saveApiKeys([newKey, ...apiKeys]);

    setCreatedKey(fullKey);
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
        </div>

        <button
          type="button"
          onClick={() => setOpenCreateModal(true)}
          disabled={!hasAnyPlan}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Tạo API key
        </button>
      </div>

      {!hasAnyPlan && (
        <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                Chưa có gói credits
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0b0f0d]">
                Bạn cần mua credits trước khi tạo API key
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                API key sẽ được gắn với dòng credits bạn đang sở hữu như
                CodexAI, Claude, Gemini hoặc DeepSeek.
              </p>
            </div>

            <Link
              href="/plans"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
            >
              Mua credits
            </Link>
          </div>
        </div>
      )}

      {createdKey && (
        <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                API key vừa tạo
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0b0f0d]">
                Lưu key này ngay
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Vì lý do bảo mật, key đầy đủ chỉ nên hiển thị một lần.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreatedKey(null)}
              className="rounded-full border border-[#cfd8d3] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
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
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#0d8f73] px-4 text-sm font-bold text-white transition hover:bg-[#08745e]"
            >
              {copiedKey === createdKey ? "Đã sao chép" : "Sao chép"}
            </button>
          </div>
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
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

                      <p className="mt-3 font-mono text-sm font-semibold text-[#47524d]">
                        {item.keyPreview}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.keyPreview)}
                        className="rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
                      >
                        {copiedKey === item.keyPreview
                          ? "Đã sao chép"
                          : "Sao chép"}
                      </button>

                      <button
                        type="button"
                        disabled={!isActive}
                        onClick={() => setRevokeTarget(item)}
                        className={
                          isActive
                            ? "rounded-full border border-[#ffd7d7] bg-white px-4 py-2 text-sm font-bold text-[#b42318] transition hover:bg-[#fff5f5]"
                            : "cursor-not-allowed rounded-full border border-[#edf1ee] bg-[#f7f8f6] px-4 py-2 text-sm font-bold text-[#9aa6a0]"
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
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Lưu ý bảo mật
            </h2>

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
              onClick={() => setOpenCreateModal(true)}
              disabled={!hasAnyPlan}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full !bg-white px-5 py-3 text-sm font-bold !text-[#0b0f0d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tạo API key
            </button>
          </div>
        </aside>
      </section>

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
                className="rounded-full border border-[#dfe5e1] bg-white px-3 py-1.5 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
              >
                Đóng
              </button>
            </div>

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
                  {availableFamilies.map((family) => (
                    <option key={family} value={family}>
                      {family}
                    </option>
                  ))}
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
                  className="rounded-full border border-[#dfe5e1] bg-white px-5 py-3 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  onClick={handleCreateApiKey}
                  disabled={!keyName.trim() || !selectedFamily}
                  className="flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-full border border-[#dfe5e1] bg-white px-5 py-3 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="rounded-full !bg-[#b42318] px-5 py-3 text-sm font-bold !text-white transition hover:opacity-90"
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
