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
    description: "Model Codex chuyên cho lập trình, debug và tạo tính năng.",
  },
  {
    id: "codexai/gpt-5.1-codex",
    name: "GPT 5.1 Codex",
    family: "CodexAI",
    providerModel: "gpt-5.1-codex",
    description: "Model Codex tối ưu cho tác vụ code, chi phí thấp.",
  },
  {
    id: "codexai/gpt-5-codex",
    name: "GPT 5 Codex",
    family: "CodexAI",
    providerModel: "gpt-5-codex",
    description: "Model Codex phổ thông cho coding assistant.",
  },
  {
    id: "codexai/gpt-5.4-mini",
    name: "GPT 5.4 Mini",
    family: "CodexAI",
    providerModel: "gpt-5.4-mini",
    description: "Model nhẹ, nhanh, phù hợp request thường xuyên.",
  },
  {
    id: "codexai/gpt-5.1",
    name: "GPT 5.1",
    family: "CodexAI",
    providerModel: "gpt-5.1",
    description: "Model GPT 5.1 cho tác vụ phổ thông.",
  },
  {
    id: "codexai/gpt-5-mini",
    name: "GPT 5 Mini",
    family: "CodexAI",
    providerModel: "gpt-5-mini",
    description: "Model nhẹ, nhanh, tiết kiệm credits.",
  },
  {
    id: "codexai/gpt-5.5",
    name: "GPT 5.5",
    family: "CodexAI",
    providerModel: "gpt-5.5",
    description: "Model GPT 5.5 cho tác vụ tổng quát và coding nâng cao.",
  },
  {
    id: "codexai/gpt-5.4",
    name: "GPT 5.4",
    family: "CodexAI",
    providerModel: "gpt-5.4",
    description: "Model GPT 5.4 cân bằng giữa tốc độ và chất lượng.",
  },
  {
    id: "codexai/gpt-5.2",
    name: "GPT 5.2",
    family: "CodexAI",
    providerModel: "gpt-5.2",
    description: "Model GPT 5.2 cho tác vụ tổng quát.",
  },
  {
    id: "codexai/gpt-5",
    name: "GPT 5",
    family: "CodexAI",
    providerModel: "gpt-5",
    description: "Model GPT 5 cho tác vụ tổng quát.",
  },
  {
    id: "codexai/gpt-5.4-pro",
    name: "GPT 5.4 Pro",
    family: "CodexAI",
    providerModel: "gpt-5.4-pro",
    description: "Phiên bản Pro của GPT 5.4 cho tác vụ khó hơn.",
  },
  {
    id: "codexai/gpt-5.2-pro",
    name: "GPT 5.2 Pro",
    family: "CodexAI",
    providerModel: "gpt-5.2-pro",
    description: "Phiên bản Pro của GPT 5.2.",
  },
  {
    id: "codexai/gpt-5-pro",
    name: "GPT 5 Pro",
    family: "CodexAI",
    providerModel: "gpt-5-pro",
    description: "Phiên bản Pro của GPT 5.",
  },
  {
    id: "codexai/gpt-5.5-pro",
    name: "GPT 5.5 Pro",
    family: "CodexAI",
    providerModel: "gpt-5.5-pro",
    description: "Model Pro cao cấp nhất trong nhóm CodexAI.",
  },

  // Claude
  {
    id: "claude/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    family: "Claude",
    providerModel: "claude-haiku-4.5",
    description: "Model Claude nhanh, nhẹ, phù hợp request ngắn và tiết kiệm credits.",
  },
  {
    id: "claude/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    family: "Claude",
    providerModel: "claude-sonnet-4.5",
    description: "Model Claude cân bằng giữa chất lượng, tốc độ và lập trình.",
  },
  {
    id: "claude/claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    family: "Claude",
    providerModel: "claude-sonnet-4.6",
    description: "Model Claude Sonnet cao hơn cho tác vụ tổng quát và coding.",
  },
  {
    id: "claude/claude-opus-4.5",
    name: "Claude Opus 4.5",
    family: "Claude",
    providerModel: "claude-opus-4.5",
    description: "Model Claude Opus cho tác vụ phân tích và reasoning phức tạp.",
  },
  {
    id: "claude/claude-opus-4.6",
    name: "Claude Opus 4.6",
    family: "Claude",
    providerModel: "claude-opus-4.6",
    description: "Model Claude Opus mạnh cho tác vụ chuyên sâu.",
  },
  {
    id: "claude/claude-opus-4.7",
    name: "Claude Opus 4.7",
    family: "Claude",
    providerModel: "claude-opus-4.7",
    description: "Model Claude cao cấp nhất trong nhóm Claude.",
  },

  // Gemini
  {
    id: "gemini/gemini-3.1-flash-lite-preview",
    name: "Gemini 3.1 Flash Lite Preview",
    family: "Gemini",
    providerModel: "gemini-3.1-flash-lite-preview",
    description: "Model Gemini tiết kiệm, phù hợp tác vụ lớn và request thường xuyên.",
  },
  {
    id: "gemini/gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    family: "Gemini",
    providerModel: "gemini-3-flash-preview",
    description: "Model Gemini nhanh, phù hợp xử lý đa phương tiện.",
  },
  {
    id: "gemini/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    family: "Gemini",
    providerModel: "gemini-2.5-pro",
    description: "Model Gemini mạnh cho coding, reasoning và tác vụ đa nhiệm.",
  },
  {
    id: "gemini/gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    family: "Gemini",
    providerModel: "gemini-3.1-pro-preview",
    description: "Model Gemini cao cấp cho tác vụ cần chất lượng và ổn định.",
  },

  // DeepSeek
  {
    id: "deepseek/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    family: "DeepSeek",
    providerModel: "deepseek-v4-flash",
    description: "Model DeepSeek nhanh, hệ số trừ credits thấp.",
  },
  {
    id: "deepseek/deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    family: "DeepSeek",
    providerModel: "deepseek-v4-pro",
    description: "Model DeepSeek Pro mạnh hơn cho tác vụ phức tạp.",
  },
];

