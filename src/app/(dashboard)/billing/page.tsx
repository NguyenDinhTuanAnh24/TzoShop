"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

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

const orders: OrderItem[] = [
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

const statusFilters = [
  {
    label: "Tất cả",
    value: "all",
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

  const selectedPlanFromUrl = searchParams.get("plan");
  const selectedCreditsFromUrl = searchParams.get("credits");
  const selectedDurationFromUrl = searchParams.get("duration");
  const selectedPriceFromUrl = searchParams.get("price");

  const pendingOrderFromSelectedPlan =
    selectedPlanFromUrl && selectedCreditsFromUrl && selectedPriceFromUrl
      ? {
          id: "ORDER_NEW",
          plan: selectedPlanFromUrl,
          family: selectedPlanFromUrl.split(" ")[0],
          amount: selectedPriceFromUrl,
          credits: selectedCreditsFromUrl,
          status: "Chờ thanh toán",
          createdAt: "Vừa tạo",
          paidAt: "-",
          note: `Đơn hàng được tạo từ trang Mua credits. Thời hạn gói: ${
            selectedDurationFromUrl ?? "-"
          }.`,
        }
      : null;

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [payingOrder, setPayingOrder] = useState<OrderItem | null>(null);
  const [paidOrderIds, setPaidOrderIds] = useState<string[]>([]);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const baseDisplayedOrders = pendingOrderFromSelectedPlan
    ? [pendingOrderFromSelectedPlan, ...orders]
    : orders;

  const displayedOrders = baseDisplayedOrders.map((order) => {
    if (!paidOrderIds.includes(order.id)) {
      return order;
    }

    return {
      ...order,
      status: "Đã thanh toán",
      paidAt: "Vừa thanh toán",
      note: `${order.note ?? ""} Đơn hàng đã được xác nhận thanh toán trên giao diện thử nghiệm.`,
    };
  });

  const currentUrlOrder = pendingOrderFromSelectedPlan
    ? displayedOrders.find((order) => order.id === pendingOrderFromSelectedPlan.id)
    : null;

  function handleCheckPaymentStatus(order: OrderItem) {
    setCheckingPayment(true);

    window.setTimeout(() => {
      setPaidOrderIds((current) => {
        if (current.includes(order.id)) {
          return current;
        }

        return [...current, order.id];
      });

      const purchasedPlan = {
        id: order.id,
        name: order.plan,
        family: order.family,
        credits: order.credits,
        amount: order.amount,
        paidAt: new Date().toISOString(),
      };

      const currentPlans = JSON.parse(
        window.localStorage.getItem("tzoshop_purchased_plans") ?? "[]"
      );

      const exists = currentPlans.some(
        (plan: { id: string }) => plan.id === purchasedPlan.id
      );

      if (!exists) {
        window.localStorage.setItem(
          "tzoshop_purchased_plans",
          JSON.stringify([purchasedPlan, ...currentPlans])
        );
      }

      setCheckingPayment(false);
      setPayingOrder(null);
      setSelectedOrder(null);
      setStatusFilter("all");
    }, 1200);
  }

  const filteredOrders = displayedOrders.filter((order) => {
    if (statusFilter === "all") {
      return true;
    }

    return order.status === statusFilter;
  });

  const totalOrders = displayedOrders.length;
  const paidOrders = displayedOrders.filter(
    (order) => order.status === "Đã thanh toán"
  ).length;
  const pendingOrders = displayedOrders.filter(
    (order) => order.status === "Chờ thanh toán"
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
          className="rounded-full !bg-[#0b7a63] px-6 py-3 text-sm font-bold !text-white transition hover:opacity-90"
        >
          Mua credits
        </Link>
      </div>

      {currentUrlOrder && currentUrlOrder.status === "Chờ thanh toán" && (
        <div className="mb-8 rounded-3xl border border-[#0d8f73]/30 bg-[#f4fffb] p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#08745e]">
                Đơn hàng mới
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0b0f0d]">
                {currentUrlOrder.plan}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5f6b66]">
                Đơn hàng đã được tạo ở trạng thái chờ thanh toán. Kiểm tra lại thông
                tin trước khi tiếp tục.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPayingOrder(currentUrlOrder)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
            >
              Thanh toán ngay
            </button>
          </div>
        </div>
      )}

      {currentUrlOrder && currentUrlOrder.status === "Đã thanh toán" && (
        <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                Thanh toán thành công
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0b0f0d]">
                {currentUrlOrder.plan}
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Đơn hàng đã được xác nhận thanh toán. Credits sẽ được cộng vào tài
                khoản của bạn và có thể xem trong mục Gói của tôi.
              </p>
            </div>

            <Link
              href={`/my-plans?plan=${encodeURIComponent(
                currentUrlOrder.plan
              )}&credits=${encodeURIComponent(
                currentUrlOrder.credits
              )}&duration=${encodeURIComponent(
                selectedDurationFromUrl ?? "-"
              )}&family=${encodeURIComponent(currentUrlOrder.family)}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
            >
              Xem gói của tôi
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
              const isActive = statusFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
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
            {filteredOrders.map((order) => {
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
                            order.status,
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
                      className="rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
                    >
                      Xem chi tiết
                    </button>

                    {isPending && (
                      <button
                        type="button"
                        onClick={() => setPayingOrder(order)}
                        className="rounded-full !bg-[#0b7a63] px-4 py-2 text-sm font-bold !text-white transition hover:opacity-90"
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
              className="mt-5 inline-flex w-full items-center justify-center rounded-full !bg-white px-5 py-3 text-sm font-bold !text-[#0b0f0d]"
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

      {selectedOrder && (
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
                className="rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
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
                    setPayingOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
                >
                  Thanh toán tiếp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {payingOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-[560px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#08745e]">
                  Thanh toán đơn hàng
                </p>

                <h3 className="mt-2 text-2xl font-bold text-[#0b0f0d]">
                  {payingOrder.plan}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#5f6b66]">
                  Quét mã QR hoặc mở trang thanh toán. Sau khi PayOS xác nhận đã nhận tiền,
                  đơn hàng sẽ tự chuyển sang trạng thái đã thanh toán.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPayingOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-lg font-bold text-[#0b0f0d] transition hover:bg-[#f6f8f7]"
                aria-label="Đóng modal thanh toán"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#f6f8f7] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
                  Mã đơn
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b0f0d]">
                  {payingOrder.id}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6f8f7] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
                  Credits
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b0f0d]">
                  {payingOrder.credits}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6f8f7] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7a8782]">
                  Số tiền
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b0f0d]">
                  {payingOrder.amount}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[180px_1fr]">
              <div className="flex h-[180px] items-center justify-center rounded-3xl border border-dashed border-black/20 bg-[#f8fbfa]">
                <div className="text-center">
                  <div className="mx-auto grid h-24 w-24 grid-cols-4 gap-1 rounded-xl bg-white p-2 shadow-sm">
                    {Array.from({ length: 16 }).map((_, index) => (
                      <span
                        key={index}
                        className={`rounded-sm ${
                          index % 2 === 0 ? "bg-[#0b0f0d]" : "bg-[#dfe7e3]"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-xs font-semibold text-[#5f6b66]">
                    QR thử nghiệm
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white p-5">
                <p className="text-sm font-bold text-[#0b0f0d]">
                  Thông tin chuyển khoản thử nghiệm
                </p>

                <div className="mt-4 space-y-3 text-sm text-[#5f6b66]">
                  <div className="flex justify-between gap-4">
                    <span>Ngân hàng</span>
                    <span className="font-bold text-[#0b0f0d]">
                      PayOS Sandbox
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Chủ tài khoản</span>
                    <span className="font-bold text-[#0b0f0d]">TZOSHOP</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Nội dung</span>
                    <span className="font-bold text-[#0b0f0d]">
                      {payingOrder.id}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Số tiền</span>
                    <span className="font-bold text-[#0b0f0d]">
                      {payingOrder.amount}
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  Đây là mô phỏng luồng tự động. Ở bản thật, PayOS sẽ gửi webhook về hệ thống
                  sau khi nhận tiền. Nút “Kiểm tra trạng thái” hiện chỉ giả lập việc gọi API
                  kiểm tra đơn hàng.
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#0d8f73]/20 bg-[#f4fffb] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#0d8f73]" />

                <div>
                  <p className="text-sm font-bold text-[#0b0f0d]">
                    Đang chờ PayOS xác nhận
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#5f6b66]">
                    Sau khi người dùng quét QR và thanh toán thành công, hệ thống sẽ tự động
                    cập nhật trạng thái đơn hàng.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPayingOrder(null)}
                className="flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f6f8f7]"
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={() => handleCheckPaymentStatus(payingOrder)}
                disabled={checkingPayment}
                className="flex h-11 items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checkingPayment ? "Đang kiểm tra..." : "Kiểm tra trạng thái"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
