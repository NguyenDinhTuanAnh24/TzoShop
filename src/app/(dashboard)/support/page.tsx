"use client";

import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import {
  Mail,
  MessageCircle,
  Send,
  RefreshCw,
  AlertTriangle,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";
import { SupportPageSkeleton } from "@/components/dashboard/support/support-page-skeleton";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { TextFadeInUp } from "@/components/animations/text-fade-in-up";

const REQUEST_TYPES = ["Tài khoản", "Thanh toán", "Gói credits", "API key", "Tài liệu/API", "Khác"];

const FAQS = [
  {
    question: "Thanh toán xong bao lâu thì dùng được?",
    answer:
      "Credits thường được cộng ngay sau khi hệ thống xác nhận thanh toán. Nếu sau vài phút vẫn chưa thấy, hãy gửi hỗ trợ kèm mã đơn hàng.",
  },
  {
    question: "API key bị lộ thì xử lý thế nào?",
    answer:
      "Hãy vào trang API Keys để thu hồi key cũ ngay lập tức, sau đó tạo key mới và cập nhật lại trong công cụ bạn đang dùng.",
  },
  {
    question: "Làm sao biết còn bao nhiêu credits?",
    answer:
      "Bạn có thể xem số dư credits trong Dashboard, trang Gói của tôi và theo dõi mức tiêu thụ chi tiết trong Lịch sử sử dụng.",
  },
  {
    question: "Tôi có thể tạo nhiều API key không?",
    answer:
      "Có. Bạn có thể tạo nhiều key theo giới hạn của từng gói để tách riêng theo dự án hoặc công cụ sử dụng.",
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
      if (!res.ok) throw new Error(result?.message ?? "Không thể tải thông tin hỗ trợ");
      if (result.success) setTickets(result.data);
    } catch {
      setLoadError("Vui lòng thử lại sau ít phút.");
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
          priority: "NORMAL",
          subject: formData.title,
          message: formData.content,
          orderCode: formData.reference,
          apiKeyPrefix: formData.reference,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Có lỗi xảy ra.");

      showToast("Đã gửi yêu cầu hỗ trợ", "success");
      setFormData({
        name: "",
        email: "",
        type: REQUEST_TYPES[0],
        title: "",
        content: "",
        reference: "",
      });
      void fetchMyTickets();
    } catch {
      showToast("Không thể gửi yêu cầu. Vui lòng thử lại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMeta = (status: TicketItem["status"]) => {
    if (status === "OPEN") return { text: "Mới", className: "bg-amber-50 text-amber-700 border border-amber-100" };
    if (status === "IN_PROGRESS") return { text: "Đang xử lý", className: "bg-indigo-50 text-indigo-700 border border-indigo-100" };
    if (status === "RESOLVED") return { text: "Đã phản hồi", className: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
    return { text: "Đã đóng", className: "bg-slate-100 text-slate-600 border border-slate-200" };
  };

  const contactItems = [
    {
      title: "Email hỗ trợ",
      desc: "Gửi câu hỏi chi tiết về tài khoản, đơn hàng hoặc API key.",
      value: CONTACT_INFO.email,
      href: CONTACT_LINKS.email,
      icon: Mail,
      iconClassName: "bg-indigo-50 text-indigo-600",
      button: "Gửi email",
      primary: true,
    },
    {
      title: "Zalo",
      desc: "Liên hệ nhanh khi cần hỗ trợ trong quá trình sử dụng.",
      value: "Liên hệ Zalo",
      href: CONTACT_LINKS.zaloTel || "#",
      icon: Smartphone,
      iconClassName: "bg-sky-50 text-sky-700",
      button: "Mở Zalo",
      primary: false,
    },
    {
      title: "Telegram",
      desc: "Theo dõi cập nhật hoặc trao đổi nhanh với đội ngũ hỗ trợ.",
      value: "Nhắn Telegram",
      href: CONTACT_LINKS.telegram || "#",
      icon: Send,
      iconClassName: "bg-violet-50 text-violet-700",
      button: "Mở Telegram",
      primary: false,
    },
  ];

  return (
    <main className="space-y-8 pb-20" aria-busy={isLoadingTickets}>
      <TextFadeInUp as="section" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Hỗ trợ</h1>
            <p className="text-sm leading-7 text-slate-600 md:text-base">
              Liên hệ TzoShop khi bạn cần hỗ trợ về tài khoản, gói credits, thanh toán hoặc API key.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:justify-end sm:pl-2">
            <CosmicButton href="/api-docs">Tài liệu API</CosmicButton>
            <CosmicButton href="/faq" variant="secondary">FAQ</CosmicButton>
          </div>
        </div>
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.05} className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {contactItems.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", item.iconClassName)}>
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{item.value}</p>
            <div className="mt-5">
              {item.primary ? (
                <CosmicButton href={item.href}>{item.button}</CosmicButton>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {item.button}
                </a>
              )}
            </div>
          </article>
        ))}
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.08} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-extrabold text-slate-950">Gửi yêu cầu hỗ trợ</h2>
        <p className="mt-1 text-sm text-slate-600">Điền thông tin bên dưới, TzoShop sẽ phản hồi trong ngày làm việc.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Họ tên"
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email liên hệ"
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Ví dụ: Không thấy gói credits sau khi thanh toán"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <select
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {REQUEST_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Mã đơn hàng hoặc API key prefix (nếu có)"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          />

          <textarea
            rows={6}
            placeholder="Mô tả vấn đề bạn đang gặp phải..."
            className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />

          <CosmicButton type="submit" className="h-12" disabled={isSubmitting}>
            <Send className="h-4 w-4" /> {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </CosmicButton>
        </form>
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.12} className="space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-950">Bạn đang cần hỗ trợ vấn đề gì?</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              title: "Thanh toán chưa cập nhật",
              desc: "Kiểm tra trạng thái đơn hàng hoặc gửi mã đơn để TzoShop hỗ trợ.",
              href: "/billing",
              cta: "Xem thanh toán",
            },
            {
              title: "Không tạo được API key",
              desc: "Kiểm tra gói credits đang hoạt động và giới hạn key của từng gói.",
              href: "/api-keys",
              cta: "Quản lý API keys",
            },
            {
              title: "Credits giảm bất thường",
              desc: "Xem lịch sử request, model sử dụng và lượng token phát sinh.",
              href: "/usage",
              cta: "Xem lịch sử sử dụng",
            },
            {
              title: "Chưa biết cách cấu hình",
              desc: "Xem tài liệu API và hướng dẫn tích hợp với công cụ quen thuộc.",
              href: "/api-docs",
              cta: "Xem tài liệu API",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-indigo-200"
            >
              <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                {item.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.16} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-950">Câu hỏi thường gặp</h2>
        <div className="mt-4 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <article key={faq.question} className="rounded-2xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq((prev) => (prev === idx ? null : idx))}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-2xl px-4 py-3 text-left transition",
                    isOpen ? "bg-indigo-50/40" : "hover:bg-indigo-50/30"
                  )}
                >
                  <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                  <span className="text-xs text-slate-500">{isOpen ? "Ẩn" : "Mở"}</span>
                </button>
                {isOpen && <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{faq.answer}</div>}
              </article>
            );
          })}
        </div>
        <div className="mt-5">
          <CosmicButton href="/faq" variant="secondary">Xem tất cả câu hỏi</CosmicButton>
        </div>
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.2} className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6">
        <h2 className="text-xl font-bold text-slate-950">Thời gian phản hồi</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>Email: Phản hồi trong ngày làm việc.</li>
          <li>Zalo/Telegram: Ưu tiên phản hồi khi đang trong khung giờ hỗ trợ.</li>
          <li>Vui lòng cung cấp mã đơn hàng hoặc email tài khoản để được kiểm tra nhanh hơn.</li>
        </ul>
      </TextFadeInUp>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-slate-950">Yêu cầu đã gửi</h2>
          <button
            type="button"
            onClick={() => void fetchMyTickets()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <RefreshCw className="h-4 w-4" /> Làm mới
          </button>
        </div>

        {loadError ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-950">Không thể tải thông tin hỗ trợ</h3>
            <p className="mt-2 text-sm text-slate-600">Vui lòng thử lại sau ít phút.</p>
            <button
              type="button"
              onClick={() => void fetchMyTickets()}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              Thử lại
            </button>
          </section>
        ) : isLoadingTickets ? (
          <SupportPageSkeleton minimal />
        ) : tickets.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950">Bạn chưa gửi yêu cầu hỗ trợ nào</h3>
            <p className="mt-3 text-sm text-slate-600">Các yêu cầu đã gửi sẽ được hiển thị tại đây để bạn tiện theo dõi.</p>
          </section>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => {
              const statusMeta = getStatusMeta(ticket.status);
              return (
                <article
                  key={ticket.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-indigo-200"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", statusMeta.className)}>
                      {statusMeta.text}
                    </span>
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {ticket.category}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-slate-950">{ticket.subject}</h4>
                  <p className="mt-1 text-sm text-slate-600">{ticket.message}</p>
                  <p className="mt-3 text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleString("vi-VN")}</p>
                  {ticket.adminNotes ? (
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
                      Phản hồi từ Admin: {ticket.adminNotes}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}
    </main>
  );
}
