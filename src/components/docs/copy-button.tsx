"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function DocsCopyButton({
  text,
  className,
  ariaLabel,
}: {
  text: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { showToast } = useToast(3000);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast("Đã sao chép", "success");
      window.setTimeout(() => setIsCopied(false), 3000);
    } catch {
      showToast("Không thể sao chép. Vui lòng thử lại.", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? "Sao chép"}
      title={ariaLabel ?? "Sao chép"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-0.5 hover:bg-[#FFD93D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        className,
      )}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
