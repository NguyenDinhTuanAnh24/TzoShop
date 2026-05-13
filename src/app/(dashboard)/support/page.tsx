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
  Clock,
  RefreshCw,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import { AppButton } from "@/components/ui/app-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";
import { SupportPageSkeleton } from "@/components/dashboard/support/support-page-skeleton";

const REQUEST_TYPES = ["Thanh toán", "API key", "Credits", "Tài khoản", "Kỹ thuật", "Khác"];
const PRIORITIES = ["Bình thường", "Cao", "Khẩn cấp"];

const FAQS = [
  {
    question: "Không thấy credits sau thanh toán?",
    answer:
      "Credits thường được cộng ngay sau khi hệ thống xác nhận thanh toán. Nếu sau vài phút vẫn chưa thấy, hãy gửi hỗ trợ kèm mã đơn hàng.",
  },
  {
    question: "API key không dùng được?",
    answer:
      "Hãy kiểm tra gói credits còn hiệu lực, API key chưa bị thu hồi và Base URL đúng theo tài liệu API.",
  },
  {
    question: "Muốn mua gói riêng?",
    answer:
      "Bạn có thể gửi yêu cầu hỗ trợ để TzoShop tư vấn gói credits phù hợp với nhu cầu sử dụng.",
  },
  {
    question: "Credits bị trừ như thế nào?",
    answer:
      "Credits được trừ dựa trên số lượng token tiêu thụ, model sử dụng và quy đổi của từng gói.",
  },
];

export interface TicketItem {
  id: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority?: "NORMAL" | "HIGH" | "URGENT";
  category: string;
  createdAt: string;
  subject: string;
  message: string;
  adminNotes?: string | null;
}

