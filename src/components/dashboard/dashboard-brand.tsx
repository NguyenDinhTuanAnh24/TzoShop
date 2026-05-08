import Image from "next/image";
import Link from "next/link";

export default function DashboardBrand() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-[#f4f8f6]"
    >
      <div className="shrink-0">
        <Image
          src="/favicon.png"
          alt="TzoShop"
          width={42}
          height={42}
          className="h-10 w-10 rounded-xl object-contain"
        />
      </div>

      <div className="leading-none">
        <span
          className="
            block
            text-[28px]
            font-extrabold
            tracking-[-0.03em]
            text-transparent
            bg-clip-text
            bg-[linear-gradient(90deg,#022c22_0%,#065f46_35%,#10b981_100%)]
          "
        >
          TzoShop
        </span>
      </div>
    </Link>
  );
}
