"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getOrders,
  saveOrders,
  savePurchasedPlans,
  getPurchasedPlans,
  getApiKeyLimitForPlan,
  type StoredOrder,
} from "@/lib/mock-storage";
import { buttonStyles } from "@/lib/ui-styles";

type OrderItem = {
  id: string;
  plan: string;
  family: string;
  amount: string;
  credits: string;
  status: string;
  createdAt: string;
  paidAt: string;
  note?: string;
};

const summaryCards = [
  {
    label: "Tổng đơn hàng",
    value: "5",
    desc: "Tất cả đơn đã tạo",
  },
  {
    label: "Đã thanh toán",
    value: "3",
    desc: "Đơn đã cộng credits",
  },
  {
    label: "Chờ thanh toán",
    value: "1",
    desc: "Đơn cần hoàn tất thanh toán",
  },
  {
    label: "Tổng đã chi",
    value: "1.086.000đ",
    desc: "Tính trên đơn thành công",
  },
];

const initialOrders: StoredOrder[] = [
  {
    id: "ORD-20260508-001",
    plan: "CodexAI Plus",
    family: "CodexAI",
    amount: "139.000đ",
    credits: "1.000.000",
    status: "Đã thanh toán",
    createdAt: "08/05/2026, 10:20",
    paidAt: "08/05/2026, 10:23",
  },
  {
    id: "ORD-20260507-004",
    plan: "Claude Mini",
    family: "Claude",
    amount: "69.000đ",
    credits: "1.000.000",
    status: "Chờ thanh toán",
    createdAt: "07/05/2026, 21:10",
    paidAt: "-",
  },
  {
    id: "ORD-20260506-002",
    plan: "Gemini Pro",
    family: "Gemini",
    amount: "179.000đ",
    credits: "10.000.000",
    status: "Đã thanh toán",
    createdAt: "06/05/2026, 15:42",
    paidAt: "06/05/2026, 15:45",
  },
  {
    id: "ORD-20260502-009",
    plan: "DeepSeek Max",
    family: "DeepSeek",
    amount: "1.299.000đ",
    credits: "100.000.000",
    status: "Đã hủy",
    createdAt: "02/05/2026, 09:18",
    paidAt: "-",
  },
  {
    id: "ORD-20260429-011",
    plan: "CodexAI Trial",
    family: "CodexAI",
    amount: "19.000đ",
    credits: "100.000",
    status: "Đã thanh toán",
    createdAt: "29/04/2026, 18:30",
    paidAt: "29/04/2026, 18:32",
  },
];

function getStatusClass(status: string) {
  if (status === "Đã thanh toán") {
    return "bg-[#e9fbf6] text-[#057a60]";
  }

  if (status === "Chờ thanh toán") {
    return "bg-[#fff7e6] text-[#a15c00]";
  }

  return "bg-[#f1f2f1] text-[#66736d]";
}

function getFamilyFromPlanName(planName: string) {
  if (planName.toLowerCase().includes("codex")) return "CodexAI";
  if (planName.toLowerCase().includes("claude")) return "Claude";
  if (planName.toLowerCase().includes("gemini")) return "Gemini";
  if (planName.toLowerCase().includes("deepseek")) return "DeepSeek";

  return "Khác";
}

const statusFilters = [
  {
    label: "Tất cả",
    value: "Tất cả",
  },
  {
    label: "Đã thanh toán",
    value: "Đã thanh toán",
  },
  {
    label: "Chờ thanh toán",
    value: "Chờ thanh toán",
  },
  {
    label: "Đã hủy",
    value: "Đã hủy",
  },
];

