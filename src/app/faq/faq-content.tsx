"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  CreditCard,
  HelpCircle,
  Mail,
  ShieldCheck,
  ShoppingBag,
  User,
  Wrench,
} from "lucide-react";
import { CosmicButton } from "@/components/ui/cosmic-button";

type FaqItem = {
  q: string;
  a: string;
};

type FaqCategory = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
  {
    id: "buy-credits",
    title: "Mua gói credits",
    icon: ShoppingBag,
    items: [
      {
        q: "Tôi có phải cấu hình phức tạp không?",
        a: "Không. Bạn chỉ cần chọn gói phù hợp, tạo key sử dụng và sao chép thông tin cần thiết vào công cụ đang dùng. TzoShop hướng tới việc giúp bạn bắt đầu nhanh, không phải mất thời gian mò từng bước cấu hình.",
      },
      {
        q: "Tôi sợ mua nhầm gói thì sao?",
        a: "Các gói được chia theo từng nhu cầu sử dụng để bạn dễ chọn hơn. Nếu chưa chắc, bạn có thể bắt đầu từ gói nhỏ trước, theo dõi mức dùng thực tế rồi nâng lên khi cần.",
      },
      {
        q: "Tôi nên chọn gói nào khi mới bắt đầu?",
        a: "Nếu bạn mới sử dụng, hãy bắt đầu với gói nhỏ hoặc gói trải nghiệm. Khi đã biết nhu cầu thực tế, bạn có thể nâng lên các gói cao hơn.",
      },
      {
        q: "Gói credits có thời hạn không?",
        a: "Có. Mỗi gói credits có thời hạn sử dụng riêng và được hiển thị rõ trước khi bạn mua.",
      },
    ],
  },
  {
    id: "billing",
    title: "Thanh toán",
    icon: CreditCard,
    items: [
      {
        q: "Thanh toán xong bao lâu thì dùng được?",
        a: "Sau khi đơn hàng được xác nhận thành công, gói credits sẽ được cập nhật vào tài khoản để bạn tiếp tục sử dụng. Bạn cũng có thể theo dõi trạng thái đơn hàng trong phần thanh toán.",
      },
      {
        q: "Tôi có thể xem lại lịch sử đơn hàng không?",
        a: "Có. Bạn có thể xem danh sách đơn hàng, trạng thái thanh toán và thông tin gói đã mua trong tài khoản.",
      },
      {
        q: "Nếu thanh toán lỗi thì làm sao?",
        a: "Bạn nên kiểm tra lại trạng thái đơn hàng trong phần thanh toán. Nếu vẫn chưa được cập nhật, hãy liên hệ hỗ trợ để được kiểm tra.",
      },
      {
        q: "Có mã giảm giá không?",
        a: "Nếu TzoShop có chương trình ưu đãi, mã giảm giá sẽ được hiển thị hoặc nhập tại bước thanh toán nếu được hỗ trợ.",
      },
    ],
  },
  {
    id: "account",
    title: "Tài khoản",
    icon: User,
    items: [
      {
        q: "Làm sao biết mình còn bao nhiêu credits?",
        a: "Bạn có thể xem credits còn lại, thời hạn gói và lịch sử sử dụng ngay trong tài khoản. Nhờ vậy, bạn biết khi nào cần mua thêm và tránh bị gián đoạn trong quá trình làm việc.",
      },
      {
        q: "Tôi quên mật khẩu thì làm sao?",
        a: "Bạn có thể dùng chức năng quên mật khẩu để nhận hướng dẫn đặt lại mật khẩu qua email đã đăng ký.",
      },
      {
        q: "Tôi có thể đăng nhập bằng Google không?",
        a: "Nếu tài khoản hỗ trợ đăng nhập Google, bạn có thể dùng Google để đăng nhập nhanh hơn. Hãy đảm bảo email trùng với tài khoản đang sử dụng nếu cần liên kết.",
      },
      {
        q: "Tôi có thể đổi thông tin cá nhân không?",
        a: "Bạn có thể cập nhật một số thông tin tài khoản trong phần cài đặt. Email đăng nhập có thể bị giới hạn chỉnh sửa để đảm bảo an toàn.",
      },
    ],
  },
  {
    id: "security",
    title: "API key & bảo mật",
    icon: ShieldCheck,
    items: [
      {
        q: "API key bị lộ thì có xử lý được không?",
        a: "Có. Bạn có thể thu hồi key không còn an toàn và tạo key mới trong tài khoản. Điều này giúp bạn chủ động kiểm soát quyền sử dụng mà không phải đổi toàn bộ thiết lập công việc.",
      },
      {
        q: "Tôi có thể tạo nhiều key không?",
        a: "Tùy theo gói đang dùng, bạn có thể tạo một hoặc nhiều key để tách riêng mục đích sử dụng.",
      },
      {
        q: "Có nên dùng chung một key cho mọi công cụ không?",
        a: "Không nên nếu bạn dùng nhiều mục đích khác nhau. Tạo key riêng cho từng công cụ hoặc dự án sẽ giúp quản lý rõ ràng và an toàn hơn.",
      },
      {
        q: "Tôi cần làm gì để bảo vệ key?",
        a: "Không chia sẻ key công khai, không đưa key lên nơi dễ bị lộ và nên thu hồi key cũ nếu nghi ngờ không còn an toàn.",
      },
    ],
  },
  {
    id: "tools",
    title: "Sử dụng công cụ",
    icon: Wrench,
    items: [
      {
        q: "Tôi dùng nhiều công cụ khác nhau có bị rối không?",
        a: "Không. Bạn có thể tạo key theo từng mục đích sử dụng, ví dụ một key cho IDE, một key cho công cụ thử nghiệm hoặc một key cho dự án riêng. Cách này giúp việc quản lý rõ ràng hơn.",
      },
      {
        q: "TzoShop dùng được với công cụ nào?",
        a: "TzoShop hướng tới việc hỗ trợ các extension, IDE hoặc ứng dụng có khả năng cấu hình kết nối phù hợp.",
      },
      {
        q: "Tôi có cần biết kỹ thuật sâu không?",
        a: "Không cần quá phức tạp. Tài liệu hướng dẫn được viết để bạn có thể bắt đầu từng bước.",
      },
      {
        q: "Tôi có thể theo dõi mức sử dụng không?",
        a: "Có. Bạn có thể theo dõi usage, credits và lịch sử sử dụng trong tài khoản.",
      },
    ],
  },
  {
    id: "others",
    title: "Câu hỏi khác",
    icon: HelpCircle,
    items: [
      {
        q: "TzoShop có hỗ trợ cá nhân và team nhỏ không?",
        a: "Có. Các gói credits được thiết kế để phù hợp với cá nhân, freelancer và team nhỏ có nhu cầu sử dụng AI linh hoạt.",
      },
      {
        q: "Tôi cần hỗ trợ thì liên hệ ở đâu?",
        a: "Bạn có thể liên hệ qua email support@tzoshop.io.vn hoặc các kênh hỗ trợ được hiển thị trong footer.",
      },
      {
        q: "Chính sách bảo mật ở đâu?",
        a: "Bạn có thể xem chính sách bảo mật tại trang /privacy.",
      },
      {
        q: "Điều khoản sử dụng ở đâu?",
        a: "Bạn có thể xem điều khoản sử dụng tại trang /terms.",
      },
    ],
  },
];

