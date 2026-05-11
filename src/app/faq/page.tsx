"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  CreditCard, 
  KeyRound, 
  Wallet, 
  Search,
  LifeBuoy,
  Puzzle,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const faqGroups = [
  {
    id: "pre-purchase",
    title: "Trước khi mua",
    desc: "Thắc mắc phổ biến trước khi chọn gói phù hợp.",
    icon: <HelpCircle className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      {
        q: "Chưa biết nên chọn gói nào?",
        a: "Nếu mới thử, hãy bắt đầu với gói Trial. Nếu dùng thường xuyên trong IDE, gói Plus/Pro là lựa chọn hoàn hảo."
      },
      {
        q: "Cần biết lập trình không?",
        a: "Không bắt buộc. Chỉ cần nhập Base URL và API key vào công cụ OpenAI-compatible là có thể dùng."
      },
      {
        q: "TzoShop dùng cho công cụ nào?",
        a: "Phù hợp với mọi extension, IDE hoặc API client có cấu hình tùy chỉnh endpoint."
      }
    ]
  },
  {
    id: "credits",
    title: "Credits",
    desc: "Cách tính và quản lý credits hiệu quả.",
    icon: <Wallet className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      {
        q: "Credits là gì?",
        a: "Là đơn vị tính mức sử dụng API. Bạn sẽ bị trừ credits dựa trên loại model và độ dài văn bản (tokens) xử lý."
      },
      {
        q: "Credits có thời hạn không?",
        a: "Có, mỗi gói có thời hạn hiển thị rõ ràng. Bạn cần kiểm tra kỹ trước khi xác nhận thanh toán."
      },
      {
        q: "Hết credits thì sao?",
        a: "API key sẽ tạm ngưng. Bạn chỉ cần mua gói mới để cấp lại credits mà không làm gián đoạn công việc."
      }
    ]
  },
  {
    id: "apikey",
    title: "API key",
    desc: "Bảo mật và quản lý mã kết nối.",
    icon: <KeyRound className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      {
        q: "API key dùng để làm gì?",
        a: "Là mã bảo mật để kết nối IDE của bạn với TzoShop, giúp truy cập nhanh chóng vào các model AI."
      },
      {
        q: "Lộ API key phải làm sao?",
        a: "Vào Dashboard thu hồi (revoke) key đó ngay lập tức và tạo key mới. Key cũ sẽ bị vô hiệu hóa an toàn."
      },
      {
        q: "Lỗi không gọi được model?",
        a: "Thường do model nằm ngoài gói, hoặc gói đã hết hạn/hết credits. Hãy kiểm tra trạng thái trong Dashboard."
      }
    ]
  },
  {
    id: "payment",
    title: "Thanh toán",
    desc: "Thông tin giao dịch và cấp phát gói.",
    icon: <CreditCard className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      {
        q: "Bao lâu thì nhận được credits?",
        a: "Hệ thống kích hoạt gói tự động ngay sau khi xác nhận thanh toán thành công (thường dưới 1 phút)."
      },
      {
        q: "Chuyển khoản rồi nhưng chưa thấy?",
        a: "Hãy gửi yêu cầu hỗ trợ kèm mã đơn hàng. Đội ngũ TzoShop sẽ kiểm tra và xử lý ngay cho bạn."
      },
      {
        q: "Có thể hủy đơn chờ thanh toán?",
        a: "Bạn chủ động hủy nếu chưa thanh toán. Các đơn đã chuyển khoản và kích hoạt sẽ không được hoàn tiền."
      }
    ]
  },
  {
    id: "extension",
    title: "Extension / IDE",
    desc: "Tích hợp TzoShop vào quy trình làm việc.",
    icon: <Puzzle className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      {
        q: "Lấy Base URL ở đâu?",
        a: "Base URL có trong trang Tài liệu API. Bạn chỉ cần copy và dán trực tiếp vào phần cấu hình extension."
      },
      {
        q: "Cài đặt đúng nhưng vẫn lỗi?",
        a: "Kiểm tra kỹ khoảng trắng thừa trong URL/Key. Nếu vẫn lỗi, hãy nhắn hỗ trợ kèm tên công cụ bạn dùng."
      },
      {
        q: "Dùng 1 key cho nhiều máy?",
        a: "Hoàn toàn được, nhưng để dễ quản lý và bảo mật, bạn nên tạo key riêng cho từng dự án hoặc thiết bị."
      }
    ]
  },
  {
    id: "troubleshoot",
    title: "Sự cố thường gặp",
    desc: "Xử lý nhanh các vấn đề tài khoản.",
    icon: <AlertCircle className="h-6 w-6 text-[#00d4a4]" />,
    items: [
      {
        q: "Không đăng nhập được?",
        a: "Dùng tính năng Quên mật khẩu để lấy lại. Hoặc đăng nhập thẳng qua Google nếu đã liên kết trước đó."
      },
      {
        q: "Đăng nhập Google báo lỗi email?",
        a: "Do email đã tạo mật khẩu nhưng chưa liên kết Google. Hãy đăng nhập bằng mật khẩu rồi vào Cài đặt để liên kết."
      },
      {
        q: "Làm sao để được hỗ trợ nhanh?",
        a: "Gửi yêu cầu qua trang Hỗ trợ trong Dashboard, nhớ kèm mã đơn hoặc API prefix để chúng tôi kiểm tra tức thì."
      }
    ]
  }
];

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = faqGroups.map(group => {
    if (!searchQuery.trim()) return group;
    
    const query = searchQuery.toLowerCase();
    const groupMatches = 
      group.title.toLowerCase().includes(query) || 
      group.desc.toLowerCase().includes(query);
      
    const matchingItems = group.items.filter(item => 
      item.q.toLowerCase().includes(query) || 
      item.a.toLowerCase().includes(query)
    );
    
    if (groupMatches) return group;
    
    return {
      ...group,
      items: matchingItems
    };
  }).filter(group => group.items.length > 0);

  const displayedGroups = activeTab === "all" 
    ? filteredGroups 
    : filteredGroups.filter(g => g.id === activeTab);

  return (
    <main className="min-h-screen bg-slate-50/50 text-[#0b0f0d]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-b border-slate-100 py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-4 py-2 text-sm font-semibold text-[#00d4a4]">
              <LifeBuoy className="h-4 w-4" />
              Trợ giúp khách hàng
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0b0f0d] sm:text-5xl">
              Câu hỏi thường gặp
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#47524d]">
              Những thắc mắc phổ biến nhất khi mua credits, quản lý API key và thiết lập TzoShop trong quy trình làm việc của bạn.
            </p>

            <div className="mt-8 max-w-md relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                placeholder="Bạn cần tìm gì?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00d4a4]/20 focus:border-[#00d4a4] transition-all bg-white shadow-sm text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Horizontal Chips */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
              activeTab === "all" 
                ? "bg-[#0b0f0d] text-white border-[#0b0f0d]" 
                : "bg-white text-[#47524d] border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            Tất cả
          </button>
          {faqGroups.map(group => (
            <button 
              key={group.id}
              onClick={() => setActiveTab(group.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                activeTab === group.id 
                  ? "bg-[#0b0f0d] text-white border-[#0b0f0d]" 
                  : "bg-white text-[#47524d] border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {group.title}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        {displayedGroups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-start">
            {displayedGroups.map((group) => (
              <div key={group.id} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm flex flex-col h-full">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e7fff7]">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{group.title}</h3>
                    <p className="text-sm text-[#66736d] mt-1">{group.desc}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {group.items.map((item, idx) => (
                    <div key={idx} className="pt-5 border-t border-slate-100 first:border-0 first:pt-0">
                      <h4 className="font-bold text-[#0b0f0d] mb-2">{item.q}</h4>
                      <p className="text-sm leading-6 text-[#47524d]">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Featured Support Card */}
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-8 flex flex-col h-full justify-center items-center text-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#00d4a4] text-white mb-6 shadow-md shadow-emerald-500/20">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chưa biết chọn gói nào?</h3>
              <p className="text-sm text-[#47524d] leading-6 mb-8 max-w-[250px]">
                Đội ngũ TzoShop luôn sẵn sàng tư vấn gói credits phù hợp nhất với nhu cầu sử dụng của bạn.
              </p>
              <Link 
                href="/support?type=consulting" 
                className="btn-accent w-full"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-[#0b0f0d] mb-2">
              Không tìm thấy câu hỏi phù hợp
            </h3>
            <p className="text-[#47524d] mb-8">
              Thử tìm kiếm với một từ khóa khác, hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi để được giải đáp ngay lập tức.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setSearchQuery("")}
                className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-[#0b0f0d] hover:bg-slate-50 transition-colors"
              >
                Xóa tìm kiếm
              </button>
              <Link 
                href="/support" 
                className="btn-accent px-8"
              >
                Gửi hỗ trợ
              </Link>
            </div>
          </div>
        )}

      </div>

      <SiteFooter />
    </main>
  );
}
