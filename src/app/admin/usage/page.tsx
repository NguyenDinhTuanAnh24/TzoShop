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
  Clock
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

  useEffect(() => {
    fetch("/api/admin/usage")
      .then(res => res.json())
      .then(result => {
        if (result.success) setLogs(result.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === "SUCCESS") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    return <XCircle className="h-4 w-4 text-rose-500" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={Activity} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lịch sử sử dụng hệ thống</h1>
            <p className="text-sm text-slate-500 font-medium">Theo dõi các lượt gọi API thời gian thực từ người dùng.</p>
          </div>
        </div>
      </div>

      {/* Usage Table */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Thời gian</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Người dùng / Key</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Model / API</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Tokens / Credits</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">Chưa có dữ liệu sử dụng.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-3 w-3 text-slate-300" />
                        <span className="text-[11px] font-bold">{format(new Date(log.createdAt), "HH:mm:ss dd/MM", { locale: vi })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 leading-none">{log.user.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Key className="h-3 w-3" /> {log.apiKey.name} ({log.apiKey.keyPrefix})
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs font-black text-slate-700">{log.model}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">{log.apiFamily}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="text-sm font-black text-slate-900">{log.totalTokens.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1 mt-1">
                        <Zap className="h-2.5 w-2.5" /> -{log.creditsCharged.toString()}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end items-center gap-2">
                        {log.status === "SUCCESS" ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-100">Success</span>
                        ) : (
                          <span className="inline-flex rounded-full bg-rose-50 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-rose-600 ring-1 ring-rose-100" title={log.errorMessage}>Failed</span>
                        )}
                        {getStatusIcon(log.status)}
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
