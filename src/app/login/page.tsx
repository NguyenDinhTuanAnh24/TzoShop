"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";
import { useRef } from "react";

// Component con sử dụng useSearchParams — phải bọc trong Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast, clearToast } = useToast(5000);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const hasHandledError = useRef(false);

  // Xử lý lỗi OAuth từ URL params
  useEffect(() => {
    if (hasHandledError.current) return;

    const error = searchParams.get("error");
    if (!error) return;

    const handleOAuthError = async () => {
      hasHandledError.current = true;

      if (error === "GoogleEmailExists") {
        // Clear session lỗi để tránh kẹt session "ảo"
        await signOut({ redirect: false });
        
        showToast(
          "Email này đã có tài khoản. Vui lòng đăng nhập bằng mật khẩu rồi liên kết Google trong Cài đặt.",
          "error"
        );
      } else if (error === "GoogleEmailNotVerified") {
        await signOut({ redirect: false });
        showToast("Email Google chưa được xác minh. Vui lòng thử lại.", "error");
      } else if (error === "OAuthCallback" || error === "OAuthSignin") {
        await signOut({ redirect: false });
        showToast("Đăng nhập Google thất bại. Vui lòng thử lại.", "error");
      }

      // Xóa query error khỏi URL để không bị lặp lại
      router.replace("/login");
    };

    handleOAuthError();
  }, [searchParams, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showToast("Vui lòng nhập đầy đủ email và mật khẩu.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("Đăng nhập thành công!", "success");
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      showToast("Đã có lỗi xảy ra.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#0b0f0d]">
      <section className="flex min-h-screen items-center justify-center p-4 md:p-6">
        <div className="grid min-h-[780px] w-full max-w-7xl overflow-hidden rounded-[36px] border border-[#dfe5e1] bg-white shadow-[0_24px_80px_rgba(11,15,13,0.12)] lg:grid-cols-[1fr_1fr]">
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
                  Chào mừng trở lại
                </p>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-1.2px] md:text-[56px] md:leading-[1.08]">
                  Tiếp tục quản lý credits và API key của bạn
                </h1>

                <p className="mt-5 text-base leading-7 text-white/82">
                  Đăng nhập để kiểm tra gói đang sử dụng, theo dõi số credits
                  còn lại và quản lý kết nối với các extension hoặc công cụ hỗ
                  trợ quen thuộc.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Theo dõi rõ ràng
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/78">
                    Kiểm tra credits, thời hạn gói và lịch sử sử dụng trong tài
                    khoản.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Quản lý an toàn hơn
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/78">
                    Tạo, sao chép và thu hồi API key khi cần thiết.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-10 text-sm text-white/75">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-bold text-white underline underline-offset-4 transition hover:text-white/90"
                >
                  Tạo tài khoản mới
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
              <div className="mb-9 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00a982]">
                  Welcome
                </p>

                <h2 className="mt-3 text-5xl font-semibold tracking-[-1px] text-[#0b0f0d]">
                  Đăng nhập
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#66736d]">
                  Nhập thông tin tài khoản để tiếp tục.
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

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-full border border-[#dfe5e1] bg-[#f3f7f5] px-5 py-4 text-sm font-medium text-[#0b0f0d] outline-none transition placeholder:text-[#94a39c] focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#0b0f0d]"
                  >
                    Mật khẩu
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-full border border-[#dfe5e1] bg-[#f3f7f5] px-5 py-4 text-sm font-medium text-[#0b0f0d] outline-none transition placeholder:text-[#94a39c] focus:border-[#00d4a4] focus:bg-white focus:ring-4 focus:ring-[#00d4a4]/10"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-[#66736d]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#cfd8d3] accent-[#00a982]"
                    />
                    Ghi nhớ đăng nhập
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#057a60] transition hover:text-[#00a982]"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-full !bg-[#0b7a63] px-6 py-4 text-base font-bold !text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#edf1ee]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa6a0]">
                  hoặc
                </span>
                <div className="h-px flex-1 bg-[#edf1ee]" />
              </div>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#dfe5e1] !bg-white px-6 py-4 text-base font-bold !text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Tiếp tục với Google
              </button>

              <p className="mt-7 text-center text-sm text-[#66736d]">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#057a60] transition hover:text-[#00a982]"
                >
                  Tạo tài khoản
                </Link>
              </p>

              <p className="mt-8 text-center text-xs leading-5 text-[#9aa6a0]">
                Bằng việc tiếp tục, bạn đồng ý sử dụng dịch vụ theo chính sách
                và điều khoản của TzoShop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
