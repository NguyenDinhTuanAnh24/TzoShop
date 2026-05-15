"use client";

import { useMemo, useState } from "react";
import {
  BookOpenText,
  Copy,
  Key,
  ListTree,
  Send,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { cn } from "@/lib/utils";
import { TextFadeInUp } from "@/components/animations/text-fade-in-up";

type CodeTab = "curl" | "javascript" | "python";

export default function ApiDocsPage() {
  const [requestTab, setRequestTab] = useState<CodeTab>("curl");
  const { toast, showToast, clearToast } = useToast(3000);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://tzoshop.io.vn";
  const apiBaseUrl = `${appUrl}/api/v1`;
  const chatPath = "/chat/completions";
  const chatUrl = `${apiBaseUrl}${chatPath}`;

  const requestCode = useMemo(() => {
    const curl = `curl ${chatUrl} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "codexai/gpt-5.3-codex",
    "messages": [
      {
        "role": "user",
        "content": "Xin chào, hãy giải thích ngắn gọn về TzoShop."
      }
    ]
  }'`;

    const js = `const response = await fetch("${chatUrl}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "codexai/gpt-5.3-codex",
    messages: [
      {
        role: "user",
        content: "Xin chào, hãy giải thích ngắn gọn về TzoShop.",
      },
    ],
  }),
});

const data = await response.json();
console.log(data);`;

    const py = `import requests

response = requests.post(
    "${chatUrl}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "model": "codexai/gpt-5.3-codex",
        "messages": [
            {
                "role": "user",
                "content": "Xin chào, hãy giải thích ngắn gọn về TzoShop.",
            }
        ],
    },
)

print(response.json())`;

    if (requestTab === "javascript") return js;
    if (requestTab === "python") return py;
    return curl;
  }, [chatUrl, requestTab]);

  const responseCode = `{
  "id": "chatcmpl_xxx",
  "object": "chat.completion",
  "model": "codexai/gpt-5.3-codex",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "TzoShop giúp bạn mua credits, tạo API key và sử dụng AI linh hoạt hơn."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 18,
    "total_tokens": 42
  }
}`;

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showToast("Đã sao chép", "success");
  };

  return (
    <main className="space-y-8 pb-20" aria-busy="false">
      <TextFadeInUp as="section" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              <BookOpenText className="h-3.5 w-3.5" /> Hướng dẫn
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Tài liệu API</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Hướng dẫn cấu hình endpoint, API key và request mẫu để sử dụng TzoShop trong công cụ AI quen thuộc.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CosmicButton href="/api-keys">
              <Key className="h-4 w-4" /> Tạo API key
            </CosmicButton>
            <CosmicButton href="/plans" variant="secondary">Mua credits</CosmicButton>
          </div>
        </div>
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.05} className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          {
            step: "1",
            title: "Tạo API key",
            desc: "Tạo key từ gói credits đang hoạt động trong tài khoản.",
            icon: Key,
          },
          {
            step: "2",
            title: "Chọn model",
            desc: "Sử dụng model thuộc dòng AI được gói của bạn hỗ trợ.",
            icon: ListTree,
          },
          {
            step: "3",
            title: "Gửi request",
            desc: "Gọi endpoint OpenAI-compatible để bắt đầu sử dụng.",
            icon: Send,
          },
        ].map((item) => (
          <article key={item.step} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white">
                {item.step}
              </div>
              <div>
                <p className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <item.icon className="h-4 w-4" />
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </TextFadeInUp>

      <TextFadeInUp as="section" delay={0.1} className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Base URL</h2>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <code className="min-w-0 flex-1 break-all font-mono text-sm text-slate-700">{apiBaseUrl}</code>
            <button
              type="button"
              onClick={() => void copyText(apiBaseUrl)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Trên môi trường local, thay domain bằng domain dev của bạn nếu cần.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Xác thực</h2>
          <p className="mt-1 text-sm text-slate-600">Gửi API key trong Authorization header.</p>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <code className="min-w-0 flex-1 break-all font-mono text-sm text-slate-700">Authorization: Bearer YOUR_API_KEY</code>
            <button
              type="button"
              onClick={() => void copyText("Authorization: Bearer YOUR_API_KEY")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <p className="text-sm leading-6">
              Không chia sẻ API key công khai. Nếu nghi ngờ key bị lộ, hãy thu hồi key và tạo key mới.
            </p>
          </div>
        </article>
      </TextFadeInUp>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">POST</span>
          <code className="font-mono text-sm font-semibold text-slate-900">{chatPath}</code>
        </div>
        <code className="mt-2 block break-all font-mono text-sm text-slate-700">POST {chatUrl}</code>
        <p className="mt-3 text-sm text-slate-600">
          Endpoint tương thích kiểu OpenAI chat completions, dùng để gửi messages và nhận phản hồi từ model được chọn.
        </p>
      </article>

      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Request mẫu</h2>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {["curl", "javascript", "python"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRequestTab(tab as CodeTab)}
              className={cn(
                "h-10 rounded-xl px-4 text-sm font-semibold transition-all duration-200",
                requestTab === tab
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              )}
            >
              {tab === "curl" ? "CURL" : tab === "javascript" ? "JavaScript" : "Python"}
            </button>
          ))}
        </div>

        <CodeBlock title="REQUEST" code={requestCode} onCopy={() => void copyText(requestCode)} />
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-slate-950">Response mẫu</h2>
        <CodeBlock title="RESPONSE" code={responseCode} onCopy={() => void copyText(responseCode)} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-950">Parameters</h2>
        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Yêu cầu</th>
                <th className="px-4 py-3">Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["model", "Bắt buộc", "Model bạn muốn dùng, ví dụ codexai/gpt-5.3-codex"],
                ["messages", "Bắt buộc", "Danh sách hội thoại gồm role và content"],
                ["temperature", "Tùy chọn", "Điều chỉnh độ sáng tạo của phản hồi"],
                ["max_tokens", "Tùy chọn", "Giới hạn số token phản hồi nếu endpoint hỗ trợ"],
              ].map(([name, required, desc]) => (
                <tr key={name} className="border-t border-slate-100 hover:bg-indigo-50/30">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">{name}</td>
                  <td className="px-4 py-3 text-slate-700">{required}</td>
                  <td className="px-4 py-3 text-slate-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-3 md:hidden">
          {[
            ["model", "Bắt buộc", "Model bạn muốn dùng, ví dụ codexai/gpt-5.3-codex"],
            ["messages", "Bắt buộc", "Danh sách hội thoại gồm role và content"],
            ["temperature", "Tùy chọn", "Điều chỉnh độ sáng tạo của phản hồi"],
            ["max_tokens", "Tùy chọn", "Giới hạn số token phản hồi nếu endpoint hỗ trợ"],
          ].map(([name, required, desc]) => (
            <article key={name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-mono text-sm font-semibold text-slate-900">{name}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">{required}</p>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-950">Model format</h2>
        <p className="mt-1 text-sm text-slate-600">Model được viết theo dạng dòng AI/model-name.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "codexai/gpt-5.3-codex",
            "claude/claude-sonnet-4.5",
            "gemini/gemini-3-flash-preview",
            "deepseek/deepseek-v4-flash",
          ].map((m) => (
            <span key={m} className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {m}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">Bạn chỉ có thể dùng model thuộc gói credits/API key đang hoạt động.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-950">Lỗi thường gặp</h2>
        <div className="grid grid-cols-1 gap-3">
          {[
            ["401 Unauthorized", "API key thiếu hoặc không hợp lệ.", "amber"],
            ["403 Forbidden", "Key không có quyền dùng model hoặc gói đã hết hạn.", "amber"],
            ["402 Payment Required", "Credits không đủ hoặc gói không còn khả dụng.", "amber"],
            ["404 Not Found", "Endpoint hoặc model không tồn tại.", "amber"],
            ["429 Too Many Requests", "Gửi quá nhiều request trong thời gian ngắn.", "amber"],
            ["500 Server Error", "Lỗi hệ thống, thử lại sau.", "rose"],
          ].map(([code, desc, tone]) => (
            <article key={code} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                    tone === "rose"
                      ? "border border-rose-100 bg-rose-50 text-rose-700"
                      : "border border-amber-100 bg-amber-50 text-amber-700"
                  )}
                >
                  {code}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6">
        <h2 className="text-xl font-bold text-slate-950">Lưu ý khi sử dụng</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>Không chia sẻ API key công khai.</li>
          <li>Tạo key riêng cho từng công cụ hoặc dự án.</li>
          <li>Theo dõi credits thường xuyên trong dashboard.</li>
          <li>Thu hồi key nếu nghi ngờ bị lộ.</li>
          <li>Kiểm tra model được phép trước khi gửi request.</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">Sẵn sàng tích hợp API?</h2>
            <p className="mt-1 text-sm text-slate-600">
              Tạo API key từ gói credits đang hoạt động và bắt đầu gửi request đầu tiên.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CosmicButton href="/api-keys">Tạo API key</CosmicButton>
            <CosmicButton href="/plans" variant="secondary">Xem gói credits</CosmicButton>
          </div>
        </div>
      </section>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}
    </main>
  );
}

function CodeBlock({ title, code, onCopy }: { title: string; code: string; onCopy: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{title}</p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
        >
          Sao chép cấu hình
        </button>
      </div>
      <pre className="max-h-[420px] overflow-auto p-4 text-sm leading-7 text-slate-100">{code}</pre>
    </div>
  );
}
