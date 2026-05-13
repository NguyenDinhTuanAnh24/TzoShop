"use client";

import { useState } from "react";
import { ChevronDown, Code2, Terminal } from "lucide-react";
import { DocsCodeBlock } from "./code-block";

interface CodeExamplesProps {
  apiBaseUrl: string;
  apiUrl: string;
}

type Lang = "curl" | "javascript" | "powershell";

export function DocsCodeExamples({ apiBaseUrl, apiUrl }: CodeExamplesProps) {
  const [activeLang, setActiveLang] = useState<Lang>("curl");
  const [isResponseOpen, setIsResponseOpen] = useState(false);

  const examples: Record<Lang, { label: string; lang: string; code: string }> = {
    curl: {
      label: "curl",
      lang: "bash",
      code: `curl -X POST "${apiUrl}" \\
  -H "Authorization: Bearer YOUR_TZOSHOP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "codexai/gpt-5.3-codex",
    "messages": [
      { "role": "user", "content": "Hello, TzoShop API" }
    ]
  }'`,
    },
    javascript: {
      label: "JavaScript",
      lang: "javascript",
      code: `const response = await fetch("${apiUrl}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_TZOSHOP_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "codexai/gpt-5.3-codex",
    messages: [{ role: "user", content: "Hello, TzoShop API" }]
  })
});

const data = await response.json();
console.log(data);`,
    },
    powershell: {
      label: "PowerShell",
      lang: "powershell",
      code: `$headers = @{
  "Authorization" = "Bearer YOUR_TZOSHOP_API_KEY"
  "Content-Type" = "application/json"
}

$body = @{
  model = "codexai/gpt-5.3-codex"
  messages = @(@{ role = "user"; content = "Hello, TzoShop API" })
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "${apiUrl}" -Method POST -Headers $headers -Body $body`,
    },
  };

  const requestBody = `{
  "model": "codexai/gpt-5.3-codex",
  "messages": [
    {
      "role": "user",
      "content": "Hello, TzoShop API"
    }
  ]
}`;

  const responseExample = `{
  "id": "chatcmpl-922",
  "object": "chat.completion",
  "created": 1715412345,
  "model": "codexai/gpt-5.3-codex",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Chào bạn! Tôi là TzoShop AI, rất vui được hỗ trợ bạn."
      },
      "finish_reason": "stop"
    }
  ]
}`;

  return (
    <div className="space-y-6">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-[#FFD93D] text-black shadow-[2px_2px_0px_0px_#000]">
            <Terminal className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-black uppercase text-black">Ví dụ code</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
            <p className="text-xs font-black uppercase tracking-wide text-black">Base URL</p>
            <p className="mt-2 break-all font-mono text-sm font-bold text-black">{apiBaseUrl}</p>
          </div>
          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
            <p className="text-xs font-black uppercase tracking-wide text-black">Endpoint</p>
            <p className="mt-2 break-all font-mono text-sm font-bold text-black">POST /chat/completions</p>
          </div>
        </div>

        <div className="mt-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
          <p className="text-xs font-black uppercase tracking-wide text-black">Header</p>
          <p className="mt-2 break-all font-mono text-sm font-bold text-black">Authorization: Bearer YOUR_TZOSHOP_API_KEY</p>
          <p className="mt-1 break-all font-mono text-sm font-bold text-black">Content-Type: application/json</p>
        </div>

        <div className="mt-4">
          <DocsCodeBlock title="Request body tối thiểu" code={requestBody} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(examples) as Lang[]).map((lang) => {
            const active = activeLang === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={[
                  "h-10 border-4 border-black px-4 text-xs font-black uppercase text-black transition-all duration-100 ease-linear",
                  active
                    ? "bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000]"
                    : "bg-[#FFFDF5] shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:bg-[#FFD93D]",
                ].join(" ")}
              >
                {examples[lang].label}
              </button>
            );
          })}
        </div>

        <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000]">
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-black" />
            <h4 className="text-sm font-black uppercase text-black">{examples[activeLang].label} example</h4>
          </div>
          <DocsCodeBlock code={examples[activeLang].code} />
        </section>

        <section className="overflow-hidden border-4 border-black bg-[#FFFDF5] shadow-[6px_6px_0px_0px_#000]">
          <button
            type="button"
            onClick={() => setIsResponseOpen((v) => !v)}
            className="flex w-full items-center justify-between p-5 text-left font-black text-black hover:bg-[#FFD93D]/25"
          >
            <span className="text-sm uppercase">Response mẫu</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isResponseOpen ? "rotate-180" : ""}`} />
          </button>
          {isResponseOpen ? (
            <div className="border-t-4 border-black p-5">
              <DocsCodeBlock code={responseExample} />
            </div>
          ) : null}
        </section>
      </section>
    </div>
  );
}
