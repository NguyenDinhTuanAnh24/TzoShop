"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  Cpu, 
  User, 
  Key, 
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Terminal
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type UsageLog = {
  id: string;
  apiFamily: string;
  model: string;
  endpoint: string;
  totalTokens: number;
  creditsCharged: string | bigint;
  status: string;
  errorMessage?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  apiKey: {
    name: string;
    keyPrefix: string;
  };
};

export default function AdminUsagePage() {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsage = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/usage");
      const result = await res.json();
      if (result.success) setLogs(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "SUCCESS") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-500/10">
          <CheckCircle2 className="h-3 w-3" /> Success
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 ring-1 ring-rose-500/10">
        <XCircle className="h-3 w-3" /> Failed
      </span>
    );
  };

  const filteredLogs = logs.filter(log => 
    log.model.toLowerCase().includes(search.toLowerCase()) ||
    log.user.email.toLowerCase().includes(search.toLowerCase()) ||
    log.user.name.toLowerCase().includes(search.toLowerCase()) ||
    log.apiKey.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200 ring-4 ring-slate-50">
              <Activity className="h-8 w-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lịch sử sử dụng</h1>
              <p className="text-slate-500 font-bold mt-1">Theo dõi các lượt gọi API thời gian thực, mức tiêu thụ tokens và credits của người dùng.</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600 ring-1 ring-emerald-500/10">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Traffic
           </span>
        </div>
      </div>

      {/* Header & Filter */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo model, người dùng hoặc tên API key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <button 
            onClick={fetchUsage}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
            Làm mới
          </button>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all">
          <Filter className="h-4 w-4" /> 
          Lọc dữ liệu
        </button>
      </div>

      {/* Usage Table */}
      <div className="rounded-[40px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Thời gian</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Người dùng / API Key</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Model / API Family</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Tốc độ / Chi phí</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Đang tải lịch sử...</p>
                  </div>
                </td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 font-bold italic">Chưa có dữ liệu sử dụng hệ thống.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-2.5 text-slate-900">
                          <Clock className="h-4 w-4 text-slate-300" />
                          <span className="text-[12px] font-bold">{format(new Date(log.createdAt), "HH:mm:ss", { locale: vi })}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">{format(new Date(log.createdAt), "dd/MM", { locale: vi })}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-emerald-600 transition-all shadow-sm">
                             <User className="h-4 w-4" />
                          </div>
                          <div>
                             <p className="text-[13px] font-black text-slate-900 leading-tight">{log.user.name}</p>
                             <div className="flex items-center gap-1 mt-0.5 opacity-60">
                                <Key className="h-3 w-3 text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{log.apiKey.name} ({log.apiKey.keyPrefix})</p>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                             <Terminal className="h-4 w-4" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{log.model}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{log.apiFamily}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex flex-col items-center">
                          <div className="flex items-center gap-1.5 text-slate-900">
                             <Activity className="h-3.5 w-3.5 text-slate-300" />
                             <span className="text-sm font-black">{log.totalTokens.toLocaleString()} tokens</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-emerald-600">
                             <Zap className="h-3 w-3" />
                             <span className="text-[11px] font-black uppercase tracking-tighter">Charged: {log.creditsCharged.toString()}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end items-center gap-3">
                          {getStatusBadge(log.status)}
                          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                             <ChevronRight className="h-4 w-4" />
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
    </div>
  );
}
