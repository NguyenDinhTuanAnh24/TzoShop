"use client";

import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { AppButton } from "@/components/ui/app-button";

export function DocsSupportCard() {
  return (
    <section className="border-4 border-black bg-[#111827] p-6 text-[#FFFDF5] shadow-[8px_8px_0px_0px_#000] md:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border-4 border-black bg-[#FFD93D] text-black shadow-[4px_4px_0px_0px_#FFFDF5]">
            <LifeBuoy className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Cần hỗ trợ kết nối?</h3>
            <p className="mt-2 text-sm font-bold text-[#FFFDF5]/85 md:text-base">
              Nếu bạn gặp lỗi khi cấu hình API key hoặc model, hãy gửi yêu cầu hỗ trợ để TzoShop kiểm tra.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <Link href="/support" className="w-full sm:w-auto">
            <AppButton
              variant="accent"
              className="h-12 w-full px-6 shadow-[5px_5px_0px_0px_#FFFDF5] sm:w-auto"
            >
              Gửi hỗ trợ
            </AppButton>
          </Link>
          <Link href="/usage" className="w-full sm:w-auto">
            <AppButton
              variant="secondary"
              className="h-12 w-full bg-[#FFFDF5] px-6 text-black shadow-[5px_5px_0px_0px_#FFFDF5] hover:bg-[#FFD93D] sm:w-auto"
            >
              Xem usage
            </AppButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
