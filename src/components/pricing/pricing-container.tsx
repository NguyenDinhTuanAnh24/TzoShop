"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/pricing-card";

type ApiFamily = "CODEXAI" | "CLAUDE" | "GEMINI" | "DEEPSEEK";

type Product = {
  id: string;
  name: string;
  slug: string;
  apiFamily: ApiFamily;
  credits: bigint | number;
  durationDays: number;
  priceVnd: number;
  allowedModels: string[];
};

type FamilyItem = {
  id: ApiFamily;
  label: string;
};

type PricingContainerProps = {
  products: Product[];
};

const families: FamilyItem[] = [
  { id: "CODEXAI", label: "CodexAI" },
  { id: "CLAUDE", label: "Claude" },
  { id: "GEMINI", label: "Gemini" },
  { id: "DEEPSEEK", label: "DeepSeek" },
];

const familyInfo: Record<
  ApiFamily,
  {
    title: string;
    desc: string;
  }
> = {
  CODEXAI: {
    title: "CodexAI Credits",
    desc: "Phù hợp cho lập trình, sửa lỗi, refactor và các tác vụ hỗ trợ phát triển phần mềm.",
  },
  CLAUDE: {
    title: "Claude Credits",
    desc: "Phù hợp cho phân tích nội dung, hỗ trợ viết, xử lý tài liệu và các tác vụ cần độ ổn định cao.",
  },
  GEMINI: {
    title: "Gemini Credits",
    desc: "Phù hợp cho nhu cầu sử dụng linh hoạt hằng ngày, tốc độ tốt và nhiều loại tác vụ.",
  },
  DEEPSEEK: {
    title: "DeepSeek Credits",
    desc: "Phù hợp cho người dùng cần tối ưu chi phí cho học tập, làm việc và hỗ trợ lập trình.",
  },
};

export function PricingContainer({ products }: PricingContainerProps) {
  const [activeFamily, setActiveFamily] = useState<ApiFamily>("CODEXAI");

  const activeProducts = products.filter(
    (product) => product.apiFamily === activeFamily,
  );

  return (
    <section className="container-page py-16">
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {families.map((family) => {
          const isActive = activeFamily === family.id;

          return (
            <button
              key={family.id}
              type="button"
              onClick={() => setActiveFamily(family.id)}
              className={
                isActive
                  ? "rounded-full border border-[#00d4a4] bg-[#00d4a4] px-5 py-2 text-sm font-bold text-[#0b0f0d]"
                  : "rounded-full border border-[#dfe5e1] bg-white px-5 py-2 text-sm font-semibold text-[#47524d] transition hover:text-[#0b0f0d]"
              }
            >
              {family.label}
            </button>
          );
        })}
      </div>

      <div className="mb-8 max-w-2xl">
        <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
          {familyInfo[activeFamily].title}
        </h2>

        <p className="mt-4 text-base leading-7 text-[#47524d]">
          {familyInfo[activeFamily].desc}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {activeProducts.map((product) => (
          <PricingCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            credits={product.credits}
            durationDays={product.durationDays}
            priceVnd={product.priceVnd}
            allowedModels={product.allowedModels}
            featured={
              product.name.includes("Plus") ||
              product.name.includes("Pro")
            }
          />
        ))}
      </div>
    </section>
  );
}
