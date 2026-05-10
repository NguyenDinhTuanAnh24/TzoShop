"use client";

import { useEffect, useState } from "react";
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
  User
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
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-100">Đã thanh toán</span>;
      case "PENDING": return <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 ring-1 ring-amber-100">Chờ thanh toán</span>;
      case "CANCELLED": return <span className="flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-100">Đã hủy</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={ShoppingCart} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý đơn hàng</h1>
            <p className="text-sm text-slate-500 font-medium">Theo dõi và xử lý các giao dịch nạp credits.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn hàng</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Giá trị</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Trạng thái</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">Chưa có đơn hàng nào.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <FileText className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{order.orderCode}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{order.product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600">
                          {order.user.name[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 leading-none">{order.user.name}</p>
                          <p className="text-[11px] text-slate-400 mt-1">{order.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900">{formatVnd(order.amountVnd)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 flex items-center gap-1">
                        <CreditCard className="h-3 w-3" /> Chuyển khoản
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {getStatusBadge(order.status)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        {order.status === "PENDING" && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, "PAID")}
                            className="flex h-9 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Xác nhận
                          </button>
                        )}
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-900 shadow-sm transition-all">
                          <MoreHorizontal className="h-4 w-4" />
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
