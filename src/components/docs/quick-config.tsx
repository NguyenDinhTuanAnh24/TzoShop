"use client";

import Link from "next/link";
import { KeyRound, ListTree, PlugZap } from "lucide-react";
import { AppButton } from "@/components/ui/app-button";

export function DocsQuickConfig({ onOpenCodeExamples }: { onOpenCodeExamples: () => void }) {
  const steps = [
    {
      title: "Tạo API key",
      description: "Tạo key trong trang API Keys sau khi đã có gói credits.",
      icon: KeyRound,
      color: "bg-[#FFD93D]",
    },
    {
      title: "Chọn model",
      description: "Chọn model phù hợp với dòng AI trong gói của bạn.",
      icon: ListTree,
      color: "bg-[#C7F0D8]",
    },
    {
      title: "Kết nối công cụ",
      description: "Dán API key vào extension, IDE hoặc API client và bắt đầu sử dụng.",
      icon: PlugZap,
      color: "bg-[#A78BFA]",
    },
  ];

  return (
    <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
      <h3 className="text-2xl font-black uppercase text-black md:text-3xl">Bắt đầu sử dụng API</h3>
      <p className="mt-2 text-sm font-bold text-black/70 md:text-base">
        Dùng API key TzoShop để kết nối với extension, IDE hoặc API client tương thích.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[4px_4px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:bg-[#FFD93D]/20"
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center border-2 border-black text-black shadow-[2px_2px_0px_0px_#000] ${step.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-base font-black uppercase text-black">{step.title}</h4>
              <p className="mt-2 text-sm font-bold text-black/70">{step.description}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/api-keys" className="w-full sm:w-auto">
          <AppButton variant="primary" className="h-11 w-full px-5 sm:w-auto">
            Tạo API key
          </AppButton>
        </Link>
        <AppButton variant="secondary" className="h-11 w-full px-5 sm:w-auto" onClick={onOpenCodeExamples}>
          Xem ví dụ code
        </AppButton>
      </div>
    </section>
  );
}
