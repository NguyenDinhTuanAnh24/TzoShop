import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PricingContainer } from "@/components/pricing/pricing-container";
import { getActiveProducts } from "@/server/products/get-products";

const faqItems = [
  {
    question: "Credits dùng để làm gì?",
    answer:
      "Credits là số dư sử dụng cho từng dòng AI. Khi bạn sử dụng dịch vụ, credits sẽ được trừ theo gói và model tương ứng.",
  },
  {
    question: "Mua CodexAI có dùng được Claude không?",
    answer:
      "Không. Mỗi dòng AI có credits riêng. Bạn cần mua đúng gói của dòng AI muốn sử dụng.",
  },
  {
    question: "Gói có thời hạn không?",
    answer:
      "Không. Các gói credits tại TzoShop thường không giới hạn thời gian sử dụng. Bạn có thể yên tâm dùng đến khi hết credits thì thôi.",
  },
  {
    question: "Có thể nâng cấp gói sau này không?",
    answer:
      "Có. Bạn có thể chọn gói cao hơn hoặc mua thêm credits bất cứ lúc nào khi nhu cầu sử dụng tăng lên.",
  },
];

export default async function PricingPage() {
  const rawProducts = await getActiveProducts();
  
  // Convert BigInt to number for client-side serialization
  const products = rawProducts.map(p => ({
    ...p,
    credits: Number(p.credits)
  }));

  return (
    <main className="min-h-screen bg-white text-[#0b0f0d]">
      <SiteHeader />

      <section className="hero-gradient border-b border-[#edf1ee]">
        <div className="container-page py-20 text-center md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-[#dfe5e1] bg-white/80 px-4 py-2 text-sm font-semibold text-[#47524d] backdrop-blur">
              Bảng giá API Credits
            </div>

            <h1 className="text-5xl font-semibold tracking-[-1.5px] text-[#0b0f0d] md:text-6xl md:leading-[1.08]">
              Chọn gói phù hợp với nhu cầu sử dụng của bạn
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#47524d]">
              Mỗi dòng AI có các gói credits riêng, giúp bạn dễ lựa chọn theo
              mục đích sử dụng, ngân sách và nhu cầu.
            </p>
          </div>
        </div>
      </section>

      <div id="pricing-plans">
        <PricingContainer products={products} />
      </div>

      <section className="bg-[#f7f8f6] py-20">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
              Câu hỏi thường gặp
            </h2>

            <p className="mt-4 text-base leading-7 text-[#47524d]">
              Một số câu hỏi phổ biến trước khi chọn gói.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="card-base p-6">
                <h3 className="text-lg font-semibold text-[#0b0f0d]">
                  {item.question}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#47524d]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="rounded-xl bg-[#020c0a] px-8 py-14 text-center">
          <h2 className="text-4xl font-semibold tracking-[-0.8px] text-white">
            Chưa biết nên chọn gói nào?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75">
            Bạn có thể bắt đầu với gói nhỏ để trải nghiệm, sau đó nâng cấp khi
            nhu cầu sử dụng tăng lên.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="#pricing-plans"
              className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#020c0a] shadow-sm"
            >
              Xem các gói
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
