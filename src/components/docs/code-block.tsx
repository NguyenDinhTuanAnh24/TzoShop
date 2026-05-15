"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DocsCodeBlock({ code, title }: { code: string; language?: string; title?: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const { showToast } = useToast(3000);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      showToast("Đã sao chép", "success");
      window.setTimeout(() => setIsCopied(false), 3000);
    } catch {
      showToast("Không thể sao chép. Vui lòng thử lại.", "error");
    }
  };

  return (
    <div className="mt-4 overflow-hidden border-4 border-black bg-black shadow-[6px_6px_0px_0px_#000]">
      <div className="flex items-center justify-between gap-3 border-b-2 border-black bg-[#111827] px-4 py-2">
        <span className="text-xs font-black uppercase tracking-wide text-[#FFFDF5]">{title ?? "Code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Sao chép code"
          className="inline-flex items-center gap-1 border-2 border-black bg-[#FFD93D] px-2 py-1 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {isCopied ? "Đã sao chép" : "Copy"}
        </button>
      </div>
      <pre className="max-w-full overflow-x-auto p-4 text-sm leading-relaxed text-[#FFFDF5]">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