export function FaqContent() {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const currentCategory = useMemo(
    () => faqCategories.find((c) => c.id === activeCategory) ?? faqCategories[0],
    [activeCategory],
  );

  return (
    <>
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 tz-animate-fade-up sm:px-6 lg:grid-cols-[320px_1fr] lg:gap-12 lg:px-8 xl:gap-16">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm tz-animate-fade-up tz-delay-100 lg:sticky lg:top-24">
            <p className="px-2 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Danh mục</p>
            <div className="space-y-2">
              {faqCategories.map((category) => {
                const Icon = category.icon;
                const isActive = category.id === activeCategory;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenIndex(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_10px_24px_-14px_rgba(79,70,229,0.55)]"
                        : "text-slate-700 hover:translate-x-1 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-semibold">{category.title}</span>
                    </span>
                    <span className={`text-xs ${isActive ? "text-white/80" : "text-slate-400"}`}>
                      {category.items.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6 tz-animate-fade-up tz-delay-200">
            {currentCategory.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <article
                  key={`${currentCategory.id}-${item.q}`}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ease-out ${
                    isOpen
                      ? "border-indigo-200 shadow-[0_18px_45px_-20px_rgba(79,70,229,0.30)]"
                      : "border-slate-200 shadow-[0_12px_30px_-18px_rgba(79,70,229,0.22)] hover:border-indigo-100 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
                  }`}
                >
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 px-6 py-5 text-left text-base font-bold text-slate-950 transition-colors duration-200 sm:px-7 sm:py-6 sm:text-lg ${
                      isOpen ? "bg-indigo-50/40" : "hover:bg-slate-50"
                    }`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-sm font-bold text-violet-600">{`Q${index + 1}`}</span>
                      <span>{item.q}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-indigo-600" : "text-slate-500"
                      }`}
                    />
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-base leading-8 text-slate-600 sm:px-7 sm:pb-7">{item.a}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-20 rounded-3xl border border-indigo-300/30 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-10 text-center text-white shadow-[0_24px_80px_-28px_rgba(79,70,229,0.55)] tz-animate-fade-up tz-delay-300 sm:mt-24 sm:p-12 lg:p-14">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Không tìm thấy câu trả lời?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-indigo-100">
              Liên hệ đội ngũ TzoShop để được hỗ trợ nhanh hơn về tài khoản, gói credits hoặc quá trình sử dụng.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CosmicButton href="/support" size="lg">Liên hệ hỗ trợ</CosmicButton>
              <CosmicButton href="mailto:support@tzoshop.io.vn" variant="secondary" size="lg"><Mail className="h-4 w-4" />Gửi email</CosmicButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


