"use client";

import { useEffect, useState } from "react";
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

type SupportTicket = {
  id: string;
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const { toast, showToast, clearToast } = useToast();

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const url = filterStatus === "ALL" 
        ? "/api/admin/support" 
        : `/api/admin/support?status=${filterStatus}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setTickets(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        body: JSON.stringify({ ticketId, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        showToast("Đã cập nhật trạng thái ticket.", "success");
        fetchTickets();
      }
    } catch (error) {
      showToast("Không thể cập nhật trạng thái.", "error");
    }
  };

  const handleAddNote = async (ticketId: string) => {
    const note = window.prompt("Nhập phản hồi/ghi chú cho khách hàng:");
    if (note === null) return;

    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        body: JSON.stringify({ ticketId, adminNotes: note }),
      });
      const result = await res.json();
      if (result.success) {
        showToast("Đã gửi phản hồi.", "success");
        fetchTickets();
      }
    } catch (error) {
      showToast("Không thể gửi phản hồi.", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200"><Clock className="h-3 w-3" /> MỞ</span>;
      case "IN_PROGRESS": return <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200"><Activity className="h-3 w-3" /> ĐANG XỬ LÝ</span>;
      case "CLOSED": return <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200"><CheckCircle2 className="h-3 w-3" /> ĐÃ ĐÓNG</span>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "NORMAL": return <span className="text-slate-500 font-bold text-xs uppercase">Bình thường</span>;
      case "HIGH": return <span className="text-orange-600 font-bold text-xs uppercase flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Cao</span>;
      case "URGENT": return <span className="text-rose-600 font-black text-xs uppercase flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Khẩn cấp</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={LifeBuoy} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hỗ trợ khách hàng</h1>
            <p className="text-sm text-slate-500 font-medium">Quản lý và phản hồi các yêu cầu hỗ trợ.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="OPEN">Đang mở</option>
            <option value="IN_PROGRESS">Đang xử lý</option>
            <option value="CLOSED">Đã đóng</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Vấn đề</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Độ ưu tiên</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Trạng thái</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">
                    Chưa có ticket nào cần xử lý.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 uppercase">
                          {ticket.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{ticket.name}</p>
                          <p className="text-[11px] text-slate-400 font-bold">{ticket.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-tight mb-1">{ticket.category}</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{ticket.subject}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{ticket.message}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {getStatusBadge(ticket.status)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        {ticket.status !== "CLOSED" && (
                          <button 
                            onClick={() => handleAddNote(ticket.id)}
                            className="flex h-9 items-center gap-2 rounded-xl bg-blue-50 px-4 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" /> Phản hồi
                          </button>
                        )}
                        {ticket.status !== "CLOSED" ? (
                          <button 
                            onClick={() => handleUpdateStatus(ticket.id, "CLOSED")}
                            className="flex h-9 items-center gap-2 rounded-xl bg-emerald-50 px-4 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Đóng
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateStatus(ticket.id, "OPEN")}
                            className="flex h-9 items-center gap-2 rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Clock className="h-4 w-4" /> Mở lại
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
