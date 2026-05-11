"use client";

import { useEffect, useState } from "react";
import { 
  Key, 
  Search, 
  Filter, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Activity,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type ApiKeyItem = {
  id: string;
  name: string;
  apiFamily: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchKeys = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/api-keys");
      const result = await res.json();
      if (result.success) setKeys(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const filteredKeys = keys.filter(k => 
    k.name.toLowerCase().includes(search.toLowerCase()) || 
    k.user.name.toLowerCase().includes(search.toLowerCase()) ||
    k.user.email.toLowerCase().includes(search.toLowerCase()) ||
    k.keyPrefix.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search & Actions */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên key, email người dùng hoặc prefix..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <button 
            onClick={fetchKeys}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
            Làm mới
          </button>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all">
          <Filter className="h-4 w-4" /> 
          Lọc Key
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[40px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Tên Key / Chủ sở hữu</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">API Family</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Prefix</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Hoạt động cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Đang tải danh sách key...</p>
                  </div>
                </td></tr>
              ) : filteredKeys.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 font-bold italic">Không có API keys nào được tìm thấy.</td></tr>
              ) : (
                filteredKeys.map((k) => (
                  <tr key={k.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-emerald-600 transition-all shadow-sm ring-1 ring-slate-200">
                             <Key className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{k.name}</p>
                             <div className="flex items-center gap-1.5 mt-0.5">
                                <User className="h-3 w-3 text-slate-400" />
                                <p className="text-[11px] font-bold text-slate-400">{k.user.name} ({k.user.email})</p>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 tracking-widest uppercase ring-1 ring-inset ring-slate-200">
                          {k.apiFamily}
                        </span>
                    </td>
                    <td className="px-8 py-6">
                       <code className="text-[11px] font-mono font-black text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                          {k.keyPrefix}...
                       </code>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex justify-center">
                          {k.isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-500/10">Active</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 ring-1 ring-rose-500/10">Revoked</span>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       {k.lastUsedAt ? (
                          <div className="flex items-center justify-end gap-2.5 text-slate-900">
                             <Activity className="h-3.5 w-3.5 text-emerald-500" />
                             <span className="text-[12px] font-bold">{format(new Date(k.lastUsedAt), "HH:mm", { locale: vi })}</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{format(new Date(k.lastUsedAt), "dd/MM", { locale: vi })}</span>
                          </div>
                       ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Chưa sử dụng</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
