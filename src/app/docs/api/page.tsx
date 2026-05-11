"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  KeyRound, 
  Code2, 
  ShieldCheck, 
  AlertCircle, 
  Copy,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ToastMessage } from "@/components/ui/toast-message";

export default function ApiDocsPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});

  const baseUrl = {
    production: "https://your-domain.com/api/v1",
    local: "http://localhost:3004/api/v1"
  };

  const curlExample = `curl -X POST "http://localhost:3004/api/v1/chat/completions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "codexai/gpt-5.3-codex",
    "messages": [
      {
        "role": "user",
        "content": "Hello, can you help me?"
      }
    ]
  }'`;

  const jsExample = `const response = await fetch("http://localhost:3004/api/v1/chat/completions", {
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
        content: "Hello, can you help me?",
      },
    ],
  }),
});

const data = await response.json();
console.log(data);`;

  const responseExample = `{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "codexai/gpt-5.3-codex",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Chào bạn! Tôi là CodexAI, tôi có thể giúp gì cho bạn hôm nay?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState((prev) => ({ ...prev, [id]: true }));
    setToast({ message: "Đã copy nội dung.", type: "success" });
    
    setTimeout(() => {
      setCopyState((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-white text-[#0b0f0d]">
      <SiteHeader />

      {/* Section 1: Header */}
      <section className="hero-gradient border-b border-[#edf1ee]">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfe5e1] bg-white/80 px-4 py-2 text-sm font-semibold text-[#00d4a4] backdrop-blur">
              <BookOpen className="h-4 w-4" />
              Tài liệu kỹ thuật
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0b0f0d] sm:text-6xl">
              Tài liệu API
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#47524d] max-w-2xl">
              Tích hợp API theo chuẩn OpenAI-compatible để sử dụng trong extension, IDE hoặc công cụ API client. 
              Sử dụng hệ thống credits linh hoạt để truy cập nhiều dòng AI mạnh mẽ nhất hiện nay.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/pricing" className="btn-accent gap-2">
                Mua credits
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-16 lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        <div className="space-y-16">
          {/* Section 2: Base URL */}
          <section id="base-url" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7fff7] text-[#00d4a4]">
                <Code2 className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Base URL</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card-base p-5 group relative">
                <p className="text-xs font-bold uppercase tracking-wider text-[#66736d] mb-2">Production</p>
                <div className="flex items-center justify-between gap-3">
                  <code className="text-sm font-medium text-[#00d4a4] break-all">{baseUrl.production}</code>
                  <button 
                    onClick={() => handleCopy(baseUrl.production, "prod-url")}
                    className="p-2 rounded-lg hover:bg-[#f7f8f6] transition-colors text-[#66736d]"
                  >
                    {copyState["prod-url"] ? <CheckCircle2 className="h-4 w-4 text-[#00d4a4]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="card-base p-5 group relative">
                <p className="text-xs font-bold uppercase tracking-wider text-[#66736d] mb-2">Local Development</p>
                <div className="flex items-center justify-between gap-3">
                  <code className="text-sm font-medium text-[#00d4a4] break-all">{baseUrl.local}</code>
                  <button 
                    onClick={() => handleCopy(baseUrl.local, "local-url")}
                    className="p-2 rounded-lg hover:bg-[#f7f8f6] transition-colors text-[#66736d]"
                  >
                    {copyState["local-url"] ? <CheckCircle2 className="h-4 w-4 text-[#00d4a4]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Xác thực */}
          <section id="authentication" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7fff7] text-[#00d4a4]">
                <KeyRound className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Xác thực</h2>
            </div>
            
            <div className="card-base p-6">
              <p className="text-[#47524d] mb-6">
                Tất cả các yêu cầu API phải bao gồm API key của bạn trong header <code className="bg-[#f7f8f6] px-1.5 py-0.5 rounded border border-[#dfe5e1] font-bold">Authorization</code>.
              </p>
              
              <div className="bg-[#101827] rounded-xl p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-white/50 uppercase">HTTP Header</span>
                  <button 
                    onClick={() => handleCopy("Authorization: Bearer YOUR_API_KEY", "auth-header")}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    {copyState["auth-header"] ? <span className="text-xs text-[#00d4a4]">Đã copy</span> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <code className="text-emerald-400 text-sm">Authorization: Bearer YOUR_API_KEY</code>
              </div>
              
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-6">
                  <strong>Lưu ý:</strong> API key của bạn là bí mật. Đừng bao giờ chia sẻ nó công khai hoặc đưa vào code client-side mà người khác có thể thấy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 & 5: Chat Completions & Examples */}
          <section id="chat-completions" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7fff7] text-[#00d4a4]">
                <Code2 className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Chat Completions</h2>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[#47524d] mb-4">
                  Sử dụng endpoint này để tương tác với các dòng AI. Chúng tôi hỗ trợ đầy đủ cấu trúc của OpenAI API.
                </p>
                <div className="flex items-center gap-3 bg-[#f7f8f6] border border-[#dfe5e1] rounded-xl px-4 py-3">
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded">POST</span>
                  <code className="text-sm font-bold text-[#0b0f0d]">/chat/completions</code>
                </div>
              </div>

              {/* Curl Example */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Ví dụ CURL</h3>
                  <button 
                    onClick={() => handleCopy(curlExample, "curl-code")}
                    className="flex items-center gap-2 text-sm font-bold text-[#66736d] hover:text-[#0b0f0d] transition-colors"
                  >
                    {copyState["curl-code"] ? <CheckCircle2 className="h-4 w-4 text-[#00d4a4]" /> : <Copy className="h-4 w-4" />}
                    {copyState["curl-code"] ? "Đã copy" : "Copy nội dung"}
                  </button>
                </div>
                <div className="bg-[#101827] rounded-xl p-6 overflow-x-auto mockup-shadow">
                  <pre className="text-sm text-gray-300 leading-relaxed">
                    <code>{curlExample}</code>
                  </pre>
                </div>
              </div>

              {/* JS Example */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Ví dụ JavaScript (Fetch)</h3>
                  <button 
                    onClick={() => handleCopy(jsExample, "js-code")}
                    className="flex items-center gap-2 text-sm font-bold text-[#66736d] hover:text-[#0b0f0d] transition-colors"
                  >
                    {copyState["js-code"] ? <CheckCircle2 className="h-4 w-4 text-[#00d4a4]" /> : <Copy className="h-4 w-4" />}
                    {copyState["js-code"] ? "Đã copy" : "Copy nội dung"}
                  </button>
                </div>
                <div className="bg-[#101827] rounded-xl p-6 overflow-x-auto mockup-shadow">
                  <pre className="text-sm text-gray-300 leading-relaxed">
                    <code>{jsExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Response mẫu */}
          <section id="response" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7fff7] text-[#00d4a4]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Response mẫu</h2>
            </div>
            
            <div className="card-base overflow-hidden">
              <div className="bg-[#f7f8f6] px-6 py-3 border-b border-[#dfe5e1]">
                <span className="text-xs font-bold text-[#66736d] uppercase tracking-widest">JSON Response</span>
              </div>
              <div className="p-6 bg-white overflow-x-auto">
                <pre className="text-sm text-[#47524d] leading-relaxed font-medium">
                  <code>{responseExample}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Section 7: Lỗi thường gặp */}
          <section id="errors" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Lỗi thường gặp</h2>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-[#dfe5e1]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f7f8f6] border-b border-[#dfe5e1]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-[#0b0f0d]">Mã lỗi</th>
                    <th className="px-6 py-4 text-sm font-bold text-[#0b0f0d]">Mô tả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe5e1]">
                  {[
                    { code: "401", desc: "Thiếu hoặc sai API key" },
                    { code: "403", desc: "Model không nằm trong gói đã mua" },
                    { code: "402", desc: "Không đủ credits để thực hiện yêu cầu" },
                    { code: "429", desc: "Vượt giới hạn tốc độ (Rate limit exceeded)" },
                    { code: "500", desc: "Lỗi hệ thống phía Gateway" },
                  ].map((error) => (
                    <tr key={error.code} className="hover:bg-[#fbfbf8] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{error.code}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#47524d]">{error.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 8: Lưu ý */}
          <section id="notes" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7fff7] text-[#00d4a4]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Lưu ý quan trọng</h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { title: "Bảo mật", content: "Tuyệt đối không chia sẻ API key công khai trên GitHub, mạng xã hội hoặc các diễn đàn." },
                { title: "Gói Credits", content: "Mỗi API key liên kết với một gói credits cụ thể mà bạn đã mua." },
                { title: "Cách tính phí", content: "Credits sẽ bị trừ theo usage thực tế (tokens) của model bạn sử dụng." },
                { title: "Quản lý", content: "Bạn có thể xem lịch sử sử dụng chi tiết và quản lý key tại dashboard cá nhân." },
              ].map((note) => (
                <div key={note.title} className="card-base p-6">
                  <h3 className="font-bold text-[#0b0f0d] mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00d4a4]" />
                    {note.title}
                  </h3>
                  <p className="text-sm text-[#47524d] leading-6">{note.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#66736d] mb-4">Nội dung chính</h4>
              <nav className="flex flex-col gap-1">
                {[
                  { id: "base-url", label: "Base URL" },
                  { id: "authentication", label: "Xác thực" },
                  { id: "chat-completions", label: "Chat Completions" },
                  { id: "response", label: "Response mẫu" },
                  { id: "errors", label: "Lỗi thường gặp" },
                  { id: "notes", label: "Lưu ý quan trọng" },
                ].map((item) => (
                  <a 
                    key={item.id} 
                    href={`#${item.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#47524d] hover:text-[#00d4a4] hover:bg-[#e7fff7] rounded-lg transition-all"
                  >
                    <ChevronRight className="h-3 w-3 opacity-50" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="p-6 rounded-2xl bg-[#020c0a] text-white">
              <h4 className="font-bold mb-2">Cần hỗ trợ?</h4>
              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                Nếu bạn gặp khó khăn trong việc tích hợp, hãy liên hệ với đội ngũ kỹ thuật.
              </p>
              <Link 
                href="/support" 
                className="inline-flex items-center gap-2 text-xs font-bold text-[#00d4a4] hover:underline"
              >
                Gửi yêu cầu hỗ trợ <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter />

      {toast && (
        <ToastMessage 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </main>
  );
}
