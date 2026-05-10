export type ModelFamily = "CodexAI" | "Claude" | "Gemini" | "DeepSeek";

export type PlanTier =
  | "Trial"
  | "Mini"
  | "Plus"
  | "Pro"
  | "Max"
  | "Ultra"
  | "Enterprise";

export type TzoModel = {
  id: string;
  name: string;
  family: ModelFamily;
  providerModel: string;
  description: string;
};

export const MODEL_REGISTRY: TzoModel[] = [
  // CodexAI
  {
    id: "codexai/gpt-5.3-codex",
    name: "GPT 5.3 Codex",
    family: "CodexAI",
    providerModel: "gpt-5.3-codex",
    description: "Model tối ưu cho lập trình, đọc hiểu code và hỗ trợ IDE.",
  },
  {
    id: "codexai/gpt-5.1-codex",
    name: "GPT 5.1 Codex",
    family: "CodexAI",
    providerModel: "gpt-5.1-codex",
    description: "Model Codex ổn định cho tác vụ code hằng ngày.",
  },
  {
    id: "codexai/gpt-5-codex",
    name: "GPT 5 Codex",
    family: "CodexAI",
    providerModel: "gpt-5-codex",
    description: "Model Codex phổ thông cho extension và IDE.",
  },
  {
    id: "codexai/gpt-5.4-mini",
    name: "GPT 5.4 Mini",
    family: "CodexAI",
    providerModel: "gpt-5.4-mini",
    description: "Model nhẹ, phản hồi nhanh, phù hợp nhu cầu thường xuyên.",
  },
  {
    id: "codexai/gpt-5.1",
    name: "GPT 5.1",
    family: "CodexAI",
    providerModel: "gpt-5.1",
    description: "Model cân bằng giữa tốc độ và chất lượng.",
  },
  {
    id: "codexai/gpt-5-mini",
    name: "GPT 5 Mini",
    family: "CodexAI",
    providerModel: "gpt-5-mini",
    description: "Model tiết kiệm credits cho tác vụ nhẹ.",
  },
  {
    id: "codexai/gpt-5.5",
    name: "GPT 5.5",
    family: "CodexAI",
    providerModel: "gpt-5.5",
    description: "Model mạnh cho tác vụ phức tạp.",
  },
  {
    id: "codexai/gpt-5.4",
    name: "GPT 5.4",
    family: "CodexAI",
    providerModel: "gpt-5.4",
    description: "Model chất lượng cao cho lập trình và suy luận.",
  },
  {
    id: "codexai/gpt-5.2",
    name: "GPT 5.2",
    family: "CodexAI",
    providerModel: "gpt-5.2",
    description: "Model ổn định cho tác vụ chuyên sâu.",
  },
  {
    id: "codexai/gpt-5",
    name: "GPT 5",
    family: "CodexAI",
    providerModel: "gpt-5",
    description: "Model nền tảng cho nhiều nhu cầu sử dụng.",
  },
  {
    id: "codexai/gpt-5.4-pro",
    name: "GPT 5.4 Pro",
    family: "CodexAI",
    providerModel: "gpt-5.4-pro",
    description: "Model Pro cho tác vụ nặng và yêu cầu độ chính xác cao.",
  },
  {
    id: "codexai/gpt-5.2-pro",
    name: "GPT 5.2 Pro",
    family: "CodexAI",
    providerModel: "gpt-5.2-pro",
    description: "Model Pro ổn định cho nhu cầu nâng cao.",
  },
  {
    id: "codexai/gpt-5-pro",
    name: "GPT 5 Pro",
    family: "CodexAI",
    providerModel: "gpt-5-pro",
    description: "Model Pro mạnh cho tác vụ chuyên nghiệp.",
  },
  {
    id: "codexai/gpt-5.5-pro",
    name: "GPT 5.5 Pro",
    family: "CodexAI",
    providerModel: "gpt-5.5-pro",
    description: "Model cao nhất trong nhóm CodexAI.",
  },

  // Claude
  {
    id: "claude/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    family: "Claude",
    providerModel: "claude-haiku-4.5",
    description: "Model Claude nhẹ, nhanh, tiết kiệm credits.",
  },
  {
    id: "claude/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    family: "Claude",
    providerModel: "claude-sonnet-4.5",
    description: "Model Claude cân bằng cho tác vụ hằng ngày.",
  },
  {
    id: "claude/claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    family: "Claude",
    providerModel: "claude-sonnet-4.6",
    description: "Model Claude chất lượng cao hơn cho suy luận và viết nội dung.",
  },
  {
    id: "claude/claude-opus-4.5",
    name: "Claude Opus 4.5",
    family: "Claude",
    providerModel: "claude-opus-4.5",
    description: "Model Claude mạnh cho tác vụ phức tạp.",
  },
  {
    id: "claude/claude-opus-4.6",
    name: "Claude Opus 4.6",
    family: "Claude",
    providerModel: "claude-opus-4.6",
    description: "Model Claude cao cấp cho nhu cầu chuyên sâu.",
  },
  {
    id: "claude/claude-opus-4.7",
    name: "Claude Opus 4.7",
    family: "Claude",
    providerModel: "claude-opus-4.7",
    description: "Model Claude cao nhất trong nhóm Claude.",
  },

  // Gemini
  {
    id: "gemini/gemini-3.1-flash-lite-preview",
    name: "Gemini 3.1 Flash Lite Preview",
    family: "Gemini",
    providerModel: "gemini-3.1-flash-lite-preview",
    description: "Model Gemini nhẹ, nhanh, tiết kiệm credits.",
  },
  {
    id: "gemini/gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    family: "Gemini",
    providerModel: "gemini-3-flash-preview",
    description: "Model Gemini Flash cho tốc độ phản hồi tốt.",
  },
  {
    id: "gemini/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    family: "Gemini",
    providerModel: "gemini-2.5-pro",
    description: "Model Gemini Pro ổn định cho tác vụ nâng cao.",
  },
  {
    id: "gemini/gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    family: "Gemini",
    providerModel: "gemini-3.1-pro-preview",
    description: "Model Gemini Pro mới cho tác vụ phức tạp.",
  },

  // DeepSeek
  {
    id: "deepseek/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    family: "DeepSeek",
    providerModel: "deepseek-v4-flash",
    description: "Model DeepSeek nhanh, tiết kiệm credits.",
  },
  {
    id: "deepseek/deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    family: "DeepSeek",
    providerModel: "deepseek-v4-pro",
    description: "Model DeepSeek mạnh cho code và suy luận.",
  },
];