export function getModelById(modelId: string) {
  return MODEL_REGISTRY.find((model) => model.id === modelId) ?? null;
}

export function getFamilyFromModelId(modelId: string) {
  return getModelById(modelId)?.family ?? null;
}

export function getModelsByFamily(family: ModelFamily) {
  return MODEL_REGISTRY.filter((model) => model.family === family);
}

export function getAvailableModelsByFamilies(families: string[]) {
  return MODEL_REGISTRY.filter((model) => families.includes(model.family));
}

export function getModelsForPlanTier(family: ModelFamily, tier: PlanTier) {
  if (family === "CodexAI") {
    const codexByTier: Record<PlanTier, string[]> = {
      Trial: [
        "codexai/gpt-5.3-codex",
        "codexai/gpt-5.1-codex",
        "codexai/gpt-5-codex",
      ],
      Mini: [
        "codexai/gpt-5.3-codex",
        "codexai/gpt-5.1-codex",
        "codexai/gpt-5-codex",
      ],
      Plus: [
        "codexai/gpt-5.3-codex",
        "codexai/gpt-5.1-codex",
        "codexai/gpt-5-codex",
        "codexai/gpt-5.4-mini",
        "codexai/gpt-5.1",
        "codexai/gpt-5-mini",
      ],
      Pro: [
        "codexai/gpt-5.3-codex",
        "codexai/gpt-5.1-codex",
        "codexai/gpt-5-codex",
        "codexai/gpt-5.4-mini",
        "codexai/gpt-5.1",
        "codexai/gpt-5-mini",
        "codexai/gpt-5.5",
        "codexai/gpt-5.4",
        "codexai/gpt-5.2",
        "codexai/gpt-5",
      ],
      Max: [
        "codexai/gpt-5.3-codex",
        "codexai/gpt-5.1-codex",
        "codexai/gpt-5-codex",
        "codexai/gpt-5.4-mini",
        "codexai/gpt-5.1",
        "codexai/gpt-5-mini",
        "codexai/gpt-5.5",
        "codexai/gpt-5.4",
        "codexai/gpt-5.2",
        "codexai/gpt-5",
        "codexai/gpt-5.4-pro",
        "codexai/gpt-5.2-pro",
        "codexai/gpt-5-pro",
      ],
      Ultra: [
        "codexai/gpt-5.3-codex",
        "codexai/gpt-5.1-codex",
        "codexai/gpt-5-codex",
        "codexai/gpt-5.4-mini",
        "codexai/gpt-5.1",
        "codexai/gpt-5-mini",
        "codexai/gpt-5.5",
        "codexai/gpt-5.4",
        "codexai/gpt-5.2",
        "codexai/gpt-5",
        "codexai/gpt-5.4-pro",
        "codexai/gpt-5.2-pro",
        "codexai/gpt-5-pro",
        "codexai/gpt-5.5-pro",
      ],
      Enterprise: [
        "codexai/gpt-5.3-codex",
        "codexai/gpt-5.1-codex",
        "codexai/gpt-5-codex",
        "codexai/gpt-5.4-mini",
        "codexai/gpt-5.1",
        "codexai/gpt-5-mini",
        "codexai/gpt-5.5",
        "codexai/gpt-5.4",
        "codexai/gpt-5.2",
        "codexai/gpt-5",
        "codexai/gpt-5.4-pro",
        "codexai/gpt-5.2-pro",
        "codexai/gpt-5-pro",
        "codexai/gpt-5.5-pro",
      ],
    };

    return codexByTier[tier];
  }

  if (family === "Claude") {
    const claudeByTier: Record<PlanTier, string[]> = {
      Trial: ["claude/claude-haiku-4.5"],
      Mini: ["claude/claude-haiku-4.5", "claude/claude-sonnet-4.5"],
      Plus: [
        "claude/claude-haiku-4.5",
        "claude/claude-sonnet-4.5",
        "claude/claude-sonnet-4.6",
      ],
      Pro: [
        "claude/claude-haiku-4.5",
        "claude/claude-sonnet-4.5",
        "claude/claude-sonnet-4.6",
        "claude/claude-opus-4.5",
      ],
      Max: [
        "claude/claude-haiku-4.5",
        "claude/claude-sonnet-4.5",
        "claude/claude-sonnet-4.6",
        "claude/claude-opus-4.5",
        "claude/claude-opus-4.6",
      ],
      Ultra: [
        "claude/claude-haiku-4.5",
        "claude/claude-sonnet-4.5",
        "claude/claude-sonnet-4.6",
        "claude/claude-opus-4.5",
        "claude/claude-opus-4.6",
        "claude/claude-opus-4.7",
      ],
      Enterprise: [
        "claude/claude-haiku-4.5",
        "claude/claude-sonnet-4.5",
        "claude/claude-sonnet-4.6",
        "claude/claude-opus-4.5",
        "claude/claude-opus-4.6",
        "claude/claude-opus-4.7",
      ],
    };

    return claudeByTier[tier];
  }

  if (family === "Gemini") {
    const geminiByTier: Record<PlanTier, string[]> = {
      Trial: ["gemini/gemini-3.1-flash-lite-preview"],
      Mini: [
        "gemini/gemini-3.1-flash-lite-preview",
        "gemini/gemini-3-flash-preview",
      ],
      Plus: [
        "gemini/gemini-3.1-flash-lite-preview",
        "gemini/gemini-3-flash-preview",
        "gemini/gemini-2.5-pro",
      ],
      Pro: [
        "gemini/gemini-3.1-flash-lite-preview",
        "gemini/gemini-3-flash-preview",
        "gemini/gemini-2.5-pro",
        "gemini/gemini-3.1-pro-preview",
      ],
      Max: [
        "gemini/gemini-3.1-flash-lite-preview",
        "gemini/gemini-3-flash-preview",
        "gemini/gemini-2.5-pro",
        "gemini/gemini-3.1-pro-preview",
      ],
      Ultra: [
        "gemini/gemini-3.1-flash-lite-preview",
        "gemini/gemini-3-flash-preview",
        "gemini/gemini-2.5-pro",
        "gemini/gemini-3.1-pro-preview",
      ],
      Enterprise: [
        "gemini/gemini-3.1-flash-lite-preview",
        "gemini/gemini-3-flash-preview",
        "gemini/gemini-2.5-pro",
        "gemini/gemini-3.1-pro-preview",
      ],
    };

    return geminiByTier[tier];
  }

  if (family === "DeepSeek") {
    const deepseekByTier: Record<PlanTier, string[]> = {
      Trial: ["deepseek/deepseek-v4-flash"],
      Mini: ["deepseek/deepseek-v4-flash"],
      Plus: ["deepseek/deepseek-v4-flash", "deepseek/deepseek-v4-pro"],
      Pro: ["deepseek/deepseek-v4-flash", "deepseek/deepseek-v4-pro"],
      Max: ["deepseek/deepseek-v4-flash", "deepseek/deepseek-v4-pro"],
      Ultra: ["deepseek/deepseek-v4-flash", "deepseek/deepseek-v4-pro"],
      Enterprise: ["deepseek/deepseek-v4-flash", "deepseek/deepseek-v4-pro"],
    };

    return deepseekByTier[tier];
  }

  return [];
}