export default function SupportPage() {
  const { toast, showToast, clearToast } = useToast(4000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: REQUEST_TYPES[0],
    priority: PRIORITIES[0],
    title: "",
    content: "",
    reference: "",
  });

  const [tickets, setTickets] = useState<TicketItem[]>([]);

  const fetchMyTickets = async () => {
    try {
      setIsLoadingTickets(true);
      setLoadError(null);
      const res = await fetch("/api/support", { cache: "no-store" });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message ?? "Không thể tải trang hỗ trợ.");
      if (result.success) setTickets(result.data);
    } catch {
      setLoadError("Vui lòng thử lại sau hoặc liên hệ qua Zalo/Telegram nếu lỗi tiếp tục xảy ra.");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchMyTickets();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
        headers: { "Content-Type": "application/json" },
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
      if (!response.ok) throw new Error(result.message || "Có lỗi xảy ra.");

      showToast("Đã gửi yêu cầu. TzoShop sẽ phản hồi trong thời gian sớm nhất.", "success");
      setFormData({
        name: "",
        email: "",
        type: REQUEST_TYPES[0],
        priority: PRIORITIES[0],
        title: "",
        content: "",
        reference: "",
      });
      void fetchMyTickets();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể gửi yêu cầu lúc này.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMeta = (status: TicketItem["status"]) => {
    if (status === "OPEN") return { text: "Mới", variant: "warning" as const };
    if (status === "IN_PROGRESS") return { text: "Đang xử lý", variant: "info" as const };
    if (status === "RESOLVED") return { text: "Đã phản hồi", variant: "success" as const };
    return { text: "Đã đóng", variant: "neutral" as const };
  };

  const getPriorityVariant = (priority: string) => {
    if (priority === "URGENT" || priority === "Khẩn cấp") return "danger" as const;
    if (priority === "HIGH" || priority === "Cao") return "warning" as const;
    return "neutral" as const;
  };

  const getPriorityLabel = (priority?: TicketItem["priority"]) => {
    if (priority === "URGENT") return "Khẩn cấp";
    if (priority === "HIGH") return "Cao";
    return "Bình thường";
  };

  const contactItems = [
    {
      label: "EMAIL HỖ TRỢ",
      value: CONTACT_INFO.email,
      href: CONTACT_LINKS.email,
      icon: Mail,
      iconClassName: "bg-[#C7F0D8]",
      ariaLabel: "Liên hệ email hỗ trợ",
    },
    {
      label: "ZALO",
      value: CONTACT_INFO.zalo,
      href: CONTACT_LINKS.zaloTel,
      icon: Smartphone,
      iconClassName: "bg-[#FFD93D]",
      ariaLabel: "Liên hệ Zalo hỗ trợ",
    },
    {
      label: "TELEGRAM",
      value: CONTACT_INFO.telegram,
      href: CONTACT_LINKS.telegram,
      icon: Send,
      iconClassName: "bg-[#A78BFA]",
      ariaLabel: "Mở Telegram hỗ trợ",
    },
  ];

  return (
    <main className="space-y-8 pb-20 lg:space-y-10" aria-busy={isLoadingTickets}>
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border-4 border-black bg-[#FFD93D] text-black shadow-[5px_5px_0px_0px_#000]">
              <LifeBuoy className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">HỖ TRỢ TZOSHOP</h2>
              <p className="mt-2 text-sm font-bold text-black/70 md:text-base">
                Gửi yêu cầu hỗ trợ về thanh toán, API key, credits hoặc lỗi trong quá trình sử dụng.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex border-2 border-black bg-[#C7F0D8] px-3 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">Phản hồi nhanh</span>
            <span className="inline-flex border-2 border-black bg-[#FFD93D] px-3 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">Hỗ trợ người dùng</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-black bg-[#C7F0D8] text-black shadow-[3px_3px_0px_0px_#000]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase text-black md:text-2xl">Gửi yêu cầu mới</h3>
                <p className="text-sm font-bold text-black/70">Mô tả vấn đề bạn đang gặp để TzoShop hỗ trợ nhanh hơn.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wide text-black" aria-required="true">Họ tên <span className="text-[#FF6B6B]">*</span></label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="h-12 w-full border-4 border-black bg-[#FFFDF5] px-4 text-sm font-bold text-black placeholder:text-black/40 shadow-[3px_3px_0px_0px_#000] outline-none transition-all focus:bg-[#FFD93D]/25 focus:shadow-[4px_4px_0px_0px_#000]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wide text-black" aria-required="true">Email <span className="text-[#FF6B6B]">*</span></label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="h-12 w-full border-4 border-black bg-[#FFFDF5] px-4 text-sm font-bold text-black placeholder:text-black/40 shadow-[3px_3px_0px_0px_#000] outline-none transition-all focus:bg-[#FFD93D]/25 focus:shadow-[4px_4px_0px_0px_#000]"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wide text-black">Loại yêu cầu</label>
                  <select
                    className="h-12 w-full border-4 border-black bg-[#FFFDF5] px-4 text-sm font-bold text-black shadow-[3px_3px_0px_0px_#000] outline-none transition-all focus:bg-[#FFD93D]/25 focus:shadow-[4px_4px_0px_0px_#000]"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {REQUEST_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wide text-black">Mức độ ưu tiên</label>
                  <select
                    className="h-12 w-full border-4 border-black bg-[#FFFDF5] px-4 text-sm font-bold text-black shadow-[3px_3px_0px_0px_#000] outline-none transition-all focus:bg-[#FFD93D]/25 focus:shadow-[4px_4px_0px_0px_#000]"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wide text-black" aria-required="true">Tiêu đề <span className="text-[#FF6B6B]">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Không nhận được credits sau thanh toán"
                  className="h-12 w-full border-4 border-black bg-[#FFFDF5] px-4 text-sm font-bold text-black placeholder:text-black/40 shadow-[3px_3px_0px_0px_#000] outline-none transition-all focus:bg-[#FFD93D]/25 focus:shadow-[4px_4px_0px_0px_#000]"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wide text-black" aria-required="true">Nội dung chi tiết <span className="text-[#FF6B6B]">*</span></label>
                <textarea
                  rows={6}
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp, thời điểm xảy ra và cách tái hiện nếu có."
                  className="min-h-[160px] w-full resize-y border-4 border-black bg-[#FFFDF5] px-4 py-3 text-sm font-bold leading-relaxed text-black placeholder:text-black/40 shadow-[3px_3px_0px_0px_#000] outline-none transition-all focus:bg-[#FFD93D]/25 focus:shadow-[4px_4px_0px_0px_#000]"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wide text-black">Mã đơn hàng hoặc API key prefix nếu có</label>
                <input
                  type="text"
                  placeholder="Ví dụ: TZO-123456 hoặc tzo_live_..."
                  className="h-12 w-full border-4 border-black bg-[#FFFDF5] px-4 text-sm font-bold text-black placeholder:text-black/40 shadow-[3px_3px_0px_0px_#000] outline-none transition-all focus:bg-[#FFD93D]/25 focus:shadow-[4px_4px_0px_0px_#000]"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                />
              </div>

              <AppButton type="submit" isLoading={isSubmitting} variant="accent" className="h-14 w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? "ĐANG GỬI..." : "GỬI YÊU CẦU HỖ TRỢ"}
              </AppButton>
            </form>
          </section>

          <section className="space-y-5">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FFD93D] text-black shadow-[2px_2px_0px_0px_#000]">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-black uppercase text-black md:text-2xl">Lịch sử yêu cầu</h3>
              </div>
              <AppButton variant="secondary" className="h-11 px-5" onClick={() => void fetchMyTickets()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                LÀM MỚI
              </AppButton>
            </header>

            {loadError ? (
              <div className="border-4 border-black bg-[#FF6B6B] p-6 text-black shadow-[8px_8px_0px_0px_#000]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
                  <div>
                    <h4 className="text-xl font-black uppercase">Không thể tải trang hỗ trợ</h4>
                    <p className="mt-2 text-sm font-bold text-black/80">Vui lòng thử lại sau hoặc liên hệ qua Zalo/Telegram nếu lỗi tiếp tục xảy ra.</p>
                    <AppButton variant="secondary" className="mt-5 h-11" onClick={() => void fetchMyTickets()}>
                      THỬ LẠI
                    </AppButton>
                  </div>
                </div>
              </div>
            ) : isLoadingTickets ? (
              <SupportPageSkeleton minimal />
            ) : tickets.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center border-4 border-black bg-[#FFFDF5] p-8 text-center shadow-[8px_8px_0px_0px_#000] md:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center border-4 border-black bg-[#FFD93D] text-black shadow-[5px_5px_0px_0px_#000]">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight text-black md:text-2xl">Bạn chưa gửi yêu cầu hỗ trợ nào</h4>
                <p className="mt-3 max-w-[520px] text-sm font-bold text-black/70 md:text-base">
                  Các yêu cầu đã gửi sẽ được hiển thị tại đây để bạn tiện theo dõi.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tickets.map((ticket) => {
                  const statusMeta = getStatusMeta(ticket.status);
                  return (
                    <article
                      key={ticket.id}
                      className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] md:p-6"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={statusMeta.text} variant={statusMeta.variant} />
                        <StatusBadge status={ticket.category} variant="neutral" />
                        <StatusBadge status={getPriorityLabel(ticket.priority)} variant={getPriorityVariant(ticket.priority ?? "NORMAL")} />
                      </div>
                      <h4 className="mt-3 text-lg font-black text-black md:text-xl">{ticket.subject}</h4>
                      <p className="mt-2 text-sm font-bold text-black/70">{ticket.message}</p>
                      <p className="mt-3 text-xs font-black uppercase tracking-wide text-black/70">
                        {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                      </p>
                      {ticket.adminNotes ? (
                        <div className="mt-4 border-2 border-black bg-[#C7F0D8] p-3 text-sm font-bold text-black">
                          Phản hồi từ Admin: {ticket.adminNotes}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000] xl:sticky xl:top-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FFD93D] text-black shadow-[2px_2px_0px_0px_#000]">
                <AlertCircle className="h-4 w-4" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Liên hệ nhanh</h3>
            </div>

            <div className="space-y-4">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.ariaLabel}
                  className="group flex items-center gap-3 border-4 border-black bg-[#FFFDF5] p-3 shadow-[3px_3px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000]"
                >
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]", item.iconClassName)}>
                    <item.icon className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wide text-black/70">{item.label}</p>
                    <p className="break-all text-sm font-black text-black">{item.value}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-black" />
                </a>
              ))}

              <div className="flex items-center gap-3 border-4 border-black bg-[#FFFDF5] p-3 shadow-[3px_3px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-[#FF6B6B] text-black shadow-[2px_2px_0px_0px_#000]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-black/70">Thời gian phản hồi</p>
                  <p className="text-sm font-black text-black">{CONTACT_INFO.responseTime}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FF6B6B] text-black shadow-[2px_2px_0px_0px_#000]">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Câu hỏi thường gặp</h3>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                const faqContentId = `support-faq-content-${idx}`;
                return (
                  <article key={faq.question} className="border-2 border-black bg-[#FFFDF5] shadow-[3px_3px_0px_0px_#000]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq((prev) => (prev === idx ? null : idx))}
                      className="flex w-full items-start justify-between gap-3 p-3 text-left"
                      aria-expanded={isOpen}
                      aria-controls={faqContentId}
                    >
                      <p className="text-sm font-black text-black">{faq.question}</p>
                      <span className="text-[10px] font-black uppercase text-black">{isOpen ? "Ẩn" : "Xem"}</span>
                    </button>
                    {isOpen ? (
                      <div id={faqContentId} className="border-t-2 border-black px-3 pb-3 pt-3 text-sm font-bold leading-relaxed text-black/70">
                        {faq.answer}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <AppButton variant="secondary" className="mt-5 h-11 w-full text-xs">
              XEM THÊM CÂU HỎI
            </AppButton>
          </section>
        </aside>
      </div>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}
    </main>
  );
}
