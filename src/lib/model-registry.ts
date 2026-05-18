import { normalizeModelId } from "@/lib/model-id";

export type ModelFamily = "CodexAI" | "Claude" | "Gemini" | "DeepSeek";

export type PlanTier = "Trial" | "Mini" | "Plus" | "Pro" | "Max" | "Ultra" | "Enterprise";

export type TzoModel = {
  id: string;
  label: string;
  family: ModelFamily;
  description: string;
};

export const MODEL_REGISTRY: TzoModel[] = [
  { id: "GPT-5.5", label: "GPT-5.5", family: "CodexAI", description: "Model mạnh cho tác vụ phức tạp." },
  { id: "GPT-5.4", label: "GPT-5.4", family: "CodexAI", description: "Model chất lượng cao cho lập trình và suy luận." },
  { id: "GPT-5.4-Mini", label: "GPT-5.4 Mini", family: "CodexAI", description: "Model nhẹ, phản hồi nhanh." },
  { id: "GPT-5.4-Pro", label: "GPT-5.4 Pro", family: "CodexAI", description: "Model pro cho tác vụ nặng." },
  { id: "GPT-5.3-Codex", label: "GPT-5.3 Codex", family: "CodexAI", description: "Model tối ưu cho code." },
  { id: "GPT-5.2", label: "GPT-5.2", family: "CodexAI", description: "Model ổn định cho nhu cầu chuyên sâu." },
  { id: "GPT-5.1-Codex", label: "GPT-5.1 Codex", family: "CodexAI", description: "Model codex ổn định hằng ngày." },
  { id: "GPT-5.1", label: "GPT-5.1", family: "CodexAI", description: "Model cân bằng tốc độ và chất lượng." },
  { id: "GPT-5-Codex", label: "GPT-5 Codex", family: "CodexAI", description: "Model codex phổ thông cho IDE." },
  { id: "GPT-5", label: "GPT-5", family: "CodexAI", description: "Model nền tảng cho nhiều nhu cầu." },
  { id: "GPT-5-Pro", label: "GPT-5 Pro", family: "CodexAI", description: "Model pro cho tác vụ chuyên nghiệp." },
  { id: "GPT-5-Mini", label: "GPT-5 Mini", family: "CodexAI", description: "Model tiết kiệm credits cho tác vụ nhẹ." },

  { id: "Claude-Opus-4.5", label: "Claude Opus 4.5", family: "Claude", description: "Model mạnh cho tác vụ phức tạp." },
  { id: "Claude-Haiku-4.5", label: "Claude Haiku 4.5", family: "Claude", description: "Model nhẹ và nhanh." },
  { id: "Claude-Sonnet-4.5", label: "Claude Sonnet 4.5", family: "Claude", description: "Model cân bằng cho nhu cầu hằng ngày." },
  { id: "Claude-Sonnet-4.6", label: "Claude Sonnet 4.6", family: "Claude", description: "Model chất lượng cao cho suy luận." },
  { id: "Claude-Opus-4.6", label: "Claude Opus 4.6", family: "Claude", description: "Model cao cấp cho nhu cầu chuyên sâu." },
  { id: "Claude-Opus-4.7", label: "Claude Opus 4.7", family: "Claude", description: "Model cao nhất trong nhóm Claude." },

  { id: "Gemini-3.1-Pro-Preview", label: "Gemini 3.1 Pro Preview", family: "Gemini", description: "Model preview mạnh cho tác vụ phức tạp." },
  { id: "Gemini-3.1-Flash-Lite-Preview", label: "Gemini 3.1 Flash Lite Preview", family: "Gemini", description: "Model nhẹ, nhanh, tiết kiệm." },
  { id: "Gemini-3-Flash-Preview", label: "Gemini 3 Flash Preview", family: "Gemini", description: "Model flash cho tốc độ phản hồi tốt." },
  { id: "Gemini-2.5-Pro", label: "Gemini 2.5 Pro", family: "Gemini", description: "Model pro ổn định cho tác vụ nâng cao." },

  { id: "DeepSeek-V4-Flash", label: "DeepSeek V4 Flash", family: "DeepSeek", description: "Model nhanh và tiết kiệm." },
  { id: "DeepSeek-V4-Pro", label: "DeepSeek V4 Pro", family: "DeepSeek", description: "Model mạnh cho code và suy luận." },
];

export const MODEL_FAMILIES: ModelFamily[] = ["CodexAI", "Claude", "Gemini", "DeepSeek"];

export function getModelById(modelId: string) {
  const normalized = normalizeModelId(modelId);
  return MODEL_REGISTRY.find((model) => model.id === normalized);
}

export function getFamilyFromModelId(modelId: string): ModelFamily | null {
  return getModelById(modelId)?.family ?? null;
}

export function getModelsByFamily(family: ModelFamily) {
  return MODEL_REGISTRY.filter((model) => model.family === family);
}

export function getAvailableModelsByFamilies(families: ModelFamily[]) {
  return MODEL_REGISTRY.filter((model) => families.includes(model.family));
}

export function getModelsForPlanTier(family: ModelFamily, tier: PlanTier): string[] {
  const modelIds = getModelsByFamily(family).map((model) => model.id);

  if (family === "CodexAI") {
    const trial = ["GPT-5.3-Codex", "GPT-5.1-Codex", "GPT-5-Codex"];
    const plus = [...trial, "GPT-5.4-Mini", "GPT-5.1", "GPT-5-Mini"];
    const pro = [...plus, "GPT-5.5", "GPT-5.4", "GPT-5.2", "GPT-5"];
    const max = [...pro, "GPT-5.4-Pro", "GPT-5-Pro"];
    const ultra = [...max];

    if (tier === "Trial" || tier === "Mini") return trial;
    if (tier === "Plus") return plus;
    if (tier === "Pro") return pro;
    if (tier === "Max") return max;
    if (tier === "Ultra" || tier === "Enterprise") return ultra;
    return modelIds;
  }

  if (family === "Claude") {
    const trial = ["Claude-Haiku-4.5"];
    const mini = ["Claude-Haiku-4.5", "Claude-Sonnet-4.5"];
    const plus = [...mini, "Claude-Sonnet-4.6"];
    const pro = [...plus, "Claude-Opus-4.5"];
    const max = [...pro, "Claude-Opus-4.6"];
    const ultra = [...max, "Claude-Opus-4.7"];

    if (tier === "Trial") return trial;
    if (tier === "Mini") return mini;
    if (tier === "Plus") return plus;
    if (tier === "Pro") return pro;
    if (tier === "Max") return max;
    if (tier === "Ultra" || tier === "Enterprise") return ultra;
    return modelIds;
  }

  if (family === "Gemini") {
    const trial = ["Gemini-3.1-Flash-Lite-Preview"];
    const mini = ["Gemini-3.1-Flash-Lite-Preview", "Gemini-3-Flash-Preview"];
    const plus = [...mini, "Gemini-2.5-Pro"];
    const pro = [...plus, "Gemini-3.1-Pro-Preview"];

    if (tier === "Trial") return trial;
    if (tier === "Mini") return mini;
    if (tier === "Plus") return plus;
    return pro;
  }

  if (family === "DeepSeek") {
    const mini = ["DeepSeek-V4-Flash"];
    const plus = ["DeepSeek-V4-Flash", "DeepSeek-V4-Pro"];
    if (tier === "Trial" || tier === "Mini") return mini;
    return plus;
  }

  return modelIds;
}
