"use client";

import { useState, useEffect, type FormEvent } from "react";
import { 
  LifeBuoy, 
  Mail, 
  MessageCircle, 
  Send, 
  HelpCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Clock
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";
import DashboardSubNav from "@/components/dashboard/dashboard-sub-nav";

const REQUEST_TYPES = [
  "Thanh toán",
  "API key",
  "Credits",
  "Gói dịch vụ",
  "Lỗi hệ thống",
  "Yêu cầu gói riêng",
  "Khác"
];

const PRIORITIES = [
  "Bình thường",
  "Cao",
  "Khẩn cấp"
];

const CONTACT_CHANNELS = [
  {
    name: "Email hỗ trợ",
    value: "support@tzoshop.vn",
    icon: Mail,
    href: "mailto:support@tzoshop.vn"
  },
  {
    name: "Zalo",
    value: "0969.xxx.xxx",
    icon: MessageCircle,
    href: "https://zalo.me/your-id"
  },
  {
    name: "Telegram",
    value: "@tzoshop_support",
    icon: Send,
    href: "https://t.me/tzoshop_support"
  }
];

const FAQS = [
  {
    question: "Không thấy credits sau thanh toán?",
    answer: "Thông thường credits sẽ được cộng ngay lập tức sau khi hệ thống nhận được thanh toán. Nếu sau 5 phút vẫn chưa thấy, vui lòng gửi hỗ trợ kèm mã đơn hàng."
  },
  {
    question: "API key không dùng được?",
    answer: "Hãy kiểm tra xem bạn đã nạp credits chưa và API key có bị vô hiệu hóa không. Đảm bảo bạn đang sử dụng đúng endpoint và header authentication."
  },
  {
    question: "Muốn mua gói riêng?",
    answer: "Nếu bạn có nhu cầu sử dụng lượng lớn credits hàng tháng, hãy liên hệ qua Telegram hoặc chọn loại yêu cầu 'Yêu cầu gói riêng' để nhận báo giá tốt nhất."
  },
  {
    question: "Credits bị trừ như thế nào?",
    answer: "Credits được trừ dựa trên số lượng tokens tiêu thụ (input + output) theo bảng giá của từng model AI cụ thể mà bạn sử dụng."
  }
];

export default function SupportPage() {
  const { toast, showToast, clearToast } = useToast(4000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: REQUEST_TYPES[0],
    priority: PRIORITIES[0],
    title: "",
    content: "",
    reference: ""
  });

  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  const fetchMyTickets = async () => {
    try {
      setIsLoadingTickets(true);
      const res = await fetch("/api/support");
      const result = await res.json();
      if (result.success) setTickets(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.title.trim()) {
      showToast("Vui lòng kiểm tra lại thông tin.", "error");
      return;
    }

    if (formData.content.trim().length < 10) {
      showToast("Nội dung hỗ trợ tối thiểu phải 10 ký tự.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          category: formData.type,
          priority: formData.priority,
          subject: formData.title,
          message: formData.content,
          orderCode: formData.reference,
          apiKeyPrefix: formData.reference,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Có lỗi xảy ra.");
      }

      showToast("Yêu cầu hỗ trợ đã được gửi.", "success");
      setFormData({
        name: "",
        email: "",
        type: REQUEST_TYPES[0],
        priority: PRIORITIES[0],
        title: "",
        content: "",
        reference: ""
      });
      fetchMyTickets(); // Refresh list
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể gửi yêu cầu lúc này.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OPEN": return { text: "Đang mở", color: "bg-blue-50 text-blue-600 ring-blue-100" };
      case "IN_PROGRESS": return { text: "Đang xử lý", color: "bg-amber-50 text-amber-600 ring-amber-100" };
      case "RESOLVED": return { text: "Đã giải quyết", color: "bg-emerald-50 text-emerald-600 ring-emerald-100" };
      case "CLOSED": return { text: "Đã đóng", color: "bg-slate-50 text-slate-500 ring-slate-100" };
      default: return { text: status, color: "bg-slate-50 text-slate-500 ring-slate-100" };
    }
  };

  const inputClasses = "w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-medium";
  const labelClasses = "text-sm font-bold text-slate-700 ml-1 mb-2 block";

  return (
    <div className="space-y-8 pb-20">
      <DashboardSubNav 
        items={[
          { label: "Cài đặt", href: "/settings" },
          { label: "Hỗ trợ", href: "/support" },
        ]} 
      />
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <AppIcon icon={LifeBuoy} className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Hỗ trợ</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Gửi yêu cầu hỗ trợ khi bạn gặp vấn đề về thanh toán, credits hoặc API key.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px] items-start">
        {/* Form hỗ trợ */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <AppIcon icon={MessageCircle} className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900">Gửi yêu cầu mới</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses}>Họ tên <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className={inputClasses}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}>Email <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className={inputClasses}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses}>Loại yêu cầu</label>
                <select
                  className={inputClasses}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {REQUEST_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClasses}>Mức độ ưu tiên</label>
                <select
                  className={inputClasses}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Tiêu đề <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Lỗi không nhận được credits sau thanh toán"
                className={inputClasses}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Nội dung chi tiết <span className="text-rose-500">*</span></label>
              <textarea
                rows={5}
                placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
                className={`${inputClasses} resize-none`}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Mã đơn hàng hoặc API key prefix (nếu có)</label>
              <input
                type="text"
                placeholder="Ví dụ: TZO-123456 hoặc tzo_live_..."
                className={inputClasses}
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <AppIcon icon={Send} className="h-4 w-4" />
                    Gửi yêu cầu hỗ trợ
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Lịch sử yêu cầu */}
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between border-t border-slate-100 pt-10">
              <div className="flex items-center gap-3">
                <AppIcon icon={Clock} className="h-5 w-5 text-slate-400" />
                <h2 className="text-xl font-black text-slate-900">Lịch sử yêu cầu</h2>
              </div>
            </div>

            {isLoadingTickets ? (
              <div className="py-10 text-center"><div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" /></div>
            ) : tickets.length === 0 ? (
              <p className="py-10 text-center text-sm font-medium text-slate-400 italic">Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
            ) : (
              <div className="grid gap-4">
                {tickets.map((ticket) => {
                  const status = getStatusLabel(ticket.status);
                  return (
                    <div key={ticket.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:bg-white hover:shadow-md">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ring-1 ${status.color}`}>
                              {status.text}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          <h3 className="text-sm font-black text-slate-900 truncate">{ticket.subject}</h3>
                          <p className="mt-2 text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                            {ticket.message}
                          </p>
                          {ticket.adminNotes && (
                            <div className="mt-4 rounded-xl bg-emerald-50 p-3 border border-emerald-100">
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Phản hồi từ Admin:</p>
                              <p className="text-xs font-bold text-emerald-700">{ticket.adminNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Liên hệ nhanh */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <AppIcon icon={AlertCircle} className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900">Liên hệ nhanh</h3>
            </div>

            <div className="space-y-4">
              {CONTACT_CHANNELS.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-all group-hover:ring-emerald-200">
                    <AppIcon icon={channel.icon} className="h-5 w-5 text-slate-600 group-hover:text-emerald-600" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-emerald-500">
                      {channel.name}
                    </p>
                    <p className="truncate text-sm font-black text-slate-900">
                      {channel.value}
                    </p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-emerald-400" />
                </a>
              ))}

              <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Thời gian phản hồi
                  </p>
                  <p className="text-sm font-black text-emerald-400">
                    Thường dưới 15 phút
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <AppIcon icon={HelpCircle} className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900">Câu hỏi thường gặp</h3>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="mt-1 h-3 w-3 shrink-0 text-emerald-500" />
                    <p className="text-sm font-black text-slate-900">
                      {faq.question}
                    </p>
                  </div>
                  <p className="ml-5 text-xs font-medium leading-relaxed text-slate-500">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
              Xem thêm câu hỏi
            </button>
          </div>
        </aside>
      </div>

      {/* Toast */}
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
