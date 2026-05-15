import Link from "next/link";
import { BookOpen, CircleHelp, Code2, KeyRound, ListChecks, Rocket } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingPublicFooter } from "@/components/layout/landing-public-chrome";

const quickStart = [
  "Tạo tài khoản và đăng nhập vào TzoShop.",
  "Chọn gói credits phù hợp với nhu cầu.",
  "Tạo API key trong khu vực quản lý.",
  "Kết nối key vào công cụ bạn đang dùng.",
];

const topics = [
  { icon: KeyRound, title: "Cách dùng key", desc: "Hướng dẫn tạo key, lưu trữ an toàn và luân chuyển key khi cần." },
  { icon: Code2, title: "Ví dụ request", desc: "Ví dụ gọi request chuẩn để bắt đầu test nhanh trong vài phút." },
  { icon: ListChecks, title: "Chọn model", desc: "Gợi ý chọn model theo mục tiêu: coding, viết nội dung, tác vụ tổng quát." },
  { icon: CircleHelp, title: "Lỗi thường gặp", desc: "Danh sách lỗi thường gặp và cách xử lý nhanh không gián đoạn công việc." },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 py-16 sm:py-20 lg:py-24">
        <div aria-hidden className="pointer-events-none absolute -right-20 top-6 h-72 w-72 rounded-full bg-gradient-to-br from-violet-300 to-indigo-300 opacity-20 blur-3xl tz-animate-soft-pulse" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Tài liệu
            </p>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl lg:text-5xl">
              Bắt đầu dùng TzoShop nhanh, rõ ràng và dễ triển khai
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Hướng dẫn tập trung vào quy trình thực tế: bắt đầu nhanh, dùng key an toàn, chọn model phù hợp và xử lý lỗi thường gặp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/api-docs" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold !text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_0_rgba(79,70,229,0.35)]">
                Mở tài liệu API
              </Link>
              <Link href="/plans" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-indigo-200 hover:bg-slate-50">
                Xem gói credits
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.10)]">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Rocket className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-950">Bắt đầu nhanh</h2>
            <ol className="mt-4 space-y-3">
              {quickStart.map((item, idx) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{idx + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </article>

          <div className="grid gap-5 sm:grid-cols-2">
            {topics.map((topic) => (
              <article
                key={topic.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.10)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.15),0_8px_10px_-6px_rgba(79,70,229,0.10)]"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <topic.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{topic.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{topic.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.10)] sm:p-8">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1 h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-950">Bạn cần tài liệu chi tiết hơn?</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Truy cập trang tài liệu API để xem endpoint, mẫu request/response, code mẫu và hướng dẫn cấu hình cho IDE hoặc extension.
                </p>
                <Link href="/api-docs" className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  Mở tài liệu API
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingPublicFooter />
    </main>
  );
}