export const MODEL_FAMILIES: ModelFamily[] = [
  "CodexAI",
  "Claude",
  "Gemini",
  "DeepSeek",
];

export function getModelById(modelId: string) {
  return MODEL_REGISTRY.find((model) => model.id === modelId);
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

export function getModelsForPlanTier(
  family: ModelFamily,
  tier: PlanTier,
): string[] {
  const modelIds = getModelsByFamily(family).map((model) => model.id);

  if (family === "CodexAI") {
    const trial = [
      "codexai/gpt-5.3-codex",
      "codexai/gpt-5.1-codex",
      "codexai/gpt-5-codex",
    ];

    const plus = [
      ...trial,
      "codexai/gpt-5.4-mini",
      "codexai/gpt-5.1",
      "codexai/gpt-5-mini",
    ];

    const pro = [
      ...plus,
      "codexai/gpt-5.5",
      "codexai/gpt-5.4",
      "codexai/gpt-5.2",
      "codexai/gpt-5",
    ];

    const max = [
      ...pro,
      "codexai/gpt-5.4-pro",
      "codexai/gpt-5.2-pro",
      "codexai/gpt-5-pro",
    ];

    const ultra = [...max, "codexai/gpt-5.5-pro"];

    if (tier === "Trial" || tier === "Mini") return trial;
    if (tier === "Plus") return plus;
    if (tier === "Pro") return pro;
    if (tier === "Max") return max;
    if (tier === "Ultra" || tier === "Enterprise") return ultra;

    return modelIds;
  }

  if (family === "Claude") {
    const trial = ["claude/claude-haiku-4.5"];

    const mini = [
      "claude/claude-haiku-4.5",
      "claude/claude-sonnet-4.5",
    ];

    const plus = [
      ...mini,
      "claude/claude-sonnet-4.6",
    ];

    const pro = [
      ...plus,
      "claude/claude-opus-4.5",
    ];

    const max = [
      ...pro,
      "claude/claude-opus-4.6",
    ];

    const ultra = [
      ...max,
      "claude/claude-opus-4.7",
    ];

    if (tier === "Trial") return trial;
    if (tier === "Mini") return mini;
    if (tier === "Plus") return plus;
    if (tier === "Pro") return pro;
    if (tier === "Max") return max;
    if (tier === "Ultra" || tier === "Enterprise") return ultra;

    return modelIds;
  }

  if (family === "Gemini") {
    const trial = ["gemini/gemini-3.1-flash-lite-preview"];

    const mini = [
      "gemini/gemini-3.1-flash-lite-preview",
      "gemini/gemini-3-flash-preview",
    ];

    const plus = [
      ...mini,
      "gemini/gemini-2.5-pro",
    ];

    const pro = [
      ...plus,
      "gemini/gemini-3.1-pro-preview",
    ];

    if (tier === "Trial") return trial;
    if (tier === "Mini") return mini;
    if (tier === "Plus") return plus;
    if (
      tier === "Pro" ||
      tier === "Max" ||
      tier === "Ultra" ||
      tier === "Enterprise"
    ) {
      return pro;
    }

    return modelIds;
  }

  if (family === "DeepSeek") {
    const mini = ["deepseek/deepseek-v4-flash"];

    const plus = [
      "deepseek/deepseek-v4-flash",
      "deepseek/deepseek-v4-pro",
    ];

    if (tier === "Trial" || tier === "Mini") return mini;
    if (
      tier === "Plus" ||
      tier === "Pro" ||
      tier === "Max" ||
      tier === "Ultra" ||
      tier === "Enterprise"
    ) {
      return plus;
    }

    return modelIds;
  }

  return modelIds;
}
