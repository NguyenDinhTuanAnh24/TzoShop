"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/pricing-card";
import { CheckCircle2, ShieldCheck, History, ChevronDown, ChevronUp } from "lucide-react";

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
  apiKeyLimit?: number;
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

const commonFeatures = [
  {
    icon: CheckCircle2,
    title: "Quản lý credits và thời hạn",
    desc: "Theo dõi số dư và ngày hết hạn cho từng dòng AI."
  },
  {
    icon: ShieldCheck,
    title: "Tạo API key theo gói",
    desc: "Tạo key riêng biệt cho từng extension hoặc ứng dụng."
  },
  {
    icon: History,
    title: "Theo dõi lịch sử sử dụng",
    desc: "Xem chi tiết từng lượt gọi API và số credits đã dùng."
  }
];

export function PricingContainer({ products }: PricingContainerProps) {
  const [activeFamily, setActiveFamily] = useState<ApiFamily>("CODEXAI");

  const activeProducts = products.filter(
    (product) => product.apiFamily === activeFamily,
  );

  const [isExpanded, setIsExpanded] = useState(false);

  // Reset khi đổi family
  const handleFamilyChange = (familyId: ApiFamily) => {
    setActiveFamily(familyId);
    setIsExpanded(false);
  };

  const visibleProducts = isExpanded ? activeProducts : activeProducts.slice(0, 3);
  const hiddenCount = activeProducts.length - visibleProducts.length;

  return (
    <section className="container-page py-16">
      {/* Description Section */}
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        {commonFeatures.map((item) => (
          <div key={item.title} className="flex gap-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {families.map((family) => {
          const isActive = activeFamily === family.id;

          return (
            <button
              key={family.id}
              type="button"
              onClick={() => handleFamilyChange(family.id)}
              className={
                isActive
                  ? "rounded-full border border-emerald-500 bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200"
                  : "rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600"
              }
            >
              {family.label}
            </button>
          );
        })}
      </div>

      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black tracking-tight text-slate-900">
          {familyInfo[activeFamily].title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-slate-500">
          {familyInfo[activeFamily].desc}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product) => (
          <PricingCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            credits={product.credits}
            durationDays={product.durationDays}
            priceVnd={product.priceVnd}
            allowedModels={product.allowedModels}
            apiKeyLimit={product.apiKeyLimit}
            featured={
              product.name.includes("Plus") ||
              product.name.includes("Pro")
            }
          />
        ))}
      </div>

      {activeProducts.length > 3 && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-8 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Xem thêm {hiddenCount} gói
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
