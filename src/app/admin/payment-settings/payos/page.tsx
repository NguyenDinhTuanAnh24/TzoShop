"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard, 
  ShieldCheck, 
  KeyRound, 
  Save, 
  Activity,
  ChevronRight,
  Info,
  Shield,
  Zap
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

export default function PayOSSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    clientId: "",
    apiKey: "",
    checksumKey: "",
    apiKeyMasked: "",
    checksumKeyMasked: "",
    environment: "production",
    isActive: false,
  });

  const { toast, showToast, clearToast } = useToast();

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/payment-settings/payos");
      const result = await res.json();
      if (result.success) {
        setConfig({
          ...result.data,
          apiKey: "", // Không giữ key thật ở client state
          checksumKey: "",
        });
      }
    } catch (error) {
      showToast("Không thể tải cấu hình.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/payment-settings/payos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: config.clientId,
          apiKey: config.apiKey || undefined,
          checksumKey: config.checksumKey || undefined,
          environment: config.environment,
          isActive: config.isActive,
        }),
      });

      const result = await res.json();
      if (result.success) {
        showToast("Đã lưu cấu hình thành công.", "success");
        fetchConfig(); // Tải lại để cập nhật masked keys
      } else {
        throw new Error(result.error?.message || "Lỗi lưu cấu hình.");
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 placeholder:text-slate-300 placeholder:font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="text-sm font-bold text-slate-500">Đang tải cấu hình...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={CreditCard} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình PayOS</h1>
            <p className="text-sm text-slate-500 font-medium">Quản lý các tham số kết nối tới cổng thanh toán PayOS.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px] items-start">
        <div className="space-y-6">
          {/* Main Config Card */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-100">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <AppIcon icon={ShieldCheck} className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Thông tin API</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className={labelClasses}>Client ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                    <AppIcon icon={KeyRound} className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập Client ID từ PayOS Dashboard"
                    className={inputClasses + " pl-12"}
                    value={config.clientId}
                    onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className={labelClasses}>API Key</label>
                  <input
                    type="password"
                    placeholder={config.apiKeyMasked || "Nhập API Key"}
                    className={inputClasses}
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  />
                  {config.apiKeyMasked && (
                    <p className="mt-1.5 text-[10px] font-bold text-slate-400 italic ml-1">Đã cấu hình: {config.apiKeyMasked}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClasses}>Checksum Key</label>
                  <input
                    type="password"
                    placeholder={config.checksumKeyMasked || "Nhập Checksum Key"}
                    className={inputClasses}
                    value={config.checksumKey}
                    onChange={(e) => setConfig({ ...config, checksumKey: e.target.value })}
                  />
                  {config.checksumKeyMasked && (
                    <p className="mt-1.5 text-[10px] font-bold text-slate-400 italic ml-1">Đã cấu hình: {config.checksumKeyMasked}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Môi trường (Environment)</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setConfig({ ...config, environment: "sandbox" })}
                    className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all border ${
                      config.environment === "sandbox" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 ring-4 ring-emerald-50/50" 
                        : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${config.environment === "sandbox" ? "bg-emerald-500 animate-pulse" : "bg-slate-200"}`} />
                    Sandbox (Test)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, environment: "production" })}
                    className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all border ${
                      config.environment === "production" 
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                        : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${config.environment === "production" ? "bg-emerald-400 animate-pulse" : "bg-slate-200"}`} />
                    Production (Thật)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activation Card */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${config.isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                  <AppIcon icon={Zap} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Trạng thái cổng thanh toán</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Kích hoạt để cho phép khách hàng thanh toán qua PayOS.</p>
                </div>
              </div>
              <button
                onClick={() => setConfig({ ...config, isActive: !config.isActive })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-500 ${
                  config.isActive ? "bg-emerald-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    config.isActive ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-slate-900 px-10 py-4 text-sm font-black text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <AppIcon icon={Save} className="h-4 w-4" />
                  Lưu cấu hình
                </>
              )}
            </button>
            
            <button
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <AppIcon icon={Activity} className="h-4 w-4" />
              Kiểm tra kết nối
            </button>
          </div>
        </div>

        {/* Sidebar Help */}
        <aside className="space-y-6">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/30 p-6 ring-1 ring-emerald-100/50">
            <div className="flex items-center gap-2 mb-4">
              <AppIcon icon={Info} className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900">Hướng dẫn</h3>
            </div>
            <div className="space-y-4 text-xs font-bold text-slate-500 leading-6">
              <p>1. Đăng nhập vào <a href="https://dashboard.payos.vn" target="_blank" className="text-emerald-600 underline">PayOS Dashboard</a>.</p>
              <p>2. Copy <b>Client ID</b>, <b>API Key</b> và <b>Checksum Key</b> dán vào form bên cạnh.</p>
              <p>3. Chọn môi trường tương ứng (Sandbox để test, Production để chạy thật).</p>
              <p>4. Bật <b>Kích hoạt</b> và nhấn <b>Lưu cấu hình</b>.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AppIcon icon={Shield} className="h-5 w-5 text-slate-400" />
              <h3 className="text-lg font-black text-slate-900">Bảo mật</h3>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Tất cả các API Key đều được mã hóa bằng thuật toán <b>AES-256-GCM</b> trước khi lưu vào cơ sở dữ liệu. Chỉ hệ thống backend mới có quyền giải mã các thông tin này.
            </p>
          </div>
        </aside>
      </div>

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  );
}
