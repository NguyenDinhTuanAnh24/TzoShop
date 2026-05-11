"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Shield, 
  UserCheck,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  User,
  LayoutDashboard,
  ShieldAlert,
  ArrowUpDown,
  Wallet,
  Clock,
  LogOut,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
  totalCredits: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [me, setMe] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const { toast, showToast, clearToast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/users");
      const result = await res.json();
      if (result.success) setUsers(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetch("/api/profile").then(res => res.json()).then(data => {
      if (data.success) setMe(data.data);
    });
  }, []);

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    if (me?.id === userId) {
      showToast("Bạn không thể tự thay đổi quyền của chính mình.", "error");
      return;
    }

    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg = `Bạn có chắc chắn muốn đổi vai trò của người dùng này sang ${newRole}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole })
      });
      const result = await res.json();
      if (result.success) {
        showToast("Cập nhật vai trò thành công.", "success");
        fetchUsers();
      } else {
        showToast(result.error?.message || "Cập nhật thất bại.", "error");
      }
    } catch (error) {
      showToast("Lỗi hệ thống.", "error");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200 ring-4 ring-slate-50">
              <Users className="h-8 w-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Khách hàng</h1>
              <p className="text-slate-500 font-bold mt-1">Theo dõi tài khoản khách hàng, đơn hàng và số dư credits.</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600 ring-1 ring-blue-500/10">
              <ShieldCheck className="h-4 w-4" />
              RBAC System
           </span>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex h-12 items-center px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-black text-slate-400">
             Chế độ: Chỉ hiển thị Khách hàng
          </div>
          <button 
            onClick={fetchUsers}
            className="flex items-center justify-center h-12 w-12 rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-emerald-600 transition-all active:scale-95"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang hiển thị</p>
              <p className="text-sm font-black text-slate-900">{filteredUsers.length} khách hàng</p>
           </div>
           <button className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-black text-white hover:bg-black transition-all shadow-lg shadow-slate-200">
              Xuất CSV
           </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[40px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Khách hàng</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Vai trò</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Đơn hàng</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Số dư Credits</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Ngày gia nhập</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Đang đồng bộ dữ liệu...</p>
                  </div>
                </td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12 text-slate-200" />
                    <p className="text-sm font-bold text-slate-400 italic">Không tìm thấy kết quả phù hợp.</p>
                  </div>
                </td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Link 
                          href={`/admin/users/${user.id}`}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 text-sm font-black uppercase ring-2 ring-white shadow-sm hover:bg-white hover:text-emerald-600 transition-all active:scale-95"
                        >
                          {user.name[0].toUpperCase()}
                        </Link>
                        <div>
                          <Link 
                            href={`/admin/users/${user.id}`}
                            className="text-sm font-black text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            {user.name} {me?.id === user.id && <span className="text-[10px] font-black text-emerald-600 ml-1.5 uppercase tracking-tighter bg-emerald-50 px-1.5 py-0.5 rounded-md">BẠN</span>}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <Mail className="h-3.5 w-3.5 text-slate-300" />
                             <span className="text-[11px] font-bold text-slate-400">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex justify-center">
                          {user.role === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 ring-1 ring-blue-500/10">
                               <ShieldCheck className="h-3 w-3" />
                               Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-200">
                               User
                            </span>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-black text-slate-900">{user._count.orders}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Đơn hàng</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5">
                          <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-xs font-black text-emerald-700">
                             {new Intl.NumberFormat('vi-VN').format(Number(user.totalCredits))}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-[12px] font-bold">
                             {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: vi })}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/users/${user.id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all"
                          title="Xem chi tiết"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleUpdateRole(user.id, user.role)}
                          disabled={me?.id === user.id}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all disabled:opacity-0 disabled:cursor-not-allowed"
                          title="Đổi vai trò"
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </button>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200 transition-all">
                          <MoreVertical className="h-4 w-4" />
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
