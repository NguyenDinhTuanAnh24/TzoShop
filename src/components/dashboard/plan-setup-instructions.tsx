"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Terminal,
  Zap,
  Key,
  Settings,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Code2,
  FileCode,
  LayoutGrid,
  Info,
  X,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastMessage } from "@/components/ui/toast-message";
import { useToast } from "@/hooks/use-toast";
import {
  getApiBaseUrl,
  generateContinueConfig,
  generateCodexConfig,
  generatePowerShellExample,
  generateCurlExample,
  generateJsExample,
  generatePythonExample,
} from "@/lib/integration-config";

export interface AllowedModel {
  publicName: string;
  upstreamModel?: string | null;
  apiFamily: string;
  inputCreditRate?: number;
  outputCreditRate?: number;
  isActive: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  key: string | null;
  maskedKey: string;
  isActive: boolean;
}

interface PlanSetupInstructionsProps {
  bucketId: string;
  productName: string;
  allowedModels: AllowedModel[];
  apiKeys: ApiKey[];
  isOpen: boolean;
  onClose?: () => void;
}

export function PlanSetupInstructions({
  bucketId,
  productName,
  allowedModels,
  apiKeys,
  isOpen,
  onClose,
}: PlanSetupInstructionsProps) {
  const [activeTab, setActiveTab] = useState("quick");
  const [activeLang, setActiveLang] = useState("powershell");
  const [selectedKeyId, setSelectedKeyId] = useState(apiKeys[0]?.id || "");
  const [showFullKey, setShowFullKey] = useState(false);

  const allowedModelNames = useMemo(() => allowedModels.map((m) => m.publicName), [allowedModels]);
  const [selectedModel, setSelectedModel] = useState<string>(allowedModelNames[0] || "");

  const { toast, showToast, clearToast } = useToast(3000);

  useEffect(() => {
    if (allowedModelNames.length > 0 && !allowedModelNames.includes(selectedModel)) {
      const timer = window.setTimeout(() => {
        setSelectedModel(allowedModelNames[0]);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [allowedModelNames, selectedModel]);

  const selectedKey = useMemo(
    () => apiKeys.find((k) => k.id === selectedKeyId) || apiKeys[0],
    [apiKeys, selectedKeyId],
  );

  const recommendedModel = useMemo(() => {
    if (allowedModelNames.length === 0) return "";
    return selectedModel || allowedModelNames[0];
  }, [allowedModelNames, selectedModel]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}`, "success");
  };

  if (!isOpen) return null;

  if (apiKeys.length === 0) {
    return (
      <div className="mt-5 max-w-full min-w-0 border-4 border-black bg-[#FFFDF5] p-6 text-center shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000]">
          <Key className="h-5 w-5 text-black" />
        </div>
        <h4 className="text-2xl font-black text-black">BẠN CHƯA CÓ API KEY</h4>
        <p className="mx-auto mt-3 max-w-xl break-words text-sm font-bold leading-relaxed text-black/75">
          Tạo API key đầu tiên để cấu hình gói này trong extension hoặc IDE.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => (window.location.href = `/api-keys?bucketId=${bucketId}`)}
            className="h-11 border-4 border-black bg-[#FF6B6B] px-5 text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            TẠO API KEY
          </button>
        </div>
      </div>
    );
  }

  if (allowedModels.length === 0) {
    return (
      <div className="mt-5 max-w-full min-w-0 border-4 border-black bg-[#FFFDF5] p-6 text-center shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000]">
          <Cpu className="h-5 w-5 text-black" />
        </div>
        <h4 className="text-2xl font-black text-black">CHƯA CÓ MODEL KHẢ DỤNG</h4>
        <p className="mx-auto mt-3 max-w-xl break-words text-sm font-bold leading-relaxed text-black/75">
          Gói này hiện chưa có model khả dụng. Vui lòng liên hệ hỗ trợ hoặc chọn gói khác.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "quick", label: "Cấu hình nhanh", icon: Zap },
    { id: "continue", label: "Continue", icon: FileCode },
    { id: "codex", label: "Codex", icon: Cpu },
    { id: "cline", label: "Cline", icon: Code2 },
    { id: "roocode", label: "Roo Code", icon: LayoutGrid },
    { id: "api", label: "API mẫu", icon: Terminal },
  ];

  const API_KEY = selectedKey?.key || selectedKey?.maskedKey || "YOUR_API_KEY";

  return (
    <div className="mt-5 w-full min-w-0 max-w-full overflow-hidden border-4 border-black bg-[#FFFDF5] p-4 shadow-[8px_8px_0px_0px_#000] md:p-6">
      <div className="mb-5 flex items-start justify-between gap-3 border-b-4 border-black pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000]">
            <Settings className="h-5 w-5 text-black" />
          </div>
          <div className="min-w-0">
            <span className="inline-flex border-2 border-black bg-[#C7F0D8] px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black shadow-[2px_2px_0px_0px_#000]">
              TÍCH HỢP API
            </span>
            <h3 className="mt-2 break-words text-xl font-black leading-tight text-black md:text-3xl">HƯỚNG DẪN TÍCH HỢP</h3>
            <p className="mt-2 break-words text-sm font-bold leading-relaxed text-black/70 md:text-base">
              Cấu hình API key của gói {productName} trong extension hoặc IDE.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-black bg-white text-black shadow-[3px_3px_0px_0px_#000] transition-all duration-100 hover:bg-[#FF6B6B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            aria-label="Thu gọn"
            title="Thu gọn"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-5 w-full max-w-full min-w-0 overflow-hidden border-4 border-black bg-[#FFFDF5] p-3 shadow-[5px_5px_0px_0px_#000] md:p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.1em] text-black/70">Models được phép</p>
        <div className="max-h-[140px] max-w-full min-w-0 overflow-y-auto">
          <div className="flex max-w-full min-w-0 flex-wrap gap-2">
            {allowedModels.map((m) => (
              <span
                key={m.publicName}
                className="inline-flex max-w-full min-w-0 items-center break-all whitespace-normal border-2 border-black bg-white px-2.5 py-1.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] md:text-sm"
                title={m.publicName}
              >
                {m.publicName}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 grid w-full max-w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0 max-w-full">
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-black/70 md:text-sm">
            API key sử dụng
          </label>
          <div className="relative w-full min-w-0 max-w-full">
            <select
              value={selectedKeyId}
              onChange={(e) => setSelectedKeyId(e.target.value)}
              className="h-12 w-full min-w-0 max-w-full appearance-none truncate overflow-hidden border-4 border-black bg-white px-4 pr-12 text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] outline-none focus-visible:ring-0 md:px-5 md:text-base"
              title={selectedKey ? `${selectedKey.name} - ${selectedKey.maskedKey}` : "Chọn API key"}
            >
              {apiKeys.map((k) => (
                <option key={k.id} value={k.id} title={`${k.name} - ${k.maskedKey}`}>
                  {k.name} - {k.maskedKey}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
          </div>
        </div>

        <div className="min-w-0 max-w-full">
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-black/70 md:text-sm">Model đang chọn</label>
          <div className="relative w-full min-w-0 max-w-full">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="h-12 w-full min-w-0 max-w-full appearance-none truncate overflow-hidden border-4 border-black bg-white px-4 pr-12 text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] outline-none focus-visible:ring-0 md:px-5 md:text-base"
              title={selectedModel}
            >
              {allowedModels.map((m) => (
                <option key={m.publicName} value={m.publicName}>
                  {m.publicName}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
          </div>
        </div>
      </div>

      <div className="mb-5 w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1">
        <div className="flex w-max min-w-full gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "h-11 shrink-0 whitespace-nowrap border-4 border-black px-3 text-sm font-black tracking-tight text-black shadow-[3px_3px_0px_0px_#000] transition-colors md:h-12 md:px-5 md:text-base",
                  isActive ? "bg-[#06130F] text-white" : "bg-white hover:bg-[#FFF3B0]",
                )}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Icon className={cn("h-4 w-4", isActive ? "text-[#00D49B]" : "text-black")} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 max-w-full">
        {activeTab === "quick" && (
          <div className="space-y-5">
            <h4 className="mb-1 text-xl font-black tracking-tight text-black md:text-2xl">CẤU HÌNH NHANH</h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FieldRow
                label="BASE URL"
                value={getApiBaseUrl()}
                onCopy={() => handleCopy(getApiBaseUrl(), "Base URL")}
              />
              <FieldRow
                label="MODEL KHUYẾN NGHỊ"
                value={recommendedModel}
                onCopy={() => handleCopy(recommendedModel, "Model")}
              />
              <FieldRow
                className="lg:col-span-2"
                label={`API KEY (${selectedKey?.name})`}
                value={showFullKey ? API_KEY : selectedKey?.maskedKey || ""}
                rawCopyValue={API_KEY}
                onCopy={() => handleCopy(API_KEY, "API key")}
                onToggleMask={() => setShowFullKey(!showFullKey)}
                isMaskedField
                showMasked={showFullKey}
              />
              <FieldRow
                className="lg:col-span-2"
                label="AUTHORIZATION HEADER"
                value={`Bearer ${showFullKey ? API_KEY : selectedKey?.maskedKey || ""}`}
                rawCopyValue={`Bearer ${API_KEY}`}
                onCopy={() => handleCopy(`Bearer ${API_KEY}`, "Authorization Header")}
              />
            </div>

            <div className="mt-5 flex w-full max-w-full min-w-0 items-start gap-3 overflow-hidden border-4 border-black bg-[#FFF3B0] p-4 shadow-[5px_5px_0px_0px_#000] md:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-black bg-[#FFD93D] shadow-[3px_3px_0px_0px_#000] md:h-11 md:w-11">
                <Info className="h-5 w-5 text-black" />
              </div>
              <p className="min-w-0 break-words text-sm font-bold leading-relaxed text-black md:text-base">
                Lưu ý bảo mật: API key của gói {productName} chỉ nên được sử dụng ở phía Client an toàn như IDE,
                extension hoặc server riêng của bạn. Không chia sẻ key cho người khác để tránh thất thoát credits ngoài ý muốn.
              </p>
            </div>
          </div>
        )}

        {activeTab === "continue" && (
          <CodeTab
            title="CẤU HÌNH CONTINUE"
            subtitle="$HOME/.continue/config.yaml"
            code={generateContinueConfig({ apiKey: API_KEY, models: allowedModelNames })}
            onCopy={() => handleCopy(generateContinueConfig({ apiKey: API_KEY, models: allowedModelNames }), "cấu hình Continue")}
          />
        )}

        {activeTab === "codex" && (
          <CodeTab
            title="CẤU HÌNH CODEX"
            subtitle="$HOME/.codex/config.toml"
            code={generateCodexConfig({ model: recommendedModel })}
            onCopy={() => handleCopy(generateCodexConfig({ model: recommendedModel }), "cấu hình Codex")}
          />
        )}

        {(activeTab === "cline" || activeTab === "roocode") && (
          <div className="space-y-4">
            <h4 className="mb-1 text-xl font-black tracking-tight text-black md:text-2xl">{activeTab === "cline" ? "CẤU HÌNH CLINE" : "CẤU HÌNH ROO CODE"}</h4>
            <div className="grid grid-cols-1 gap-4">
              <FieldRow label="PROVIDER" value="OpenAI Compatible" onCopy={() => handleCopy("OpenAI Compatible", "Provider")} />
              <FieldRow label="BASE URL" value={getApiBaseUrl()} onCopy={() => handleCopy(getApiBaseUrl(), "Base URL")} />
              <FieldRow
                label="API KEY"
                value={showFullKey ? API_KEY : selectedKey?.maskedKey || ""}
                rawCopyValue={API_KEY}
                onCopy={() => handleCopy(API_KEY, "API key")}
                onToggleMask={() => setShowFullKey(!showFullKey)}
                isMaskedField
                showMasked={showFullKey}
              />
              <FieldRow label="MODEL ID" value={recommendedModel} onCopy={() => handleCopy(recommendedModel, "Model ID")} />
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-4">
            <h4 className="mb-1 text-xl font-black tracking-tight text-black md:text-2xl">API MẪU</h4>
            <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1">
              <div className="flex w-max min-w-full gap-2">
                {["powershell", "curl", "javascript", "python"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={cn(
                      "h-11 shrink-0 whitespace-nowrap border-4 border-black px-3 text-sm font-black uppercase tracking-tight text-black shadow-[3px_3px_0px_0px_#000] md:h-12 md:px-5 md:text-base",
                      activeLang === lang ? "bg-[#FFD93D]" : "bg-white",
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-full min-w-0 overflow-hidden border-4 border-black shadow-[5px_5px_0px_0px_#000]">
              <div className="flex min-h-12 min-w-0 flex-col gap-3 border-b-4 border-black bg-[#FFD93D] p-3 sm:flex-row sm:items-center sm:justify-between md:p-4">
                <p className="text-sm font-black uppercase tracking-tight text-black md:text-base">ĐOẠN CODE {activeLang}</p>
                <button
                  type="button"
                  onClick={() => {
                    const code =
                      activeLang === "powershell"
                        ? generatePowerShellExample({ apiKey: API_KEY, model: recommendedModel })
                        : activeLang === "curl"
                          ? generateCurlExample({ apiKey: API_KEY, model: recommendedModel })
                          : activeLang === "javascript"
                            ? generateJsExample({ apiKey: API_KEY, model: recommendedModel })
                            : generatePythonExample({ apiKey: API_KEY, model: recommendedModel });
                    handleCopy(code, `đoạn code ${activeLang}`);
                  }}
                  className="h-11 w-full shrink-0 border-4 border-black bg-white px-4 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:-translate-y-0.5 hover:bg-[#FFD93D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:h-12 sm:w-auto sm:px-5 md:text-base"
                >
                  Sao chép
                </button>
              </div>
              <pre className="max-h-[520px] max-w-full min-w-0 overflow-auto whitespace-pre bg-[#06130F] p-4 font-mono text-sm font-bold leading-7 text-[#C7F0D8] md:p-5 md:text-base md:leading-8">
                {activeLang === "powershell" && generatePowerShellExample({ apiKey: API_KEY, model: recommendedModel })}
                {activeLang === "curl" && generateCurlExample({ apiKey: API_KEY, model: recommendedModel })}
                {activeLang === "javascript" && generateJsExample({ apiKey: API_KEY, model: recommendedModel })}
                {activeLang === "python" && generatePythonExample({ apiKey: API_KEY, model: recommendedModel })}
              </pre>
            </div>
          </div>
        )}
      </div>

      {toast && <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  );
}

function FieldRow({
  label,
  value,
  onCopy,
  className,
  onToggleMask,
  isMaskedField,
  showMasked,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  rawCopyValue?: string;
  className?: string;
  onToggleMask?: () => void;
  isMaskedField?: boolean;
  showMasked?: boolean;
}) {
  return (
    <div className={cn("w-full max-w-full min-w-0", className)}>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-black/70 md:text-sm">{label}</p>
      <div className="flex min-h-14 w-full max-w-full min-w-0 items-center justify-between gap-2 overflow-hidden border-4 border-black bg-white px-3 py-3 shadow-[4px_4px_0px_0px_#000] md:gap-3 md:px-5">
        <code className="min-w-0 flex-1 break-all font-mono text-sm font-bold leading-relaxed text-black md:text-base">{value}</code>
        <div className="flex shrink-0 items-center gap-2">
          {isMaskedField && onToggleMask && (
            <button
              type="button"
              onClick={onToggleMask}
              className="flex h-11 w-11 items-center justify-center border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:-translate-y-0.5 hover:bg-[#FFD93D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              aria-label={showMasked ? "Ẩn API key" : "Hiển thị API key"}
              title={showMasked ? "Ẩn API key" : "Hiển thị API key"}
            >
              {showMasked ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
          <button
            type="button"
            onClick={onCopy}
            className="flex h-11 w-11 items-center justify-center border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:-translate-y-0.5 hover:bg-[#FFD93D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            aria-label="Sao chép"
            title="Sao chép"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CodeTab({
  title,
  subtitle,
  code,
  onCopy,
}: {
  title: string;
  subtitle: string;
  code: string;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="mb-1 text-xl font-black tracking-tight text-black md:text-2xl">{title}</h4>
          <p className="break-all font-mono text-sm font-bold text-black/75 md:text-base">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="h-11 w-full border-4 border-black bg-white px-4 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:-translate-y-0.5 hover:bg-[#FFD93D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:h-12 sm:w-auto sm:px-5 md:text-base"
        >
          Sao chép cấu hình
        </button>
      </div>

      <div className="w-full max-w-full min-w-0 overflow-hidden border-4 border-black shadow-[5px_5px_0px_0px_#000]">
        <div className="flex min-h-12 min-w-0 items-center border-b-4 border-black bg-[#FFD93D] p-3 md:p-4">
          <p className="text-sm font-black uppercase tracking-tight text-black md:text-base">CONFIG</p>
        </div>
        <pre className="max-h-[520px] max-w-full min-w-0 overflow-auto whitespace-pre bg-[#06130F] p-4 font-mono text-sm font-bold leading-7 text-[#C7F0D8] md:p-5 md:text-base">
          {code}
        </pre>
      </div>
    </div>
  );
}
