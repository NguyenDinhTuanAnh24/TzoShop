"use client";

import { useEffect, useState } from "react";
import { 
  Cpu, 
  Plus, 
  Search, 
  Edit3, 
  ToggleLeft, 
  ToggleRight,
  Database,
  ArrowUpDown,
  Tag
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

type AiModel = {
  id: string;
  publicName: string;
  upstreamName: string;
  apiFamily: string;
  inputCreditMultiplier: number;
  outputCreditMultiplier: number;
  isActive: boolean;
};

export default function AdminModelsPage() {
  const [models, setModels] = useState<AiModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast, showToast, clearToast } = useToast();

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/models");
      const result = await res.json();
      if (result.success) setModels(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/models", {
        method: "PATCH",
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const result = await res.json();
      if (result.success) {
        showToast(`Đã ${!currentStatus ? "kích hoạt" : "tạm dừng"} model.`, "success");
        fetchModels();
      }
    } catch (error) {
      showToast("Không thể cập nhật trạng thái.", "error");
    }
  };

  const filteredModels = models.filter(m => 
    m.publicName.toLowerCase().includes(search.toLowerCase()) || 
    m.upstreamName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={Cpu} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình AI Models</h1>
            <p className="text-sm text-slate-500 font-medium">Quản lý danh sách các dòng AI và hệ số nhân credits.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên public, upstream..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-all shadow-lg shadow-slate-200">
            <Plus className="h-4 w-4" /> Thêm Model
          </button>
        </div>
      </div>

      {/* Models Table */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Model Info</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">API Family</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Multipliers</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Trạng thái</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></td></tr>
              ) : filteredModels.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">Chưa có model nào.</td></tr>
              ) : (
                filteredModels.map((model) => (
                  <tr key={model.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Database className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{model.publicName}</p>
                          <p className="text-[10px] font-bold text-slate-400 font-mono italic">{model.upstreamName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 ring-1 ring-slate-200">
                        {model.apiFamily}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-4">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Input</p>
                          <p className="text-xs font-bold text-slate-700">{model.inputCreditMultiplier}x</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Output</p>
                          <p className="text-xs font-bold text-slate-700">{model.outputCreditMultiplier}x</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => handleToggleActive(model.id, model.isActive)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                          model.isActive 
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" 
                            : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                        }`}
                      >
                        {model.isActive ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                        {model.isActive ? "Hoạt động" : "Tạm dừng"}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-900 shadow-sm transition-all">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
