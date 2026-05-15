"use client";

import { Suspense, type ChangeEvent, type FormEvent, useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-toast";
import { useConfirm } from "@/hooks/use-confirm";
import {
  UserRound,
  ShieldCheck,
  Bell,
  AlertTriangle,
  Save,
  LogOut,
  Link as LinkIcon,
  LockKeyhole,
  Camera,
  LifeBuoy,
  BookOpenText,
} from "lucide-react";
import { SettingsPageSkeleton } from "@/components/dashboard/settings/settings-page-skeleton";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { TextFadeInUp } from "@/components/animations/text-fade-in-up";

type NotificationSetting = {
  id: string;
  title: string;
  desc: string;
  enabled: boolean;
};

const initialNotifications: NotificationSetting[] = [
  {
    id: "lowCredits",
    title: "Cảnh báo credits thấp",
    desc: "Nhận thông báo khi credits sắp hết.",
    enabled: true,
  },
  {
    id: "paymentConfirm",
    title: "Xác nhận thanh toán",
    desc: "Nhận cập nhật khi đơn hàng được thanh toán.",
    enabled: true,
  },
  {
    id: "productUpdates",
    title: "Cập nhật sản phẩm",
    desc: "Nhận thông tin về tính năng hoặc gói credits mới.",
    enabled: false,
  },
];

type AuthMethods = {
  emailPassword: boolean;
  googleLinked: boolean;
  googleEmail: string | null;
};

function SettingsContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [notifications, setNotifications] = useState(initialNotifications);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [authMethods, setAuthMethods] = useState<AuthMethods>({
    emailPassword: true,
    googleLinked: false,
    googleEmail: null,
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const { toast, showToast, clearToast } = useToast(4000);
  const { confirmState, isConfirming, askConfirm, closeConfirm, handleConfirm } = useConfirm();

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/settings/auth-methods")
      .then((r) => r.json())
      .then((data) => {
        if (data.googleLinked !== undefined) setAuthMethods(data);
      })
      .catch(() => {});
  }, [status]);

  useEffect(() => {
    const googleLinked = searchParams.get("googleLinked");
    if (googleLinked === "success") {
      showToast("Đã liên kết Google thành công.", "success");
      window.history.replaceState({}, "", "/settings");
    } else if (googleLinked === "email_mismatch") {
      showToast("Email Google không trùng với tài khoản hiện tại.", "error");
      window.history.replaceState({}, "", "/settings");
    }
  }, [searchParams, showToast]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const acceptedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!acceptedTypes.includes(file.type)) {
      setAvatarError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP");
      showToast("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP", "error");
      event.target.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError("Ảnh đại diện tối đa 2MB");
      showToast("Ảnh đại diện tối đa 2MB", "error");
      event.target.value = "";
      return;
    }

    setAvatarError(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  };

  const handleLinkGoogle = () => {
    setIsLinkingGoogle(true);
    signIn("google", { callbackUrl: "/settings?googleLinked=callback" });
  };

  const handleToggleNotification = (id: string) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
    showToast("Đã cập nhật thông báo", "success");
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const profileName = String(formData.get("name") ?? "").trim();
    if (!profileName) {
      showToast("Không thể cập nhật. Vui lòng thử lại.", "error");
      return;
    }
    try {
      setIsSavingProfile(true);
      let nextAvatarUrl = session?.user?.image ?? undefined;

      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);

        const uploadRes = await fetch("/api/settings/avatar", {
          method: "POST",
          body: avatarFormData,
        });

        const uploadData = await uploadRes.json().catch(() => null);
        if (!uploadRes.ok || !uploadData?.avatarUrl) {
          console.error("Avatar upload failed:", uploadData);
          throw new Error(uploadData?.error || uploadData?.detail || "avatar_upload_failed");
        }
        nextAvatarUrl = uploadData.avatarUrl as string;
      }

      const saveRes = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName.trim(),
          avatarUrl: nextAvatarUrl,
        }),
      });

      const saveData = await saveRes.json().catch(() => null);
      if (!saveRes.ok || !saveData?.user) {
        throw new Error("profile_update_failed");
      }

      await update({
        name: saveData.user.name,
        email: saveData.user.email,
        image: saveData.user.image,
      });

      if (avatarFile) {
        showToast("Đã cập nhật ảnh đại diện", "success");
      } else {
        showToast("Đã lưu thay đổi", "success");
      }

      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      setAvatarFile(null);
      setAvatarError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (avatarFile) {
        showToast(message || "Không thể cập nhật ảnh đại diện", "error");
      } else {
        showToast("Không thể cập nhật. Vui lòng thử lại.", "error");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) return showToast("Mật khẩu mới tối thiểu 8 ký tự.", "error");
    if (newPassword !== confirmPassword) return showToast("Xác nhận mật khẩu không khớp.", "error");

    try {
      setIsChangingPassword(true);

      const res = await fetch("/api/settings/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Không thể đổi mật khẩu.");

      showToast("Đã lưu thay đổi", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Không thể cập nhật. Vui lòng thử lại.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAll = useCallback(() => {
    showToast("Đã đăng xuất khỏi tất cả thiết bị.", "success");
  }, [showToast]);

  if (status === "loading") {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="w-full space-y-6 pb-20" aria-busy={false}>
      <TextFadeInUp as="section" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Cài đặt
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Quản lý thông tin tài khoản, phương thức đăng nhập, thông báo và các tuỳ chọn bảo mật.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <CosmicButton href="/support">
              <LifeBuoy className="h-4 w-4" /> Hỗ trợ
            </CosmicButton>
            <CosmicButton href="/api-docs" variant="secondary">
              <BookOpenText className="h-4 w-4" /> Tài liệu API
            </CosmicButton>
          </div>
        </div>
      </TextFadeInUp>

      <div className="space-y-6">
          <TextFadeInUp as="section" id="profile" delay={0.04} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-32px_rgba(79,70,229,0.22)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Thông tin cá nhân
                </h2>
                <p className="mt-1 text-base leading-7 text-slate-600">
                  Cập nhật tên hiển thị và ảnh đại diện của bạn.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-indigo-50 text-2xl font-extrabold uppercase text-indigo-600"
                      aria-label="Đổi ảnh đại diện"
                    >
                      {avatarPreview || session?.user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarPreview ?? session?.user?.image ?? ""} alt="Ảnh đại diện" className="h-full w-full object-cover" />
                      ) : (
                        <span>{(session?.user?.name?.[0] ?? "U").toUpperCase()}</span>
                      )}
                      
                      <div className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-indigo-50 hover:text-indigo-700">
                        <Camera className="h-4 w-4" />
                      </div>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Ảnh đại diện
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Khuyến nghị ảnh vuông, tối đa 2MB.
                    </p>
                    {avatarFile ? (
                      <p className="mt-2 inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        Đã chọn ảnh mới, bấm Lưu thay đổi để cập nhật.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {avatarError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{avatarError}</div>
              ) : null}

              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-slate-500">Họ tên</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={session?.user?.name || ""}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-slate-500">Email đăng nhập</label>
                  <input
                    type="email"
                    readOnly
                    value={session?.user?.email || ""}
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-500"
                  />
                  <p className="text-xs text-slate-500">Email được dùng để đăng nhập và nhận thông báo quan trọng.</p>
                </div>
              </div>

              <div className="mt-7 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSavingProfile}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(79,70,229,0.45)] transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </TextFadeInUp>

          <TextFadeInUp as="section" id="auth" delay={0.06} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-32px_rgba(79,70,229,0.22)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Phương thức đăng nhập
                </h2>
                <p className="mt-1 text-base leading-7 text-slate-600">
                  Quản lý cách bạn đăng nhập vào TzoShop.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-indigo-200 hover:bg-indigo-50/20 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">Email & mật khẩu</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">Đăng nhập bằng email và mật khẩu.</p>
                  </div>
                </div>
                <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Đang kết nối
                </span>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-indigo-200 hover:bg-indigo-50/20 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">Google</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {authMethods.googleLinked && authMethods.googleEmail
                        ? authMethods.googleEmail
                        : "Liên kết Google để đăng nhập nhanh hơn."}
                    </p>
                  </div>
                </div>

                {authMethods.googleLinked ? (
                  <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Đã liên kết
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleLinkGoogle}
                    disabled={isLinkingGoogle}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700 active:scale-[0.98] disabled:opacity-60"
                  >
                    {isLinkingGoogle ? "Đang kết nối..." : "Kết nối Google"}
                  </button>
                )}
              </div>
            </div>
          </TextFadeInUp>

          <TextFadeInUp as="section" id="notifications" delay={0.08} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-32px_rgba(79,70,229,0.22)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Thông báo
                </h2>
                <p className="mt-1 text-base leading-7 text-slate-600">
                  Chọn các loại thông báo bạn muốn nhận từ TzoShop.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {notifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-5 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/20">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={item.enabled}
                    onClick={() => handleToggleNotification(item.id)}
                    className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      item.enabled
                        ? "border-indigo-500/30 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_10px_24px_-12px_rgba(79,70,229,0.75)]"
                        : "border-slate-200 bg-slate-200 hover:bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ease-out ${
                        item.enabled ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </TextFadeInUp>

          <TextFadeInUp as="section" id="security" delay={0.1} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_60px_-32px_rgba(79,70,229,0.22)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Bảo mật
                </h2>
                <p className="mt-1 text-base leading-7 text-slate-600">
                  Các tùy chọn giúp bảo vệ tài khoản và API key của bạn.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-base font-bold text-slate-950">Đặt lại mật khẩu</p>
                <p className="mt-1 text-sm text-slate-600">Cập nhật mật khẩu đăng nhập để tăng cường bảo mật.</p>

                <form onSubmit={handleChangePassword} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <input
                      type="password"
                      placeholder="Mật khẩu hiện tại"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <input
                      type="password"
                      placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isChangingPassword}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(79,70,229,0.45)] transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isChangingPassword ? "Đang lưu..." : "Đổi mật khẩu"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-base font-bold text-slate-950">API key</p>
                <p className="mt-1 text-sm text-slate-600">Quản lý, sao chép hoặc thu hồi API key trong trang API Keys.</p>
                <CosmicButton href="/api-keys" variant="secondary" className="mt-4">Quản lý API keys</CosmicButton>
              </div>
            </div>
          </TextFadeInUp>

          <TextFadeInUp as="section" id="danger" delay={0.12} className="rounded-3xl border border-rose-200 bg-rose-50/60 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-rose-700">
                  Vùng nguy hiểm
                </h2>
                <p className="mt-1 text-base leading-7 text-rose-700/80">
                  Các hành động này có thể ảnh hưởng trực tiếp đến tài khoản của bạn.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-rose-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-950">Đăng xuất</h3>
                <p className="mt-1 text-sm text-slate-600">Kết thúc phiên hiện tại trên các thiết bị khác.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  askConfirm({
                    title: "Đăng xuất?",
                    description: "Bạn sẽ cần đăng nhập lại trên các thiết bị khác.",
                    confirmLabel: "Đăng xuất",
                    cancelLabel: "Hủy",
                    type: "danger",
                    onConfirm: handleLogoutAll,
                  })
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-6 text-sm font-semibold text-rose-700 transition-all duration-200 hover:bg-rose-50 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" /> Đăng xuất
              </button>
            </div>
          </TextFadeInUp>
      </div>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}

      {confirmState && (
        <ConfirmDialog
          open={!!confirmState}
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel}
          cancelLabel={confirmState.cancelLabel}
          type={confirmState.type}
          isLoading={isConfirming}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
