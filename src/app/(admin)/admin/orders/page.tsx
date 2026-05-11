"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreHorizontal,
  FileText,
  CreditCard,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Inbox,
  LayoutDashboard,
  ArrowRight,
  AlertCircle,
  Calendar,
  Zap,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { formatVnd } from "@/lib/format";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

type OrderItem = {
  id: string;
  orderCode: string;
  amountVnd: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  user: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    apiFamily: string;
  };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterFamily, setFilterFamily] = useState("ALL");
  const [search, setSearch] = useState("");
  const { toast, showToast, clearToast } = useToast();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const url = filterStatus === "ALL" 
        ? "/api/admin/orders" 
        : `/api/admin/orders?status=${filterStatus}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!window.confirm(`Xác nhận đổi trạng thái đơn hàng sang ${newStatus}?`)) return;

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        showToast("Đã cập nhật trạng thái đơn hàng.", "success");
        fetchOrders();
      }
    } catch (error) {
      showToast("Không thể cập nhật trạng thái.", "error");
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    try {
      showToast("Đang kiểm tra với PayOS...", "info");
      const res = await fetch(`/api/admin/orders/${orderId}/verify`, {
        method: "POST"
      });
      const result = await res.json();
      if (result.success) {
        showToast(result.message, result.status === "PAID" ? "success" : "info");
        if (result.status === "PAID") fetchOrders();
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      showToast("Lỗi khi gọi API kiểm tra.", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": 
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-500/10">PAID</span>;
      case "PENDING": 
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 ring-1 ring-amber-500/10">PENDING</span>;
      case "CANCELLED": 
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 ring-1 ring-rose-500/10">CANCELLED</span>;
      case "EXPIRED": 
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-200">EXPIRED</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 ring-1 ring-slate-200">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderCode.toLowerCase().includes(search.toLowerCase()) || 
                         o.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFamily = filterFamily === "ALL" || o.product.apiFamily === filterFamily;
    return matchesSearch && matchesFamily;
  });

  const families = Array.from(new Set(orders.map(o => o.product.apiFamily)));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200 ring-4 ring-slate-50">
              <ShoppingCart className="h-8 w-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Đơn hàng</h1>
              <p className="text-slate-500 font-bold mt-1">Theo dõi đơn mua credits, thanh toán và trạng thái kích hoạt gói.</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right mr-4 hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng doanh thu</p>
              <p className="text-xl font-black text-emerald-600">
                {formatVnd(orders.reduce((acc, o) => o.status === "PAID" ? acc + o.amountVnd : acc, 0))}
              </p>
           </div>
           <button 
              onClick={fetchOrders}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
           >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Mã đơn hàng hoặc email khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 outline-none focus:border-emerald-500 transition-all appearance-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
          <select 
            value={filterFamily}
            onChange={(e) => setFilterFamily(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 outline-none focus:border-emerald-500 transition-all appearance-none"
          >
            <option value="ALL">Tất cả dòng AI</option>
            {families.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all">
          <Calendar className="h-4 w-4" /> 
          Lọc thời gian
        </button>
      </div>

      {/* Orders Table */}
      <div className="rounded-[40px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Mã đơn</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Khách hàng</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Gói / Family</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Số tiền</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Trạng thái</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Thời gian</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={7} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Đang tải đơn hàng...</p>
                  </div>
                </td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Inbox className="h-12 w-12 text-slate-200" />
                    <p className="text-sm font-bold italic">Chưa có đơn hàng phù hợp.</p>
                  </div>
                </td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <Link 
                            href={`/admin/orders/${order.id}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-white hover:text-emerald-600 transition-all shadow-sm ring-1 ring-slate-200 active:scale-95"
                          >
                             <FileText className="h-5 w-5" />
                          </Link>
                          <Link 
                            href={`/admin/orders/${order.id}`}
                            className="text-sm font-black text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            #{order.orderCode}
                          </Link>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-black text-slate-900 leading-tight">{order.user.name || 'Khách hàng'}</p>
                       <p className="text-[11px] font-bold text-slate-400 mt-0.5">{order.user.email}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-black text-slate-900">{order.product.name}</p>
                       <span className="inline-flex mt-1 rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-600 tracking-widest uppercase ring-1 ring-inset ring-slate-200">
                          {order.product.apiFamily}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <p className="text-sm font-black text-slate-900">{formatVnd(order.amountVnd)}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex justify-center">
                          {getStatusBadge(order.status)}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-slate-900">
                          <Clock className="h-4 w-4 text-slate-300" />
                          <div className="flex flex-col">
                             <span className="text-[12px] font-bold">{format(new Date(order.createdAt), "dd/MM/yyyy")}</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{format(new Date(order.createdAt), "HH:mm:ss")}</span>
                          </div>
                       </div>
                       {order.paidAt && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-emerald-600">
                             <CheckCircle2 className="h-3.5 w-3.5" />
                             <span className="text-[10px] font-black uppercase tracking-tight">Paid at: {format(new Date(order.paidAt), "dd/MM HH:mm")}</span>
                          </div>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all"
                          title="Xem chi tiết"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                        {order.status === "PENDING" && (
                          <>
                            <button 
                              onClick={() => handleVerifyPayment(order.id)}
                              className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-5 text-xs font-black text-white hover:bg-black transition-all shadow-lg shadow-slate-200"
                              title="Kiểm tra trạng thái từ PayOS"
                            >
                              <ExternalLink className="h-4 w-4" /> Check PayOS
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, "PAID")}
                              className="flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-xs font-black text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                            >
                              <CheckCircle2 className="h-4 w-4" /> Duyệt
                            </button>
                          </>
                        )}
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all">
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
