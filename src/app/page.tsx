import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const apiFamilies = [
  {
    name: "CodexAI",
    desc: "Phù hợp cho lập trình, sửa lỗi, tối ưu code và các tác vụ hỗ trợ phát triển phần mềm.",
    logo: "/logos/codexai.svg",
  },
  {
    name: "Claude",
    desc: "Phù hợp cho phân tích nội dung, xử lý tài liệu, hỗ trợ viết và các tác vụ cần độ ổn định cao.",
    logo: "/logos/claude.svg",
  },
  {
    name: "Gemini",
    desc: "Phù hợp cho nhu cầu sử dụng linh hoạt hằng ngày, tốc độ tốt và hỗ trợ nhiều loại tác vụ.",
    logo: "/logos/gemini.svg",
  },
  {
    name: "DeepSeek",
    desc: "Phù hợp cho người dùng cần tối ưu chi phí mà vẫn đáp ứng tốt nhu cầu học tập và làm việc.",
    logo: "/logos/deepseek.svg",
  },
];

const steps = [
  {
    title: "Chọn gói phù hợp",
    desc: "Lựa chọn dòng AI và số credits phù hợp với nhu cầu sử dụng của bạn.",
  },
  {
    title: "Kích hoạt tài khoản",
    desc: "Sau khi hoàn tất đăng ký hoặc mua gói, bạn có thể bắt đầu sử dụng nhanh chóng.",
  },
  {
    title: "Kết nối với extension",
    desc: "Cấu hình thông tin sử dụng vào extension hoặc công cụ hỗ trợ mà bạn đang dùng.",
  },
  {
    title: "Theo dõi và quản lý",
    desc: "Dễ dàng theo dõi gói đã mua, thời hạn sử dụng và nhu cầu nâng cấp sau này.",
  },
];

const benefits = [
  "Dễ bắt đầu, phù hợp cho cả người mới và người dùng thường xuyên.",
  "Nhiều lựa chọn dòng AI cho các nhu cầu học tập, làm việc và sáng tạo.",
  "Có thể sử dụng cùng các extension và công cụ hỗ trợ phổ biến.",
  "Dễ quản lý gói đã mua, thời hạn sử dụng và mức credits còn lại.",
  "Linh hoạt lựa chọn gói ngắn hạn hoặc dài hạn theo nhu cầu.",
  "Thuận tiện nâng cấp khi nhu cầu sử dụng tăng lên.",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[#0b0f0d]">
      <SiteHeader />

      <section className="hero-gradient border-b border-[#edf1ee]">
        <div className="container-page py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex rounded-full border border-[#dfe5e1] bg-white/80 px-4 py-2 text-sm font-semibold text-[#47524d] backdrop-blur">
              Nền tảng API Credits dành cho developer
            </div>

            <h1 className="text-5xl font-semibold tracking-[-1.8px] text-[#0b0f0d] md:text-7xl md:leading-[1.05]">
              Truy cập nhiều dòng AI chỉ trong một nơi
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#47524d]">
              Cung cấp API Credits cho nhiều dòng AI phổ biến, dễ dàng sử dụng cùng các
              extension và công cụ hỗ trợ công việc hằng ngày.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/pricing" className="btn-accent">
                Xem bảng giá
              </Link>
              <Link href="/docs" className="btn-secondary">
                Xem tài liệu
              </Link>
            </div>
          </div>

          {/* Logo các dòng AI ở phần trên */}
          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-4">
            {apiFamilies.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-full border border-[#dfe5e1] bg-white/85 px-4 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#f3f7f5]">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                </div>
                <span className="text-sm font-semibold text-[#47524d]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-5xl rounded-xl border border-[#edf1ee] bg-white mockup-shadow">
            <div className="flex items-center gap-2 border-b border-[#edf1ee] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-4 font-mono text-xs text-[#66736d]">
                https://api.your-gateway.com/v1/chat/completions
              </span>
            </div>

            <div className="grid gap-0 md:grid-cols-[240px_1fr]">
              <aside className="hidden border-r border-[#edf1ee] bg-[#fbfbf8] p-5 md:block">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#66736d]">
                  Nhà cung cấp
                </p>
                {["CodexAI", "Claude", "Gemini", "DeepSeek"].map((item) => (
                  <div
                    key={item}
                    className="mb-2 rounded-md px-3 py-2 text-sm font-medium text-[#47524d]"
                  >
                    {item}
                  </div>
                ))}
              </aside>

              <div className="p-6 md:p-8">
                <div className="mb-6 flex flex-wrap gap-2">
                  {["sk-shop_xxxxx", "gpt-5.5", "credits: 1M", "active"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#dfe5e1] bg-[#f7f8f6] px-3 py-1 font-mono text-xs text-[#47524d]"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>

                <pre className="overflow-x-auto rounded-lg bg-[#101827] p-5 text-sm leading-6 text-white">
{`POST /v1/chat/completions
Authorization: Bearer sk-shop_xxxxx

{
  "model": "gpt-5.5",
  "messages": [
    { "role": "user", "content": "Review đoạn code này giúp tôi" }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
            Bán credits theo từng dòng AI
          </h2>
          <p className="mt-4 text-base leading-7 text-[#47524d]">
            Mỗi dòng AI phù hợp với một nhóm nhu cầu khác nhau, giúp bạn dễ chọn gói
            phù hợp với cách sử dụng của mình.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {apiFamilies.map((item) => (
            <div key={item.name} className="card-base p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#e7fff7]">
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#0b0f0d]">{item.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[#47524d]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f8f6] py-24">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="card-base p-8">
            <h2 className="text-3xl font-semibold tracking-[-0.5px] text-[#0b0f0d]">
              Bắt đầu thật đơn giản
            </h2>

            <div className="mt-8 space-y-5">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b0f0d] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[#0b0f0d]">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#47524d]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base p-8">
            <h2 className="text-3xl font-semibold tracking-[-0.5px] text-[#0b0f0d]">
              Lợi ích nổi bật
            </h2>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
                  <p className="text-sm leading-6 text-[#47524d]">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA dưới cùng */}
      <section className="container-page py-24">
        <div className="rounded-xl bg-[#020c0a] px-8 py-14 text-center">
          <h2 className="text-4xl font-semibold tracking-[-0.8px] text-white">
            Sẵn sàng tạo API key đầu tiên?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75">
            Chọn gói credits phù hợp và bắt đầu sử dụng cùng extension hoặc công cụ hỗ trợ của bạn.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/pricing"
              className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#020c0a] shadow-sm"
            >
              Đi tới bảng giá
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
