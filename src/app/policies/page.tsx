"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  AlertCircle, 
  User,
  Coins,
  CreditCard,
  RotateCcw,
  Key,
  Lock,
  LifeBuoy,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingPublicFooter } from "@/components/layout/landing-public-chrome";

const policyCards = [
  {
    id: "usage",
    title: "Sử dụng dịch vụ",
    icon: <ShieldCheck className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Chỉ sử dụng TzoShop cho mục đích làm việc hợp lệ.",
      "Không lạm dụng, spam request hoặc phá hoại hệ thống.",
      "Chúng tôi có quyền tạm ngưng cung cấp nếu phát hiện hành vi bất thường."
    ]
  },
  {
    id: "account",
    title: "Tài khoản",
    icon: <User className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Bạn tự bảo quản thông tin đăng nhập cá nhân.",
      "Không chia sẻ tài khoản cho người lạ để tránh rủi ro bảo mật.",
      "Liên hệ ngay với hỗ trợ nếu nghi ngờ tài khoản bị xâm nhập."
    ]
  },
  {
    id: "credits",
    title: "Credits",
    icon: <Coins className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Credits được cấp và quản lý theo từng gói độc lập.",
      "Thời hạn sử dụng và số credits hiển thị rõ trên mỗi gói.",
      "Khi hết credits hoặc gói hết hạn, API key sẽ tạm dừng hoạt động."
    ]
  },
  {
    id: "payment",
    title: "Thanh toán",
    icon: <CreditCard className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Kiểm tra kỹ giá tiền và loại gói trước khi xác nhận.",
      "Gói được kích hoạt ngay sau khi hệ thống nhận thanh toán thành công.",
      "Các đơn chờ chưa thanh toán có thể tự do hủy bỏ bất cứ lúc nào."
    ]
  },
  {
    id: "refund",
    title: "Hoàn tiền",
    icon: <RotateCcw className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Gói đã kích hoạt và đang sử dụng thường không hỗ trợ hoàn tiền.",
      "Nếu có sự cố kỹ thuật hoặc chuyển nhầm, chúng tôi sẽ hỗ trợ giải quyết từng trường hợp cụ thể."
    ]
  },
  {
    id: "apikey",
    title: "API Key",
    icon: <Key className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Không đăng API key công khai (GitHub, diễn đàn) để tránh bị trộm credits.",
      "Nếu lỡ làm lộ, hãy thu hồi (revoke) key đó ngay lập tức trong Dashboard.",
      "TzoShop không thể hoàn lại credits nếu lỗi bảo mật đến từ phía bạn."
    ]
  },
  {
    id: "privacy",
    title: "Bảo mật",
    icon: <Lock className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Mật khẩu của bạn được mã hóa an toàn tuyệt đối.",
      "Chúng tôi không hiển thị công khai các thông tin kết nối nhạy cảm.",
      "Dữ liệu tài khoản chỉ dùng để vận hành dịch vụ và hỗ trợ khách hàng."
    ]
  },
  {
    id: "support",
    title: "Hỗ trợ",
    icon: <LifeBuoy className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      "Đội ngũ TzoShop luôn sẵn sàng hỗ trợ bạn qua hệ thống Ticket.",
      "Vui lòng đính kèm mã đơn hàng hoặc ảnh lỗi để được xử lý nhanh nhất.",
      "Chúng tôi cam kết phản hồi và xử lý trong thời gian sớm nhất."
    ]
  }
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 text-[#0b0f0d]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-b border-slate-100 py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-4 py-2 text-sm font-semibold text-[#00d4a4]">
              <ShieldCheck className="h-4 w-4" />
              Điều khoản & chính sách
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0b0f0d] sm:text-5xl">
              Chính sách sử dụng TzoShop
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#47524d]">
              Các quy định minh bạch về tài khoản, thanh toán, credits và API key, nhằm đảm bảo quyền lợi tốt nhất cho bạn khi sử dụng dịch vụ.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        
        {/* Alert Card */}
        <div className="mb-10 rounded-2xl border border-amber-100 bg-amber-50/80 p-5 flex items-start sm:items-center gap-4 max-w-4xl">
          <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-amber-800 leading-6">
            <span className="font-bold">Lưu ý nhỏ:</span> Vui lòng xem qua chính sách trước khi mua gói hoặc sử dụng API. 
            Nếu có điểm nào chưa rõ ràng, đừng ngại nhắn hỗ trợ cho chúng tôi trước khi thanh toán nhé.
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-start mb-16">
          {policyCards.map((card) => (
            <div key={card.id} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm flex flex-col h-full">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e7fff7]">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold">{card.title}</h3>
              </div>

              <ul className="space-y-3 mt-2">
                {card.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                    <p className="text-sm leading-6 text-[#47524d]">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA Card inline with grid */}
          <div className="rounded-3xl border border-[#0b0f0d] bg-[#0b0f0d] p-6 md:p-8 flex flex-col h-full justify-center items-center text-center text-white">
            <h3 className="text-xl font-bold mb-3">Có điều khoản nào chưa rõ?</h3>
            <p className="text-sm text-white/70 leading-6 mb-8 max-w-[250px]">
              Đừng lo, hãy liên hệ ngay để TzoShop có thể giải đáp chi tiết nhất cho bạn.
            </p>
            <div className="w-full space-y-3">
              <Link 
                href="/support" 
                className="btn-accent w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Liên hệ hỗ trợ
              </Link>
              <Link 
                href="/faq" 
                className="w-full flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <HelpCircle className="h-4 w-4" />
                Xem FAQ
              </Link>
            </div>
          </div>
        </div>

      </div>

      <LandingPublicFooter />
    </main>
  );
}
