"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

const initialNotifications = [
  {
    id: "lowCredits",
    title: "Cảnh báo credits thấp",
    desc: "Nhận thông báo khi credits gần hết.",
    enabled: true,
  },
  {
    id: "paymentConfirm",
    title: "Xác nhận thanh toán",
    desc: "Nhận thông báo khi đơn hàng được thanh toán thành công.",
    enabled: true,
  },
  {
    id: "productUpdates",
    title: "Cập nhật sản phẩm",
    desc: "Nhận thông tin cập nhật về gói credits và tính năng mới.",
    enabled: false,
  },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [profileSaved, setProfileSaved] = useState(false);
  const [openLogoutAllModal, setOpenLogoutAllModal] = useState(false);
  const [logoutAllDone, setLogoutAllDone] = useState(false);
  const [purchasedPlans, setPurchasedPlans] = useState<any[]>([]);

  useEffect(() => {
    const storedPlans = JSON.parse(
      window.localStorage.getItem("tzoshop_purchased_plans") ?? "[]",
    );
    setPurchasedPlans(storedPlans);
  }, []);

  const availableFamilies = useMemo(() => {
    const families = purchasedPlans.map((plan) => plan.family);
    return Array.from(new Set(families));
  }, [purchasedPlans]);

  const hasAnyPlan = availableFamilies.length > 0;

  function handleToggleNotification(id: string) {
    setNotifications((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    );
  }

  function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProfileSaved(true);

    window.setTimeout(() => {
      setProfileSaved(false);
    }, 2500);
  }

  function handleConfirmLogoutAll() {
    setOpenLogoutAllModal(false);
    setLogoutAllDone(true);

    window.setTimeout(() => {
      setLogoutAllDone(false);
    }, 3000);
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#057a60]">
          Cài đặt
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-[-1px] text-[#0b0f0d]">
          Cài đặt tài khoản
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-[#66736d]">
          Quản lý thông tin cá nhân, bảo mật tài khoản, thông báo và các tuỳ
          chọn liên quan đến quá trình sử dụng TzoShop.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0b0f0d]">
                Thông tin cá nhân
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Cập nhật tên hiển thị và thông tin cơ bản của tài khoản.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9fbf6] text-2xl font-black text-[#057a60]">
                  TZ
                </div>

                <div>
                  <button
                    type="button"
                    className="rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
                  >
                    Đổi avatar
                  </button>

                  <p className="mt-2 text-sm text-[#66736d]">
                    Khuyến nghị ảnh vuông, dung lượng nhỏ.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
                  >
                    Họ và tên
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    defaultValue="Nguyễn Văn A"
                    className="w-full rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] px-4 py-3 text-sm font-medium text-[#0b0f0d] outline-none transition focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
                  >
                    Email đăng nhập
                  </label>

                  <input
                    id="email"
                    type="email"
                    disabled
                    defaultValue="user@example.com"
                    className="w-full cursor-not-allowed rounded-2xl border border-[#dfe5e1] bg-[#edf1ee] px-4 py-3 text-sm font-medium text-[#66736d] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                {profileSaved ? (
                  <p className="text-sm font-semibold text-[#057a60]">
                    Thông tin cá nhân đã được cập nhật.
                  </p>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className={
                    profileSaved
                      ? "rounded-full !bg-[#0b7a63] px-5 py-3 text-sm font-bold !text-white transition"
                      : "rounded-full !bg-[#0b7a63] px-5 py-3 text-sm font-bold !text-white transition hover:opacity-90"
                  }
                >
                  {profileSaved ? "Đã lưu" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0b0f0d]">
                Phương thức đăng nhập
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Quản lý các phương thức dùng để truy cập tài khoản.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#edf1ee] bg-[#f7f8f6] p-4">
                <div>
                  <p className="font-bold text-[#0b0f0d]">
                    Email và mật khẩu
                  </p>

                  <p className="mt-1 text-sm text-[#66736d]">
                    Đang được sử dụng cho tài khoản này.
                  </p>
                </div>

                <span className="rounded-full bg-[#e9fbf6] px-3 py-1 text-xs font-bold text-[#057a60]">
                  Đã kết nối
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#edf1ee] bg-white p-4">
                <div>
                  <p className="font-bold text-[#0b0f0d]">Google</p>

                  <p className="mt-1 text-sm text-[#66736d]">
                    Kết nối Google để đăng nhập nhanh hơn.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-[#dfe5e1] bg-white px-4 py-2 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
                >
                  Kết nối
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0b0f0d]">
                Thông báo
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Chọn những thông báo bạn muốn nhận trong quá trình sử dụng.
              </p>
            </div>

            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#edf1ee] bg-[#f7f8f6] p-4"
                >
                  <div>
                    <p className="font-bold text-[#0b0f0d]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#66736d]">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleNotification(item.id)}
                    aria-pressed={item.enabled}
                    className={
                      item.enabled
                        ? "relative h-8 w-14 rounded-full bg-[#0b7a63] transition"
                        : "relative h-8 w-14 rounded-full bg-[#cfd8d3] transition"
                    }
                  >
                    <span
                      className={
                        item.enabled
                          ? "absolute right-1 top-1 h-6 w-6 rounded-full bg-white transition-all"
                          : "absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all"
                      }
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ffd7d7] bg-white p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#b42318]">
                Vùng nguy hiểm
              </h2>

              <p className="mt-1 text-sm text-[#66736d]">
                Các thao tác trong khu vực này có thể ảnh hưởng đến tài khoản.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ffd7d7] bg-[#fff5f5] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#0b0f0d]">
                    Đăng xuất khỏi tất cả thiết bị
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#66736d]">
                    Dùng khi bạn nghi ngờ tài khoản đang được đăng nhập ở nơi
                    không mong muốn.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenLogoutAllModal(true)}
                  className="rounded-full border border-[#ffd7d7] bg-white px-4 py-2 text-sm font-bold text-[#b42318] transition hover:bg-[#fff5f5]"
                >
                  Đăng xuất tất cả
                </button>
              </div>
            </div>

            {logoutAllDone && (
              <div className="mt-4 rounded-2xl border border-[#dfe5e1] bg-[#e9fbf6] p-4">
                <p className="text-sm font-semibold text-[#057a60]">
                  Đã gửi yêu cầu đăng xuất khỏi tất cả thiết bị.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Hồ sơ tài khoản
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-[#66736d]">Trạng thái</p>
                <p className="mt-1 font-bold text-[#057a60]">
                  Đang hoạt động
                </p>
              </div>

              <div>
                <p className="text-sm text-[#66736d]">Vai trò</p>
                <p className="mt-1 font-bold text-[#0b0f0d]">
                  Người dùng
                </p>
              </div>

              <div>
                <p className="text-sm text-[#66736d]">Ngày tạo</p>
                <p className="mt-1 font-bold text-[#0b0f0d]">
                  08/05/2026
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-[#0b0f0d] p-6 text-white">
            <h2 className="text-xl font-bold">Bảo vệ API key</h2>

            <p className="mt-3 text-sm leading-6 text-white/72">
              Nếu bạn thay đổi mật khẩu hoặc nghi ngờ tài khoản bị truy cập lạ,
              hãy kiểm tra lại danh sách API key đang hoạt động.
            </p>

            <a
              href="/api-keys"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full !bg-white px-5 py-3 text-sm font-bold !text-[#0b0f0d]"
            >
              Quản lý API key
            </a>
          </div>

          <div className="rounded-2xl border border-[#dfe5e1] bg-white p-6">
            <h2 className="text-xl font-bold text-[#0b0f0d]">
              Lưu ý
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#66736d]">
              Một số thay đổi bảo mật có thể yêu cầu bạn đăng nhập lại để đảm
              bảo tài khoản được bảo vệ tốt hơn.
            </p>
          </div>
        </aside>
      </section>

      {openLogoutAllModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <button
            type="button"
            aria-label="Đóng modal"
            onClick={() => setOpenLogoutAllModal(false)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-lg rounded-[28px] border border-[#ffd7d7] bg-white p-6 shadow-[0_24px_80px_rgba(11,15,13,0.18)]">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b42318]">
                Xác nhận bảo mật
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-[-0.5px] text-[#0b0f0d]">
                Đăng xuất khỏi tất cả thiết bị?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#66736d]">
                Hành động này sẽ yêu cầu các phiên đăng nhập khác đăng nhập lại.
                Bạn nên dùng khi nghi ngờ tài khoản đang được truy cập ở thiết
                bị không mong muốn.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ffd7d7] bg-[#fff5f5] p-4">
              <p className="text-sm font-bold text-[#0b0f0d]">
                Lưu ý trước khi tiếp tục
              </p>

              <p className="mt-2 text-sm leading-6 text-[#66736d]">
                Các API key hiện có chưa bị thu hồi bởi thao tác này. Nếu nghi
                ngờ API key bị lộ, hãy kiểm tra thêm trong trang API Keys.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenLogoutAllModal(false)}
                className="rounded-full border border-[#dfe5e1] bg-white px-5 py-3 text-sm font-bold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleConfirmLogoutAll}
                className="rounded-full !bg-[#b42318] px-5 py-3 text-sm font-bold !text-white transition hover:opacity-90"
              >
                Xác nhận đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
