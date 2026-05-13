import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "danger" | "neutral" | "info";
  className?: string;
}

export function StatusBadge({ status, variant = "neutral", className }: StatusBadgeProps) {
  const variants = {
    success: "bg-[#C7F0D8]",
    warning: "bg-[#FFD93D]",
    danger: "bg-[#FF6B6B]",
    neutral: "bg-[#E9E1D0]",
    info: "bg-[#A78BFA]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[6px] border-2 border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-black shadow-[2px_2px_0px_0px_#000]",
        variants[variant],
        className
      )}
    >
      {status}
    </span>
  );
}
