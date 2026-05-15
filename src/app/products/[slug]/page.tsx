import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LandingPublicFooter, LandingPublicNavbar } from "@/components/layout/landing-public-chrome";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { TextFadeInUp } from "@/components/ui/text-fade-in-up";
import { creditPageBySlug, creditProductPages } from "@/lib/credit-product-pages";

type ProductPageParams = {
  slug: string;
};

const planPresets = [
  {
    title: "Mini",
    subtitle: "Thử nghiệm",
    desc: "Phù hợp để bắt đầu nhanh và kiểm tra mức sử dụng thực tế.",
  },
  {
    title: "Plus",
    subtitle: "Dùng thường xuyên",
    desc: "Cân bằng giữa chi phí và hiệu quả cho công việc mỗi ngày.",
  },
  {
    title: "Pro / Max",
    subtitle: "Nhu cầu cao",
    desc: "Phù hợp workflow chuyên sâu với tần suất sử dụng lớn hơn.",
  },
];

export function generateStaticParams() {
  return creditProductPages.map((item) => ({ slug: item.slug }));
}

export default async function ProductCreditPage({
  params,
}: {
  params: Promise<ProductPageParams>;
}) {
  const { slug } = await params;
  const product = creditPageBySlug[slug];

  if (!product) notFound();

  const planLink = `/plans?family=${product.family}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-950">
      <LandingPublicNavbar />

      <section className="relative overflow-hidden border-b border-slate-200 py-16 sm:py-20 lg:py-24">
        <div aria-hidden className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-20 blur-3xl tz-animate-soft-pulse" />
        <div aria-hidden className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-20 blur-3xl tz-animate-soft-pulse tz-delay-200" />

        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="tz-animate-fade-up">
            <TextFadeInUp as="p" className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {product.badge}
            </TextFadeInUp>
            <TextFadeInUp as="h1" delay={0.08} className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {product.title}
            </TextFadeInUp>
            <TextFadeInUp as="p" delay={0.14} className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {product.description}
            </TextFadeInUp>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row tz-animate-fade-up tz-delay-300">
              <CosmicButton href={planLink}>
                Xem gói credits
              </CosmicButton>
              <CosmicButton href="/?auth=register" variant="secondary">
                Bắt đầu sử dụng
              </CosmicButton>
            </div>
          </div>

          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] backdrop-blur transition-all duration-300 ease-out hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)] tz-animate-fade-up tz-delay-300 lg:tz-animate-float sm:p-7">
            <TextFadeInUp as="h2" className="text-xl font-bold text-slate-950">Tổng quan nhanh</TextFadeInUp>
            <TextFadeInUp as="p" delay={0.08} className="mt-2 text-sm leading-7 text-slate-600">
              Dòng credits này phù hợp cho người dùng cần workflow ổn định, dễ theo dõi và linh hoạt mở rộng theo nhu cầu thực tế.
            </TextFadeInUp>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.bestFor.map((item) => (
                <div
                  key={`${product.slug}-best-${item}`}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition-all duration-300 ease-out hover:border-indigo-200 hover:bg-white hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
                >
                  <p className="text-sm font-semibold text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 tz-animate-fade-up sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] backdrop-blur transition-all duration-300 ease-out hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)] sm:p-8">
          <TextFadeInUp as="h2" className="text-3xl font-extrabold text-slate-950 sm:text-4xl">{product.audienceTitle}</TextFadeInUp>
          <TextFadeInUp as="p" delay={0.08} className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{product.audienceDescription}</TextFadeInUp>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.bestFor.map((item) => (
                <li
                  key={`${product.slug}-overview-${item}`}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                  <span className="text-sm text-slate-700 sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 tz-animate-fade-up sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Use Cases phổ biến</h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
            Một số tình huống sử dụng thường gặp khi bạn triển khai {product.badge} cho công việc hằng ngày.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {product.useCases.map((item) => (
              <article
                key={`${product.slug}-usecase-${item}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.10)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
              >
                <p className="text-base font-semibold text-slate-900">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 tz-animate-fade-up sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Gợi ý gói theo nhu cầu</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {planPresets.map((plan) => (
              <article
                key={`${product.slug}-plan-${plan.title}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.10)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{plan.subtitle}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-950">{plan.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{plan.desc}</p>
                <Link href={planLink} className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700">
                  Xem gói phù hợp
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 tz-animate-fade-up sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Bắt đầu trong 3 bước</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Chọn gói credits",
                desc: "Chọn gói theo nhu cầu hiện tại, có thể nâng cấp khi tần suất sử dụng tăng.",
              },
              {
                title: "Tạo key hoặc kết nối sử dụng",
                desc: "Thiết lập thông tin cần thiết trong công cụ quen thuộc để bắt đầu làm việc.",
              },
              {
                title: "Theo dõi credits và mức dùng",
                desc: "Kiểm tra usage định kỳ để kiểm soát ngân sách và tránh gián đoạn.",
              },
            ].map((step, index) => (
              <article
                key={`${product.slug}-step-${step.title}`}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 tz-animate-fade-up sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">FAQ nhanh</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {product.faqs.map((item) => (
              <article
                key={`${product.slug}-faq-${item.q}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.10)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
              >
                <h3 className="text-base font-bold text-slate-950">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 tz-animate-fade-up sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-[0_24px_80px_-28px_rgba(79,70,229,0.45)] transition-all duration-300 ease-out hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)] sm:p-10">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Sẵn sàng bắt đầu với {product.badge}?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
              Chọn gói phù hợp và bắt đầu sử dụng ngay trên nền tảng TzoShop.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CosmicButton href={planLink}>
                Xem gói credits
              </CosmicButton>
              <CosmicButton href="/?auth=register" variant="secondary">
                Tạo tài khoản
              </CosmicButton>
            </div>
          </div>
        </div>
      </section>

      <LandingPublicFooter />
    </main>
  );
}
