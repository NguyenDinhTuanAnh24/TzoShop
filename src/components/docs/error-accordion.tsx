"use client";

import { useState } from "react";

interface ErrorItem {
  code: string;
  title: string;
  description: string;
  solution: string;
  tone: "danger" | "warning";
}

const ERRORS: ErrorItem[] = [
  {
    code: "401",
    title: "Unauthorized",
    description: "API key sai, thiếu Authorization header hoặc key đã bị thu hồi.",
    solution: "Kiểm tra lại API key và header Authorization: Bearer YOUR_TZOSHOP_API_KEY.",
    tone: "danger",
  },
  {
    code: "402",
    title: "Insufficient credits",
    description: "Tài khoản không đủ credits để xử lý request.",
    solution: "Mua thêm credits hoặc kiểm tra Usage để tối ưu request.",
    tone: "warning",
  },
  {
    code: "404",
    title: "Model not found",
    description: "Model gửi lên không hợp lệ hoặc không nằm trong gói của bạn.",
    solution: "Kiểm tra lại tên model trong tab Models hoặc My Plans.",
    tone: "warning",
  },
  {
    code: "429",
    title: "Rate limited",
    description: "Bạn gửi quá nhiều request trong thời gian ngắn.",
    solution: "Giảm tần suất gọi API và thêm retry backoff.",
    tone: "warning",
  },
  {
    code: "500|503",
    title: "Server error",
    description: "Hệ thống tạm thời gián đoạn hoặc upstream đang quá tải.",
    solution: "Thử lại sau hoặc gửi hỗ trợ nếu lỗi kéo dài.",
    tone: "danger",
  },
];

export function DocsErrorAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {ERRORS.map((err, index) => {
        const isOpen = openIndex === index;
        const contentId = `error-details-${err.code.replace("|", "-")}`;
        return (
          <article key={err.code} className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start justify-between gap-4 text-left"
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <div className="flex items-start gap-4">
                <div
                  className={[
                    "flex h-12 w-12 shrink-0 border-4 border-black text-black shadow-[3px_3px_0px_0px_#000]",
                    err.tone === "danger" ? "bg-[#FF6B6B]" : "bg-[#FFD93D]",
                    err.code === "500|503" ? "flex-col items-center justify-center text-[10px] leading-none" : "items-center justify-center text-xs font-black",
                  ].join(" ")}
                >
                  {err.code === "500|503" ? (
                    <>
                      <span className="font-black">500</span>
                      <span className="font-black">503</span>
                    </>
                  ) : (
                    <span className="font-black">{err.code}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-black">{err.title}</h3>
                  <p className="mt-1 text-sm font-bold text-black/70">{err.description}</p>
                </div>
              </div>
              <span className="text-xs font-black uppercase text-black">{isOpen ? "Ẩn" : "Xem"}</span>
            </button>

            {isOpen ? (
              <div id={contentId} className="mt-4 border-2 border-black bg-[#C7F0D8] p-3">
                <p className="text-sm font-bold text-black">{err.solution}</p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
