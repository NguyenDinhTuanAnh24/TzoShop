"use client";

import Link from "next/link";
import { ArrowRight, KeyRound, ShoppingBag, TerminalSquare, Wrench } from "lucide-react";
import { DocsCodeBlock } from "./code-block";

interface QuickStartProps {
  baseUrl: string;
  onGoCode: () => void;
}

export function DocsQuickStart({ baseUrl, onGoCode }: QuickStartProps) {
  const steps = [
    {
      title: "Mua hoặc kích hoạt gói credits",
      desc: "Bắt đầu với gói phù hợp để sử dụng model và API key.",
      href: "/plans",
      label: "Xem gói",
      icon: ShoppingBag,
      color: "bg-[#FFD93D]",
    },
    {
      title: "Tạo API key",
      desc: "Tạo key và quản lý key tại khu vực API Keys.",
      href: "/api-keys",
      label: "Tạo key",
      icon: KeyRound,
      color: "bg-[#C7F0D8]",
    },
    {
      title: "Cấu hình Base URL",
      desc: `Sử dụng Base URL production: ${baseUrl}`,
      href: "#",
      label: "Xem cấu hình",
      icon: Wrench,
      color: "bg-[#A78BFA]",
    },
    {
      title: "Gửi request đầu tiên",
      desc: "Dùng endpoint Chat Completions theo chuẩn OpenAI-compatible.",
      href: "#",
      label: "Mở ví dụ code",
      icon: TerminalSquare,
      color: "bg-[#FF6B6B]",
    },
  ];

  const minBody = `{
  "model": "codexai/gpt-5.3-codex",
  "messages": [
    {
      "role": "user",
      "content": "Hello, TzoShop API"
    }
  ]
}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center border-4 border-black text-black shadow-[3px_3px_0px_0px_#000] ${step.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black text-black">{step.title}</h3>
              <p className="mt-2 text-sm font-bold text-black/70">{step.desc}</p>
              {step.href.startsWith("/") ? (
                <Link href={step.href} className="mt-3 inline-flex items-center text-xs font-black uppercase text-black underline">
                  {step.label}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onGoCode}
                  className="mt-3 inline-flex items-center text-xs font-black uppercase text-black underline"
                >
                  {step.label}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </button>
              )}
            </article>
          );
        })}
      </div>

      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-lg font-black uppercase text-black">Request body tối thiểu</h3>
        <DocsCodeBlock code={minBody} title="JSON" />
      </section>
    </div>
  );
}
