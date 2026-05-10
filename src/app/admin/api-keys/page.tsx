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
  Activity
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

  useEffect(() => {
    fetch("/api/admin/api-keys")
      .then(res => res.json())
      .then(result => {
        if (result.success) setKeys(result.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredKeys = keys.filter(k => 
    k.name.toLowerCase().includes(search.toLowerCase()) || 
    k.user.name.toLowerCase().includes(search.toLowerCase()) ||
    k.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={Key} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý API Keys</h1>
            <p className="text-sm text-slate-500 font-medium">Xem và quản lý API keys của tất cả người dùng.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 sm:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tên Key / User</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">API Family</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Prefix</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Trạng thái</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Lần dùng cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></td></tr>
              ) : filteredKeys.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">Không tìm thấy API Key nào.</td></tr>
              ) : (
                filteredKeys.map((k) => (
                  <tr key={k.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Key className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{k.name}</p>
                          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <User className="h-3 w-3" /> {k.user.name} ({k.user.email})
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 ring-1 ring-slate-200">
                        {k.apiFamily}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <code className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 font-mono">
                        {k.keyPrefix}
                      </code>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center">
                        {k.isActive ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-100">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 ring-1 ring-rose-100">
                            <XCircle className="h-3 w-3" /> Revoked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {k.lastUsedAt ? (
                        <div className="flex items-center justify-end gap-2 text-slate-500">
                          <Activity className="h-3 w-3 text-emerald-500" />
                          <span className="text-[11px] font-bold">{format(new Date(k.lastUsedAt), "HH:mm dd/MM", { locale: vi })}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Chưa dùng</span>
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
