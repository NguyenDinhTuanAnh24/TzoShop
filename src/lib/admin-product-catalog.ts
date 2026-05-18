import { normalizeModelId, normalizeModelIds } from "@/lib/model-id";
import { MODEL_REGISTRY } from "@/lib/model-registry";

export type AdminAiFamilyKey = "all_models" | "codex" | "claude" | "gemini" | "deepseek";
export type AdminPlanTypeKey = "trial" | "monthly" | "quarterly" | "yearly";

export const ADMIN_PLAN_TYPES: Array<{ key: AdminPlanTypeKey; label: string; durationDays: number }> = [
  { key: "trial", label: "Trial 7 ngày", durationDays: 7 },
  { key: "monthly", label: "1 tháng", durationDays: 30 },
  { key: "quarterly", label: "3 tháng", durationDays: 90 },
  { key: "yearly", label: "1 năm", durationDays: 365 },
];

export const ADMIN_AI_FAMILIES: Array<{ key: AdminAiFamilyKey; label: string; apiFamily: "CODEXAI" | "CLAUDE" | "GEMINI" | "DEEPSEEK" }> = [
  { key: "all_models", label: "All Models", apiFamily: "GEMINI" },
  { key: "codex", label: "CodexAI", apiFamily: "CODEXAI" },
  { key: "claude", label: "Claude", apiFamily: "CLAUDE" },
  { key: "gemini", label: "Gemini", apiFamily: "GEMINI" },
  { key: "deepseek", label: "DeepSeek", apiFamily: "DEEPSEEK" },
];

export const NEWAPI_GROUP_BY_PREFIX: Record<AdminAiFamilyKey, string> = {
  all_models: "all_models_full",
  codex: "codex_full",
  claude: "claude_full",
  gemini: "gemini_full",
  deepseek: "deepseek_full",
};

const FAMILY_MAP: Record<Exclude<AdminAiFamilyKey, "all_models">, string> = {
  codex: "CodexAI",
  claude: "Claude",
  gemini: "Gemini",
  deepseek: "DeepSeek",
};

export const MODEL_REGISTRY_BY_FAMILY: Record<Exclude<AdminAiFamilyKey, "all_models">, Array<{ id: string; label: string }>> = {
  codex: MODEL_REGISTRY.filter((m) => m.family === "CodexAI").map((m) => ({ id: m.id, label: m.label })),
  claude: MODEL_REGISTRY.filter((m) => m.family === "Claude").map((m) => ({ id: m.id, label: m.label })),
  gemini: MODEL_REGISTRY.filter((m) => m.family === "Gemini").map((m) => ({ id: m.id, label: m.label })),
  deepseek: MODEL_REGISTRY.filter((m) => m.family === "DeepSeek").map((m) => ({ id: m.id, label: m.label })),
};

export function detectFamilyKeyFromSlug(slug: string): AdminAiFamilyKey {
  const normalized = (slug || "").toLowerCase();
  if (normalized.startsWith("all_models_")) return "all_models";
  if (normalized.startsWith("codex_")) return "codex";
  if (normalized.startsWith("claude_")) return "claude";
  if (normalized.startsWith("gemini_")) return "gemini";
  if (normalized.startsWith("deepseek_")) return "deepseek";
  return "codex";
}

export function detectPlanTypeFromSlug(slug: string): AdminPlanTypeKey {
  const normalized = (slug || "").toLowerCase();
  if (normalized.endsWith("_trial")) return "trial";
  if (normalized.endsWith("_monthly")) return "monthly";
  if (normalized.endsWith("_quarterly")) return "quarterly";
  return "yearly";
}

export function buildPlanSuggestion(familyKey: AdminAiFamilyKey, planType: AdminPlanTypeKey) {
  const familyLabel = ADMIN_AI_FAMILIES.find((f) => f.key === familyKey)?.label ?? "CodexAI";
  const prefix = familyKey;
  const plan = ADMIN_PLAN_TYPES.find((p) => p.key === planType) ?? ADMIN_PLAN_TYPES[0];
  const slug = `${prefix}_${planType}`;
  const nameSuffix = planType === "trial" ? "Trial 7 ngày" : planType === "monthly" ? "1 tháng" : planType === "quarterly" ? "3 tháng" : "1 năm";
  return {
    name: `API ${familyLabel} ${nameSuffix}`,
    slug,
    durationDays: plan.durationDays,
    newApiGroup: NEWAPI_GROUP_BY_PREFIX[familyKey],
  };
}

export function getSelectableModels(familyKey: AdminAiFamilyKey) {
  if (familyKey === "all_models") {
    return [
      ...MODEL_REGISTRY_BY_FAMILY.codex,
      ...MODEL_REGISTRY_BY_FAMILY.claude,
      ...MODEL_REGISTRY_BY_FAMILY.gemini,
      ...MODEL_REGISTRY_BY_FAMILY.deepseek,
    ];
  }
  return MODEL_REGISTRY_BY_FAMILY[familyKey];
}

export function normalizeAllowedModelsForSlug(slug: string, models: string[]) {
  const familyKey = detectFamilyKeyFromSlug(slug);
  const normalized = normalizeModelIds(models);
  const selectable = new Set(getSelectableModels(familyKey).map((m) => m.id));
  return normalized.filter((m) => selectable.has(m));
}

export function validateAllowedModelsBySlug(slug: string, allowedModels: string[]) {
  const familyKey = detectFamilyKeyFromSlug(slug);
  const normalized = normalizeModelIds(allowedModels);

  if (!Array.isArray(normalized) || normalized.length === 0) {
    return "Danh sách model hỗ trợ không được để trống.";
  }

  const all = getSelectableModels("all_models").map((m) => m.id);
  const allSet = new Set(all);
  const invalid = normalized.find((m) => !allSet.has(m));
  if (invalid) {
    return `Model "${normalizeModelId(invalid)}" không có trong registry NewAPI.`;
  }

  if (familyKey === "all_models") {
    const familySet = new Set(
      normalized.map((m) => MODEL_REGISTRY.find((model) => model.id === m)?.family ?? "Other"),
    );
    if (familySet.has("Other")) return "Model của gói All Models chứa id không hợp lệ.";
    if (familySet.size < 2) return "Gói all_models_* cần chứa model từ nhiều dòng AI.";
    return null;
  }

  const familyName = FAMILY_MAP[familyKey];
  const familyModelSet = new Set(MODEL_REGISTRY.filter((m) => m.family === familyName).map((m) => m.id));
  const wrong = normalized.find((m) => !familyModelSet.has(m));
  if (wrong) {
    return `Model "${wrong}" không thuộc dòng ${familyKey}.`;
  }
  return null;
}
