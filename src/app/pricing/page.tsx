import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingPublicFooter } from "@/components/layout/landing-public-chrome";
import { PricingContainer } from "@/components/pricing/pricing-container";
import { getActiveProducts } from "@/server/products/get-products";

const faqItems = [
  {
    question: "Credits dùng để làm gì?",
    answer: "Credits là đơn vị sử dụng cho từng dòng AI. Khi bạn gửi yêu cầu, credits sẽ được trừ theo model và gói tương ứng.",
  },
  {
    question: "Có thể nâng cấp gói sau khi đang dùng không?",
    answer: "Có. Bạn có thể mua thêm gói hoặc chuyển sang mức cao hơn khi nhu cầu sử dụng tăng.",
  },
  {
    question: "Làm sao theo dõi mức dùng?",
    answer: "Bạn có thể theo dõi credits còn lại, lịch sử sử dụng và trạng thái gói ngay trong tài khoản.",
  },
  {
    question: "Nếu chưa chắc nhu cầu thì nên chọn gói nào?",
    answer: "Nên bắt đầu từ gói nhỏ để đo nhu cầu thực tế, sau đó nâng cấp để tối ưu chi phí.",
  },
];

export default async function PricingPage() {
  const rawProducts = await getActiveProducts();
  const products = rawProducts.map((p) => ({ ...p, credits: Number(p.credits) }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 py-16 sm:py-20 lg:py-24">
        <div aria-hidden className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-20 blur-3xl tz-animate-soft-pulse" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Gói credits
            </p>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-950 sm:text-4xl lg:text-5xl">
              Chọn gói phù hợp với nhu cầu sử dụng AI của bạn
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Linh hoạt theo từng dòng AI, dễ theo dõi credits và kiểm soát chi phí.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing-plans" className="py-10 sm:py-12">
        <PricingContainer products={products} />
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">Câu hỏi thường gặp</h2>
            <p className="mt-3 text-slate-600">Một số câu hỏi phổ biến trước khi chọn gói credits.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.10)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.15),0_8px_10px_-6px_rgba(79,70,229,0.10)]"
              >
                <h3 className="text-lg font-bold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-10 text-center shadow-[0_20px_60px_-20px_rgba(79,70,229,0.45)] sm:px-10">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Chưa chắc nên chọn gói nào?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              Bắt đầu từ gói nhỏ để kiểm tra nhu cầu thực tế, sau đó nâng cấp khi khối lượng công việc tăng.
            </p>
            <div className="mt-7">
              <Link
                href="#pricing-plans"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 bg-white/15 px-6 py-3 text-sm font-semibold !text-white transition hover:bg-white/20"
              >
                Xem các gói
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingPublicFooter />
    </main>
  );
}