export default function BillingPage() {
  const searchParams = useSearchParams();

  const planFromUrl = searchParams.get("plan");
  const creditsFromUrl = searchParams.get("credits");
  const durationFromUrl = searchParams.get("duration");
  const priceFromUrl = searchParams.get("price");
  const apiKeyLimitFromUrl = searchParams.get("apiKeyLimit");

  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  useEffect(() => {
    const storedOrders = getOrders();
    if (storedOrders.length > 0) {
      setOrders(storedOrders);
    } else {
      setOrders(initialOrders);
      saveOrders(initialOrders);
    }
  }, []);

  useEffect(() => {
    if (!planFromUrl || !creditsFromUrl || !priceFromUrl) return;

    const currentOrders = getOrders();

    const alreadyExists = currentOrders.some(
      (order: StoredOrder) =>
        order.plan === planFromUrl &&
        order.credits === creditsFromUrl &&
        order.amount === priceFromUrl &&
        order.status === "Chờ thanh toán"
    );

    if (alreadyExists) {
      setOrders(currentOrders);
      return;
    }

    const newOrder: StoredOrder = {
      id: `ORD-${Date.now()}`,
      plan: planFromUrl,
      family: getFamilyFromPlanName(planFromUrl),
      amount: priceFromUrl,
      credits: creditsFromUrl,
      duration: durationFromUrl ?? "-",
      apiKeyLimit: Number(apiKeyLimitFromUrl) || getApiKeyLimitForPlan(planFromUrl),
      status: "Chờ thanh toán",
      createdAt: "Vừa tạo",
    };

    const nextOrders = [newOrder, ...currentOrders];

    saveOrders(nextOrders);
    setOrders(nextOrders);
  }, [searchParams, planFromUrl, creditsFromUrl, priceFromUrl, durationFromUrl, apiKeyLimitFromUrl]);

  const displayedOrders = useMemo<StoredOrder[]>(() => {
    return orders.filter((order: StoredOrder) => {
      if (selectedStatus === "Tất cả") return true;
      return order.status === selectedStatus;
    });
  }, [orders, selectedStatus]);

  const latestPendingOrder = useMemo<StoredOrder | null>(() => {
    return orders.find((order: StoredOrder) => order.status === "Chờ thanh toán") ?? null;
  }, [orders]);

  const latestPaidOrder = useMemo<StoredOrder | null>(() => {
    return orders.find((order: StoredOrder) => order.status === "Đã thanh toán") ?? null;
  }, [orders]);

  function handleCheckPaymentStatus() {
    if (!selectedOrder) return;

    setIsCheckingPayment(true);

    window.setTimeout(() => {
      const paidAt = new Date().toISOString();

      const nextOrders = orders.map((order: StoredOrder) => {
        if (order.id !== selectedOrder.id) return order;

        return {
          ...order,
          status: "Đã thanh toán" as const,
          paidAt,
        };
      });

      setOrders(nextOrders);
      saveOrders(nextOrders);

      const purchasedPlans = getPurchasedPlans();

      const purchasedPlan = {
        id: selectedOrder.id,
        name: selectedOrder.plan,
        family: selectedOrder.family,
        credits: selectedOrder.credits,
        amount: selectedOrder.amount,
        duration: selectedOrder.duration ?? "-",
        apiKeyLimit:
          selectedOrder.apiKeyLimit ?? getApiKeyLimitForPlan(selectedOrder.plan),
        paidAt,
      };

      const alreadyPurchased = purchasedPlans.some(
        (plan) => plan.id === purchasedPlan.id
      );

      if (!alreadyPurchased) {
        savePurchasedPlans([purchasedPlan, ...purchasedPlans]);
      }

      setIsCheckingPayment(false);
      setSelectedOrder(null);
      setIsPaymentModalOpen(false);
      setSelectedStatus("Tất cả");
    }, 1200);
  }

  const filteredOrders = displayedOrders;

  const totalOrders = displayedOrders.length;
  const paidOrders = displayedOrders.filter(
    (order: StoredOrder) => order.status === "Đã thanh toán"
  ).length;
  const pendingOrders = displayedOrders.filter(
    (order: StoredOrder) => order.status === "Chờ thanh toán"
  ).length;

  const dynamicSummaryCards = [
    {
      label: "Tổng đơn hàng",
      value: String(totalOrders),
      desc: "Tất cả đơn đã tạo",
    },
    {
      label: "Đã thanh toán",
      value: String(paidOrders),
      desc: "Đơn đã cộng credits",
    },
    {
      label: "Chờ thanh toán",
      value: String(pendingOrders),
      desc: "Đơn cần hoàn tất thanh toán",
    },
    {
      label: "Tổng đã chi",
      value: "1.086.000đ",
      desc: "Tính trên đơn thành công",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#057a60]">
            Thanh toán
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-1px] text-[#0b0f0d]">
            Đơn hàng và thanh toán
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[#66736d]">
            Theo dõi đơn hàng mua credits, trạng thái thanh toán, số tiền và
            gói đã được cộng vào tài khoản.
          </p>
        </div>

        <Link
          href="/plans"
          className={`inline-flex items-center justify-center ${buttonStyles.primary}`}
        >
          Mua credits
        </Link>
      </div>

      {latestPendingOrder && (
        <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
                Đơn hàng mới
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-950">
                {latestPendingOrder.plan}
              </h2>

              <p className="mt-2 text-sm text-amber-800">
                {latestPendingOrder.credits} credits • {latestPendingOrder.amount}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedOrder(latestPendingOrder);
                setIsPaymentModalOpen(true);
              }}
              className={buttonStyles.warning}
            >
              Thanh toán ngay
            </button>
          </div>
        </section>
      )}

      {!latestPendingOrder && latestPaidOrder && (
        <section className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                Thanh toán thành công
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-950">
                {latestPaidOrder.plan}
              </h2>

              <p className="mt-2 text-sm text-emerald-800">
                Gói đã được kích hoạt và cộng vào tài khoản của bạn.
              </p>
            </div>

            <Link
              href="/my-plans"
              className={`inline-flex items-center justify-center ${buttonStyles.primary}`}
            >
              Xem gói của tôi
            </Link>
          </div>
        </section>
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

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0b0f0d]">
                Lịch sử đơn hàng
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Đây là dữ liệu mẫu. Sau này sẽ lấy từ đơn hàng thật trong
                database.
              </p>
            </div>

            <div className="rounded-full bg-[#f7f8f6] px-4 py-2 text-sm font-semibold text-[#47524d]">
              {filteredOrders.length} đơn
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const isActive = selectedStatus === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setSelectedStatus(filter.value)}
                  className={
                    isActive
                      ? "rounded-full border border-[#00d4a4] bg-[#e9fbf6] px-4 py-2 text-sm font-bold text-[#057a60]"
                      : "rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#47524d] transition hover:bg-[#f7f8f6] hover:text-[#0b0f0d]"
                  }
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {displayedOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  🧾
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  Chưa có đơn hàng nào
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Khi bạn chọn mua một gói credits, đơn hàng sẽ được tạo và hiển
                  thị tại đây.
                </p>

                <Link
                  href="/plans"
                  className={`mt-6 inline-flex items-center justify-center ${buttonStyles.primary}`}
                >
                  Mua credits
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order: StoredOrder) => {
                  const isPending = order.status === "Chờ thanh toán";

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-[#edf1ee] bg-white p-5 transition hover:border-[#cfd8d3]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="font-mono text-xs font-bold text-[#9aa6a0]">
                              {order.id}
                            </p>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <h3 className="mt-3 text-xl font-bold text-[#0b0f0d]">
                            {order.plan}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-[#66736d]">
                            Dòng credits: {order.family}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-2xl font-bold text-[#0b0f0d]">
                            {order.amount}
                          </p>

                          <p className="mt-1 text-sm text-[#66736d]">
                            {order.credits} credits
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 rounded-2xl bg-[#f7f8f6] p-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                            Ngày tạo
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                            {order.createdAt}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                            Thanh toán
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                            {order.paidAt}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                            Trạng thái
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#0b0f0d]">
                            {order.status}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={`flex items-center justify-center ${buttonStyles.secondary}`}
                        >
                          Xem chi tiết
                        </button>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsPaymentModalOpen(true);
                            }}
                            className={`flex items-center justify-center ${buttonStyles.primary}`}
                          >
                            Thanh toán tiếp
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#cfd8d3] bg-[#f7f8f6] p-8 text-center">
                    <p className="font-semibold text-[#0b0f0d]">
                      Không có đơn hàng phù hợp
                    </p>

                    <p className="mt-2 text-sm text-[#66736d]">
                      Hãy chọn trạng thái khác hoặc quay lại tất cả đơn hàng.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Trạng thái đơn hàng
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Đã thanh toán: đơn đã được xác nhận và credits đã cộng vào tài khoản.",
                "Chờ thanh toán: đơn đã tạo nhưng chưa hoàn tất thanh toán.",
                "Đã hủy: đơn không còn hiệu lực hoặc đã quá thời gian thanh toán.",
                "Nếu thanh toán xong nhưng chưa thấy credits, hãy kiểm tra lại sau vài phút.",
              ].map((note) => (
                <div key={note} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
                  <p className="text-sm leading-6 text-[#47524d]">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-[#0b0f0d] p-6 text-white">
            <h2 className="text-xl font-bold">Cần mua thêm credits?</h2>

            <p className="mt-3 text-sm leading-6 text-white/72">
              Bạn có thể quay lại bảng giá để chọn gói phù hợp với nhu cầu sử
              dụng hiện tại.
            </p>

            <Link
              href="/plans"
              className={`mt-5 inline-flex w-full items-center justify-center ${buttonStyles.secondary}`}
            >
              Xem bảng giá
            </Link>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Lưu ý thanh toán
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#66736d]">
              Trong giai đoạn thử nghiệm, một số đơn hàng có thể cần xác nhận
              thủ công trước khi credits được cộng vào tài khoản.
            </p>
          </div>
        </aside>
      </section>

      {selectedOrder && !isPaymentModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <button
            type="button"
            aria-label="Đóng modal"
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-2xl rounded-[28px] border border-[#dfe5e1] bg-white p-6 shadow-[0_24px_80px_rgba(11,15,13,0.18)]">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#057a60]">
                  Chi tiết đơn hàng
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-[-0.5px] text-[#0b0f0d]">
                  {selectedOrder.id}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#66736d]">
                  Thông tin chi tiết về gói credits và trạng thái thanh toán.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className={`flex items-center justify-center ${buttonStyles.secondary}`}
              >
                Đóng
              </button>
            </div>

            <div className="rounded-2xl border border-[#edf1ee] bg-[#f7f8f6] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#66736d]">
                    Gói đã chọn
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-[#0b0f0d]">
                    {selectedOrder.plan}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-[#66736d]">
                    Dòng credits: {selectedOrder.family}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#edf1ee] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                  Số tiền
                </p>
                <p className="mt-2 text-2xl font-bold text-[#0b0f0d]">
                  {selectedOrder.amount}
                </p>
              </div>

              <div className="rounded-2xl border border-[#edf1ee] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                  Credits
                </p>
                <p className="mt-2 text-2xl font-bold text-[#0b0f0d]">
                  {selectedOrder.credits}
                </p>
              </div>

              <div className="rounded-2xl border border-[#edf1ee] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                  Ngày tạo đơn
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b0f0d]">
                  {selectedOrder.createdAt}
                </p>
              </div>

              <div className="rounded-2xl border border-[#edf1ee] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6a0]">
                  Thời gian thanh toán
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b0f0d]">
                  {selectedOrder.paidAt}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] p-4">
              <p className="text-sm font-bold text-[#0b0f0d]">Ghi chú</p>

              <p className="mt-2 text-sm leading-6 text-[#66736d]">
                Nếu đơn hàng đã thanh toán nhưng credits chưa được cộng, hãy
                kiểm tra lại sau vài phút hoặc liên hệ hỗ trợ.
              </p>
            </div>

            {selectedOrder.status === "Chờ thanh toán" && (
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaymentModalOpen(true);
                    }}
                    className={`flex items-center justify-center ${buttonStyles.primary}`}
                  >
                    Thanh toán tiếp
                  </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isPaymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                  Thanh toán đơn hàng
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  {selectedOrder.plan}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Mã đơn: {selectedOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setIsPaymentModalOpen(false);
                }}
                className={`flex items-center justify-center ${buttonStyles.secondary}`}
              >
                Đóng
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-sm text-slate-500">Số credits</span>
                <span className="font-bold text-slate-950">
                  {selectedOrder.credits}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 py-3">
                <span className="text-sm text-slate-500">Số tiền</span>
                <span className="font-bold text-slate-950">
                  {selectedOrder.amount}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-slate-500">Trạng thái</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-500">
                QR thử nghiệm
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-950">
                Chuyển khoản thử nghiệm
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Nội dung: {selectedOrder.id}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setIsPaymentModalOpen(false);
                }}
                className={`flex items-center justify-center ${buttonStyles.secondary}`}
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleCheckPaymentStatus}
                disabled={isCheckingPayment}
                className={`flex items-center justify-center transition ${buttonStyles.primary}`}
              >
                {isCheckingPayment ? "Đang kiểm tra..." : "Kiểm tra trạng thái"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


