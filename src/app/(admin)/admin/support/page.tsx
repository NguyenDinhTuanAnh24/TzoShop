"use client";

import { useEffect, useState } from "react";
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  MessageSquare,
  ChevronRight,
  User,
  Mail,
  ArrowRight,
  Hash,
  ShoppingBag,
  Flag,
  Tag,
  Save,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type SupportTicket = {
  id: string;
  name: string;
  email: string;
  category: string;
  priority: "NORMAL" | "HIGH" | "URGENT";
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  orderCode?: string;
  apiKeyPrefix?: string;
  adminNotes?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");

  const [detailData, setDetailData] = useState({
    status: "",
    adminNotes: ""
  });

  const { toast, showToast, clearToast } = useToast();

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/support");
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
  }, []);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  useEffect(() => {
    if (selectedTicket) {
      setDetailData({
        status: selectedTicket.status,
        adminNotes: selectedTicket.adminNotes || ""
      });
    }
  }, [selectedTicketId]);

  const handleUpdateTicket = async () => {
    if (!selectedTicketId) return;
    try {
      setIsUpdating(true);
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ticketId: selectedTicketId, 
          status: detailData.status,
          adminNotes: detailData.adminNotes 
        }),
      });
      const result = await res.json();
      if (result.success) {
        showToast("Đã cập nhật ticket.", "success");
        fetchTickets();
      }
    } catch (error) {
      showToast("Không thể cập nhật.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-blue-600 ring-1 ring-blue-500/10">Đang mở</span>;
      case "IN_PROGRESS": return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-amber-600 ring-1 ring-amber-500/10">Đang xử lý</span>;
      case "RESOLVED": return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-500/10">Đã giải quyết</span>;
      case "CLOSED": return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-200">Đã đóng</span>;
      default: return null;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "NORMAL": return <Flag className="h-3.5 w-3.5 text-slate-300" />;
      case "HIGH": return <Flag className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />;
      case "URGENT": return <AlertCircle className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />;
      default: return null;
    }
  };

  const categories = Array.from(new Set(tickets.map(t => t.category)));

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.email.toLowerCase().includes(search.toLowerCase()) || 
                          t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    const matchesPriority = filterPriority === "ALL" || t.priority === filterPriority;
    const matchesCategory = filterCategory === "ALL" || t.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
           <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200 ring-4 ring-slate-50">
              <LifeBuoy className="h-8 w-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hỗ trợ khách hàng</h1>
              <p className="text-slate-500 font-bold mt-1">Theo dõi và xử lý yêu cầu hỗ trợ từ người dùng.</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 border-r border-slate-100 hidden lg:grid">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang mở</p>
                 <p className="text-lg font-black text-blue-600">{tickets.filter(t => t.status === 'OPEN').length}</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang xử lý</p>
                 <p className="text-lg font-black text-amber-600">{tickets.filter(t => t.status === 'IN_PROGRESS').length}</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã xong</p>
                 <p className="text-lg font-black text-emerald-600">{tickets.filter(t => t.status === 'RESOLVED').length}</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khẩn cấp</p>
                 <p className="text-lg font-black text-rose-600">{tickets.filter(t => t.priority === 'URGENT').length}</p>
              </div>
           </div>
           <button 
              onClick={fetchTickets}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
           >
              <RotateCcw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
         {/* Left Side: Ticket List */}
         <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 space-y-4 shrink-0">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm email, chủ đề..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
               </div>
               <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-[10px] font-black text-slate-600 outline-none appearance-none cursor-pointer"
                  >
                    <option value="ALL">Tất cả Trạng thái</option>
                    <option value="OPEN">Mở</option>
                    <option value="IN_PROGRESS">Đang xử lý</option>
                    <option value="RESOLVED">Giải quyết</option>
                    <option value="CLOSED">Đóng</option>
                  </select>
                  <select 
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-[10px] font-black text-slate-600 outline-none appearance-none cursor-pointer"
                  >
                    <option value="ALL">Độ ưu tiên</option>
                    <option value="NORMAL">Bình thường</option>
                    <option value="HIGH">Cao</option>
                    <option value="URGENT">Khẩn cấp</option>
                  </select>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
               {isLoading ? (
                  <div className="py-20 text-center space-y-4">
                     <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải yêu cầu...</p>
                  </div>
               ) : filteredTickets.length === 0 ? (
                  <div className="py-20 text-center">
                     <p className="text-sm font-bold text-slate-400 italic">Không tìm thấy yêu cầu nào.</p>
                  </div>
               ) : (
                  <div className="divide-y divide-slate-50">
                     {filteredTickets.map((ticket) => (
                        <button
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className={`w-full text-left p-6 transition-all border-l-4 ${
                            selectedTicketId === ticket.id 
                              ? "bg-slate-50 border-emerald-500 shadow-inner" 
                              : "bg-white border-transparent hover:bg-slate-50/50"
                          }`}
                        >
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                                 {ticket.category}
                              </span>
                              {getPriorityIcon(ticket.priority)}
                           </div>
                           <h4 className="text-sm font-black text-slate-900 leading-snug mb-1 line-clamp-1">{ticket.subject}</h4>
                           <p className="text-[11px] font-bold text-slate-500 truncate mb-3">{ticket.email}</p>
                           <div className="flex justify-between items-center">
                              {getStatusBadge(ticket.status)}
                              <span className="text-[10px] font-bold text-slate-400">
                                 {format(new Date(ticket.createdAt), "HH:mm dd/MM", { locale: vi })}
                              </span>
                           </div>
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Right Side: Ticket Detail */}
         <div className="flex-1 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
            {!selectedTicket ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="h-20 w-20 rounded-[32px] bg-slate-50 flex items-center justify-center mb-6">
                     <MessageSquare className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Chọn yêu cầu để xử lý</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-[280px]">
                     Chọn một yêu cầu hỗ trợ từ danh sách bên trái để xem nội dung chi tiết và phản hồi khách hàng.
                  </p>
               </div>
            ) : (
               <>
                  {/* Detail Header */}
                  <div className="p-8 border-b border-slate-100 shrink-0">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              {getStatusBadge(selectedTicket.status)}
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600 uppercase tracking-widest ring-1 ring-slate-200">
                                 {selectedTicket.category}
                              </span>
                           </div>
                           <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{selectedTicket.subject}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className={`flex h-10 px-4 items-center gap-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                              selectedTicket.priority === 'URGENT' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                              selectedTicket.priority === 'HIGH' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                              'bg-slate-50 border-slate-100 text-slate-500'
                           }`}>
                              {getPriorityIcon(selectedTicket.priority)}
                              {selectedTicket.priority}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Detail Body */}
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                     {/* User Info */}
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Thông tin khách hàng</p>
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-900 text-sm font-black shadow-sm ring-1 ring-slate-200">
                                 {selectedTicket.name[0].toUpperCase()}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900">{selectedTicket.name}</p>
                                 <p className="text-xs font-bold text-slate-500">{selectedTicket.email}</p>
                              </div>
                           </div>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tham chiếu hệ thống</p>
                           <div className="space-y-2">
                              {selectedTicket.orderCode ? (
                                 <div className="flex items-center gap-2">
                                    <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">Đơn hàng: <span className="font-black text-indigo-600">{selectedTicket.orderCode}</span></span>
                                 </div>
                              ) : (
                                 <p className="text-[11px] text-slate-400 italic">Không có mã đơn hàng</p>
                              )}
                              {selectedTicket.apiKeyPrefix ? (
                                 <div className="flex items-center gap-2">
                                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">API Key: <span className="font-black text-emerald-600">{selectedTicket.apiKeyPrefix}...</span></span>
                                 </div>
                              ) : (
                                 <p className="text-[11px] text-slate-400 italic">Không có API Key tham chiếu</p>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Message */}
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung yêu cầu</label>
                        <div className="p-8 rounded-[32px] bg-slate-900 text-slate-200 text-sm font-medium leading-relaxed shadow-xl ring-4 ring-slate-50 whitespace-pre-wrap">
                           {selectedTicket.message}
                        </div>
                        <p className="text-[10px] text-right text-slate-400 font-bold px-4 pt-1">
                           Gửi lúc: {format(new Date(selectedTicket.createdAt), "HH:mm:ss - dd MMMM, yyyy", { locale: vi })}
                        </p>
                     </div>

                     {/* Admin Section */}
                     <div className="space-y-6 pt-4 border-t border-slate-100">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <MessageSquare className="h-3.5 w-3.5" /> Ghi chú nội bộ / Phản hồi
                           </label>
                           <textarea 
                              value={detailData.adminNotes}
                              onChange={e => setDetailData({...detailData, adminNotes: e.target.value})}
                              placeholder="Nhập ghi chú xử lý hoặc phản hồi để khách hàng xem..."
                              className="w-full min-h-[160px] rounded-[32px] border border-slate-200 bg-slate-50/50 p-6 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all custom-scrollbar"
                           />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cập nhật trạng thái</label>
                              <select 
                                 value={detailData.status}
                                 onChange={e => setDetailData({...detailData, status: e.target.value})}
                                 className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-900 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                              >
                                 <option value="OPEN">OPEN - Đang chờ</option>
                                 <option value="IN_PROGRESS">IN_PROGRESS - Đang xử lý</option>
                                 <option value="RESOLVED">RESOLVED - Đã giải quyết</option>
                                 <option value="CLOSED">CLOSED - Đã đóng</option>
                              </select>
                           </div>
                           <div className="flex items-end">
                              <button 
                                 onClick={handleUpdateTicket}
                                 disabled={isUpdating}
                                 className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-10 py-3.5 text-sm font-black text-white shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                              >
                                 {isUpdating ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                 ) : (
                                    <Save className="h-4 w-4" />
                                 )}
                                 Lưu cập nhật
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            )}
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
