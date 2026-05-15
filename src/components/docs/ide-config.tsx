"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DocsCopyButton } from "./copy-button";

interface IdeConfigProps {
  baseUrl: string;
}

export function DocsIdeConfig({ baseUrl }: IdeConfigProps) {
  const [openAdvanced, setOpenAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000]">
        <h3 className="text-xl font-black uppercase text-black">Hướng dẫn cấu hình IDE/Extension</h3>
        <p className="mt-2 text-sm font-bold text-black/70">
          Thiết lập công cụ hỗ trợ OpenAI-compatible API bằng thông tin dưới đây.
        </p>

        <div className="mt-5 grid gap-4">
          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
            <p className="text-xs font-black uppercase tracking-wide text-black">Base URL</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="break-all font-mono text-sm font-bold text-black">{baseUrl}</code>
              <DocsCopyButton text={baseUrl} ariaLabel="Sao chép Base URL" className="h-8 w-8" />
            </div>
          </div>

          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
            <p className="text-xs font-black uppercase tracking-wide text-black">API Key</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="break-all font-mono text-sm font-bold text-black">YOUR_TZOSHOP_API_KEY</code>
              <DocsCopyButton text="YOUR_TZOSHOP_API_KEY" ariaLabel="Sao chép API key mẫu" className="h-8 w-8" />
            </div>
          </div>

          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
            <p className="text-xs font-black uppercase tracking-wide text-black">Model</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="break-all font-mono text-sm font-bold text-black">codexai/gpt-5.3-codex</code>
              <DocsCopyButton text="codexai/gpt-5.3-codex" ariaLabel="Sao chép model mẫu" className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="mt-5 border-4 border-black bg-[#C7F0D8] p-4 shadow-[4px_4px_0px_0px_#000]">
          <p className="text-sm font-bold text-black">
            Mẹo: dùng đúng Base URL production và model thuộc gói đang hoạt động để tránh lỗi 401/402/404.
          </p>
        </div>
      </section>

      <section className="overflow-hidden border-4 border-black bg-[#FFFDF5] shadow-[6px_6px_0px_0px_#000]">
        <button
          type="button"
          onClick={() => setOpenAdvanced((v) => !v)}
          className="flex w-full items-center justify-between p-5 text-left hover:bg-[#FFD93D]/25"
          aria-expanded={openAdvanced}
        >
          <span className="text-sm font-black uppercase text-black">Thông tin kỹ thuật</span>
          <ChevronDown className={`h-5 w-5 text-black transition-transform ${openAdvanced ? "rotate-180" : ""}`} />
        </button>
        {openAdvanced ? (
          <div className="border-t-4 border-black bg-white p-5">
            <p className="text-sm font-bold text-black/80">Header mẫu:</p>
            <code className="mt-2 block break-all font-mono text-sm font-bold text-black">
              Authorization: Bearer YOUR_TZOSHOP_API_KEY
            </code>
            <code className="mt-1 block break-all font-mono text-sm font-bold text-black">Content-Type: application/json</code>
          </div>
        ) : null}
      </section>
    </div>
  );
}
