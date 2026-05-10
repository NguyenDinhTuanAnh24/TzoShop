"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast, showToast, clearToast } = useToast(6000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showToast("Vui lòng nhập email.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message ?? "Đã có lỗi xảy ra.", "error");
      } else {
        setSent(true);
        showToast(
          data.message ?? "Nếu email tồn tại, hướng dẫn đã được gửi.",
          "success"
        );
      }
    } catch {
      showToast("Đã có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#0b0f0d]">
      <section className="flex min-h-screen items-center justify-center p-4 md:p-6">
        <div className="grid min-h-[720px] w-full max-w-7xl overflow-hidden rounded-[36px] border border-[#dfe5e1] bg-white shadow-[0_24px_80px_rgba(11,15,13,0.12)] lg:grid-cols-[1fr_1fr]">
          {/* Bên trái */}
          <div className="relative overflow-hidden bg-[linear-gradient(145deg,#064c3f_0%,#0b7a63_45%,#00b894_100%)] px-8 py-10 text-white md:px-14 md:py-14">
            <div className="relative z-10 flex h-full flex-col">
              <Link href="/" className="inline-flex w-fit items-center">
                <Image
                  src="/logo.png"
                  alt="TzoShop"
                  width={180}
                  height={48}
                  priority
                  className="h-12 w-auto rounded-xl bg-white/90 px-3 py-2"
                />
              </Link>

              <div className="mt-20 max-w-md">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                  Khôi phục tài khoản
                </p>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-1.2px] md:text-[56px] md:leading-[1.08]">
                  Lấy lại quyền truy cập tài khoản của bạn
                </h1>

                <p className="mt-5 text-base leading-7 text-white/82">
                  Nhập email đã đăng ký, hệ thống sẽ gửi hướng dẫn đặt lại mật
                  khẩu để bạn tiếp tục quản lý credits và API key.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">Kiểm tra đúng email</p>
                  <p className="mt-1 text-sm leading-6 text-white/78">
                    Hãy dùng email bạn đã đăng ký tài khoản TzoShop trước đó.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">Bảo mật tài khoản</p>
                  <p className="mt-1 text-sm leading-6 text-white/78">
                    Sau khi đổi mật khẩu, bạn nên kiểm tra lại API key và lịch
                    sử sử dụng nếu cần.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-10 text-sm text-white/75">
                Nhớ mật khẩu rồi?{" "}
                <Link
                  href="/login"
                  className="font-bold text-white underline underline-offset-4 transition hover:text-white/90"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>

            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-[#00382f]/35 blur-2xl" />
            <div className="pointer-events-none absolute bottom-20 right-10 h-32 w-32 rounded-full border border-white/15" />
          </div>

          {/* Bên phải */}
          <div className="flex items-center bg-white px-6 py-10 md:px-14 md:py-14">
            <div className="mx-auto w-full max-w-lg">
              {sent ? (
                /* Trạng thái đã gửi */
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-50 ring-1 ring-emerald-100">
                    <ShieldCheck className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#0b0f0d]">
                    Kiểm tra email của bạn
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-[#66736d]">
                    Nếu email <strong>{email}</strong> tồn tại trong hệ thống,
                    hướng dẫn đặt lại mật khẩu đã được gửi.
                  </p>
                  <p className="mt-2 text-sm text-[#9aa6a0]">
                    Không thấy email? Kiểm tra hộp thư rác hoặc thử lại sau vài phút.
                  </p>
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => { setSent(false); setEmail(""); }}
                      className="inline-flex w-full items-center justify-center rounded-full border border-[#dfe5e1] bg-white px-6 py-4 text-sm font-semibold text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
                    >
                      Gửi lại
                    </button>
                    <Link
                      href="/login"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full !bg-[#0b7a63] px-6 py-4 text-sm font-bold !text-white transition hover:opacity-90"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </div>
              ) : (
                /* Form nhập email */
                <>
                  <div className="mb-9 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00a982]">
                      Reset password
                    </p>
                    <h2 className="mt-3 text-5xl font-semibold tracking-[-1px] text-[#0b0f0d]">
                      Quên mật khẩu
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#66736d]">
                      Nhập email tài khoản, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a39c]" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập email đã đăng ký"
                          className="w-full rounded-full border border-[#dfe5e1] bg-[#f3f7f5] py-4 pl-11 pr-5 text-sm font-medium text-[#0b0f0d] outline-none transition placeholder:text-[#94a39c] focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex w-full items-center justify-center rounded-full !bg-[#0b7a63] px-6 py-4 text-base font-bold !text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        "Gửi hướng dẫn"
                      )}
                    </button>
                  </form>

                  <div className="mt-8 rounded-2xl border border-[#dfe5e1] bg-[#f7f8f6] p-5">
                    <p className="text-sm font-semibold text-[#0b0f0d]">Lưu ý</p>
                    <p className="mt-2 text-sm leading-6 text-[#66736d]">
                      Nếu không thấy email, hãy kiểm tra hộp thư rác hoặc thử lại
                      sau vài phút.
                    </p>
                  </div>

                  <p className="mt-7 text-center text-sm text-[#66736d]">
                    Đã nhớ mật khẩu?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-[#057a60] transition hover:text-[#00a982]"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {toast && (
        <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />
      )}
    </main>
  );
}
