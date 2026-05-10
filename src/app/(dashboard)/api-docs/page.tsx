"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MODEL_FAMILIES,
  MODEL_REGISTRY,
  type ModelFamily,
  getModelsByFamily,
} from "@/lib/model-registry";
import { buttonStyles } from "@/lib/ui-styles";
import DashboardSubNav from "@/components/dashboard/dashboard-sub-nav";

export default function ApiDocsPage() {
  const [selectedFamily, setSelectedFamily] = useState<ModelFamily>("CodexAI");
  const [showAllModels, setShowAllModels] = useState(false);

  const models = getModelsByFamily(selectedFamily);
  const visibleModels = showAllModels ? models : models.slice(0, 5);

  return (
    <div className="space-y-6">
      <DashboardSubNav 
        items={[
          { label: "API Keys", href: "/api-keys" },
          { label: "Tài liệu API", href: "/api-docs" },
          { label: "Lịch sử sử dụng", href: "/usage" },
        ]} 
      />
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-500 p-8 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-100">
          Tài liệu API
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Kết nối tất cả model bằng một endpoint chung
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50">
          TzoShop sử dụng một endpoint duy nhất cho nhiều dòng AI. Bạn chỉ cần
          thay đổi trường model trong request để chọn CodexAI, Claude, Gemini
          hoặc DeepSeek.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/api-keys"
            className={`${buttonStyles.whiteOnGreen} min-w-[170px]`}
          >
            Quản lý API key
          </Link>

          <Link
            href="/usage"
            className={`${buttonStyles.outlineOnGreen} min-w-[130px]`}
          >
            Xem usage
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Base URL
          </p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Production
              </p>
              <code className="mt-1 block break-all rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-950">
                https://api.tzoshop.vn/v1
              </code>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Local Test
              </p>
              <code className="mt-1 block break-all rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-950">
                http://localhost:3004/api/v1
              </code>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Chat completions
          </p>
          <code className="mt-3 block break-all rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-950">
            POST /chat/completions
          </code>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Models
          </p>
          <code className="mt-3 block break-all rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-950">
            GET /models
          </code>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          Xác thực bằng API key
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Mỗi request cần gửi API key trong header Authorization. API key được
          tạo tại trang API Keys và sẽ quyết định dòng credits mà bạn được phép
          sử dụng.
        </p>

        <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-sm text-slate-100">
          <pre className="whitespace-pre-wrap break-words leading-6">
{`Authorization: Bearer tz_xxx
Content-Type: application/json`}
          </pre>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          Lấy danh sách model
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Bạn có thể gọi endpoint dưới đây để lấy toàn bộ model đang được TzoShop hỗ trợ.
          Danh sách này được chia theo family như CodexAI, Claude, Gemini và DeepSeek.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Endpoint
            </p>
            <code className="mt-2 block break-all text-sm font-bold text-slate-950">
              GET /models
            </code>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Local test
            </p>
            <code className="mt-2 block break-all text-sm font-bold text-slate-950">
              GET /api/v1/models
            </code>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-sm text-slate-100">
          <pre className="whitespace-pre-wrap break-words leading-6">
{`const response = await fetch("https://api.tzoshop.vn/v1/models", {
  method: "GET",
  headers: {
    "Authorization": "Bearer tz_xxx"
  }
});

const data = await response.json();
console.log(data);`}
          </pre>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          Ví dụ gọi API bằng JavaScript
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Chỉ cần đổi model để dùng dòng AI tương ứng. Ví dụ dưới đây dùng
          CodexAI.
        </p>

        <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-sm text-slate-100">
          <pre className="whitespace-pre-wrap break-words leading-6">
{`// Local test: http://localhost:3004/api/v1/chat/completions
const response = await fetch("https://api.tzoshop.vn/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer tz_xxx",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "codexai/gpt-5.5",
    messages: [
      {
        role: "user",
        content: "Viết cho tôi một hàm login bằng Next.js"
      }
    ]
  })
});

const data = await response.json();
console.log(data);`}
          </pre>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          Cấu trúc request
        </h2>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Trường</th>
                <th className="px-4 py-3 font-semibold">Bắt buộc</th>
                <th className="px-4 py-3 font-semibold">Mô tả</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-950">
                  model
                </td>
                <td className="px-4 py-3 text-slate-600">Có</td>
                <td className="px-4 py-3 text-slate-600">
                  Model muốn sử dụng, ví dụ codexai/gpt-5.5.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-semibold text-slate-950">
                  messages
                </td>
                <td className="px-4 py-3 text-slate-600">Có</td>
                <td className="px-4 py-3 text-slate-600">
                  Danh sách tin nhắn theo chuẩn role/content.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-semibold text-slate-950">
                  temperature
                </td>
                <td className="px-4 py-3 text-slate-600">Không</td>
                <td className="px-4 py-3 text-slate-600">
                  Độ sáng tạo của response.
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3 font-semibold text-slate-950">
                  max_tokens
                </td>
                <td className="px-4 py-3 text-slate-600">Không</td>
                <td className="px-4 py-3 text-slate-600">
                  Giới hạn token đầu ra.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Danh sách model hỗ trợ
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Model được chia theo family. Family cũng là nhóm credits dùng để
              kiểm tra quyền sử dụng và trừ credits.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {MODEL_REGISTRY.length} model
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {MODEL_FAMILIES.map((family) => (
            <button
              key={family}
              type="button"
              onClick={() => {
                setSelectedFamily(family);
                setShowAllModels(false);
              }}
              className={
                selectedFamily === family
                  ? "rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              }
            >
              {family}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {visibleModels.map((model) => (
            <div
              key={model.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="text-sm font-bold text-slate-950">
                {model.name}
              </div>

              <div className="mt-1 font-mono text-xs text-emerald-700">
                {model.id}
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {model.description}
              </p>
            </div>
          ))}
        </div>

        {models.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllModels((value) => !value)}
            className="mt-5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {showAllModels ? "Thu gọn" : `Xem thêm ${models.length - 5} model`}
          </button>
        )}
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-bold text-amber-950">
          Lưu ý về quyền sử dụng
        </h2>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          Nếu API key của bạn thuộc gói CodexAI, bạn chỉ có thể gọi các model
          thuộc family CodexAI. Khi gọi model thuộc family khác, hệ thống sẽ trả
          lỗi chưa có quyền sử dụng dòng credits tương ứng.
        </p>
      </section>
    </div>
  );
}
