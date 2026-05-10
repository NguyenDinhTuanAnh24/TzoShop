"use client";

import { useEffect, useState } from "react";
import { 
  Server, 
  Plus, 
  Edit3, 
  Trash2, 
  Key, 
  Globe,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

type ProviderKey = {
  id: string;
  name: string;
  apiFamily: string;
  encryptedKey: string;
  baseUrl: string;
  status: "ACTIVE" | "DISABLED";
  priority: number;
  createdAt: string;
};

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, clearToast } = useToast();

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/providers");
      const result = await res.json();
      if (result.success) setProviders(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const maskKey = (key: string) => {
    if (key.length <= 12) return "••••••••••••";
    return `${key.slice(0, 6)}••••••••${key.slice(-4)}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={Server} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Provider Keys</h1>
            <p className="text-sm text-slate-500 font-medium">Quản lý các API key kết nối tới các nhà cung cấp AI (OpenAI, Anthropic...).</p>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-all shadow-lg shadow-slate-200">
          <Plus className="h-4 w-4" /> Thêm Provider
        </button>
      </div>

      {/* Warning Box */}
      <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6 flex gap-4">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-amber-900 uppercase tracking-tight">Bảo mật thông tin</h3>
          <p className="text-xs font-bold text-amber-700 mt-1 leading-5">
            Các API Key được lưu trữ trong database. Gateway sẽ tự động xoay vòng (round-robin) giữa các key đang ACTIVE.
            Ưu tiên (priority) cao hơn sẽ được chọn thường xuyên hơn.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></div>
        ) : providers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium italic border border-dashed border-slate-200 rounded-3xl">Chưa có provider nào.</div>
        ) : (
          providers.map((p) => (
            <div key={p.id} className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${p.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {p.status === "ACTIVE" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{p.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.apiFamily} · Priority {p.priority}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"><Edit3 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Key className="h-3 w-3 text-slate-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-600">{maskKey(p.encryptedKey)}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase">API Key</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600 truncate max-w-[180px]">{p.baseUrl}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase">Base URL</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Thêm ngày: {new Date(p.createdAt).toLocaleDateString()}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === "ACTIVE" ? "text-emerald-600" : "text-rose-600"}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))
        )}
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
