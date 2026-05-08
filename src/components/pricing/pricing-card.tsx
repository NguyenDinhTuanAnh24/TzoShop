import Link from "next/link";
import { formatCredits, formatDuration, formatVnd } from "@/lib/format";

type PricingCardProps = {
  id: string;
  name: string;
  slug: string;
  credits: bigint | number;
  durationDays: number;
  priceVnd: number;
  allowedModels: string[];
  featured?: boolean;
};

export function PricingCard({
  name,
  slug,
  credits,
  durationDays,
  priceVnd,
  allowedModels,
  featured = false,
}: PricingCardProps) {
  return (
    <div
      className={
        featured
          ? "relative rounded-xl border-2 border-[#00d4a4] bg-white p-7 shadow-[0_8px_24px_rgba(0,212,164,0.12)]"
          : "rounded-xl border border-[#dfe5e1] bg-white p-7"
      }
    >
      {featured && (
        <div className="absolute right-5 top-5 rounded-full bg-[#00d4a4] px-3 py-1 text-xs font-bold text-[#0b0f0d]">
          Phổ biến
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold tracking-[-0.4px] text-[#0b0f0d]">
          {name}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#66736d]">
          {formatCredits(credits)} · {formatDuration(durationDays)}
        </p>
      </div>

      <div className="mt-7">
        <p className="text-4xl font-semibold tracking-[-1px] text-[#0b0f0d]">
          {formatVnd(priceVnd)}
        </p>
      </div>

      <Link
        href="/plans"
        className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#0d8f73] px-5 text-sm font-bold text-white transition hover:bg-[#08745e]"
      >
        Chọn gói này
      </Link>

      <div className="mt-7 border-t border-[#edf1ee] pt-6">
        <p className="text-sm font-semibold text-[#0b0f0d]">Bao gồm:</p>

        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
            <p className="text-sm leading-6 text-[#47524d]">
              Credits sử dụng trong thời hạn gói
            </p>
          </div>

          <div className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
            <p className="text-sm leading-6 text-[#47524d]">
              Hỗ trợ sử dụng cùng extension và công cụ phù hợp
            </p>
          </div>

          <div className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
            <p className="text-sm leading-6 text-[#47524d]">
              Quản lý gói và theo dõi mức sử dụng
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-[#0b0f0d]">
          Model hỗ trợ:
        </p>

        <div className="flex flex-wrap gap-2">
          {allowedModels.slice(0, 4).map((model) => (
            <span
              key={model}
              className="rounded-full border border-[#dfe5e1] bg-[#f7f8f6] px-3 py-1 font-mono text-xs text-[#47524d]"
            >
              {model}
            </span>
          ))}

          {allowedModels.length > 4 && (
            <span className="rounded-full border border-[#dfe5e1] bg-[#f7f8f6] px-3 py-1 text-xs font-medium text-[#47524d]">
              +{allowedModels.length - 4} model
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
