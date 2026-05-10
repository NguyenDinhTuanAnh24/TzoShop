"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Shield, 
  MoreVertical,
  ChevronRight,
  UserCheck,
  Calendar
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
    apiKeys: number;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(result => {
        if (result.success) setUsers(result.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={Users} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý người dùng</h1>
            <p className="text-sm text-slate-500 font-medium">Theo dõi và quản lý tài khoản người dùng trên hệ thống.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" /> Lọc
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng người dùng</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{users.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Mới hôm nay</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">+0</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tài khoản Admin</p>
          <p className="mt-1 text-2xl font-black text-blue-600">{users.filter(u => u.role === "ADMIN").length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Người dùng</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Vai trò</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Thống kê</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày gia nhập</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">Không tìm thấy người dùng nào.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-2 ring-white shadow-sm overflow-hidden font-black uppercase tracking-tighter">
                          {user.name[0]}{user.name.split(' ').pop()?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                            {user.name}
                            {user.role === "ADMIN" && <Shield className="h-3 w-3 text-blue-500" fill="currentColor" />}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 ring-1 ring-blue-100">Administrator</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-100">Customer</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Đơn hàng</p>
                          <p className="text-sm font-black text-slate-900">{user._count.orders}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">API Keys</p>
                          <p className="text-sm font-black text-slate-900">{user._count.apiKeys}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="h-4 w-4 text-slate-300" />
                        <span className="text-xs font-bold">{format(new Date(user.createdAt), "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-900 shadow-sm transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-black shadow-sm transition-all">
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
