import { LandingPublicFooter, LandingPublicNavbar } from "@/components/layout/landing-public-chrome";
import { TextFadeInUp } from "@/components/ui/text-fade-in-up";
import { FaqContent } from "./faq-content";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-950">
      <LandingPublicNavbar />

      <section className="relative overflow-hidden border-b border-slate-200 py-20 sm:py-24 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-8 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-20 blur-3xl tz-animate-soft-pulse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-20 blur-3xl tz-animate-soft-pulse tz-delay-200"
        />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <TextFadeInUp as="p" className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            FAQ
          </TextFadeInUp>
          <TextFadeInUp as="h1" delay={0.08} className="mt-5 text-4xl font-extrabold text-slate-950 sm:text-5xl lg:text-6xl">
            Câu hỏi thường gặp
          </TextFadeInUp>
          <TextFadeInUp as="p" delay={0.14} className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Tìm câu trả lời cho các thắc mắc phổ biến về gói credits, thanh toán, tài khoản và cách sử dụng TzoShop.
          </TextFadeInUp>
        </div>
      </section>

      <FaqContent />

      <LandingPublicFooter />
    </main>
  );
}
