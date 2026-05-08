export type StoredPurchasedPlan = {
  id: string;
  name: string;
  family: string;
  credits: string;
  amount?: string;
  duration?: string;
  apiKeyLimit?: number;
  paidAt?: string;
};

export type StoredApiKey = {
  id: string;
  name: string;
  family: string;
  keyPreview: string;
  fullKey?: string;
  status: "Đang hoạt động" | "Đã thu hồi";
  createdAt: string;
  lastUsed: string;
};

export type StoredUsageLog = {
  id: string;
  family: string;
  model: string;
  apiKey: string;
  credits: string;
  status: "Thành công" | "Thất bại";
  time: string;
};

const PURCHASED_PLANS_KEY = "tzoshop_purchased_plans";
const API_KEYS_KEY = "tzoshop_api_keys";
const USAGE_LOGS_KEY = "tzoshop_usage_logs";

function safeReadArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage write error in mock mode
  }
}

export function getPurchasedPlans() {
  return safeReadArray<StoredPurchasedPlan>(PURCHASED_PLANS_KEY);
}

export function savePurchasedPlans(plans: StoredPurchasedPlan[]) {
  safeWriteArray(PURCHASED_PLANS_KEY, plans);
}

export function getApiKeys() {
  return safeReadArray<StoredApiKey>(API_KEYS_KEY);
}

export function saveApiKeys(keys: StoredApiKey[]) {
  safeWriteArray(API_KEYS_KEY, keys);
}

export function getUsageLogs() {
  return safeReadArray<StoredUsageLog>(USAGE_LOGS_KEY);
}

export function saveUsageLogs(logs: StoredUsageLog[]) {
  safeWriteArray(USAGE_LOGS_KEY, logs);
}

export function parseCreditAmount(value: string | number) {
  if (typeof value === "number") return value;

  const normalized = value
    .toString()
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  const upper = normalized.toUpperCase();

  if (upper.endsWith("K")) {
    return Math.round(Number(upper.replace("K", "")) * 1_000);
  }

  if (upper.endsWith("M")) {
    return Math.round(Number(upper.replace("M", "")) * 1_000_000);
  }

  return Number(upper.replace(/[^\d.-]/g, "")) || 0;
}

export function formatCredits(value: number) {
  return value.toLocaleString("vi-VN");
}

export function getTotalUsedCredits(logs: StoredUsageLog[]) {
  return logs
    .filter((log) => log.status === "Thành công")
    .reduce((total, log) => {
      return total + Math.abs(parseCreditAmount(log.credits));
    }, 0);
}

export function getUsedCreditsByFamily(logs: StoredUsageLog[]) {
  return logs
    .filter((log) => log.status === "Thành công")
    .reduce<Record<string, number>>((acc, log) => {
      const used = Math.abs(parseCreditAmount(log.credits));

      acc[log.family] = (acc[log.family] ?? 0) + used;

      return acc;
    }, {});
}

export function getModelsForPlan(planName: string, family: string) {
  if (family === "CodexAI") {
    return [
      "gpt-5.3-codex",
      "gpt-5.1-codex",
      "gpt-5-codex",
      "gpt-5.4-mini",
      "gpt-5.1",
      "gpt-5-mini",
    ];
  }

  if (family === "Claude") {
    return [
      "claude-sonnet-4.5",
      "claude-opus-4.1",
      "claude-haiku-4.5",
    ];
  }

  if (family === "Gemini") {
    return [
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ];
  }

  if (family === "DeepSeek") {
    return [
      "deepseek-chat",
      "deepseek-reasoner",
      "deepseek-coder",
    ];
  }

  return [planName];
}

export function getDurationDays(duration?: string) {
  if (!duration) return 30;

  const normalized = duration.toLowerCase();

  if (normalized.includes("7")) return 7;
  if (normalized.includes("45")) return 45;
  if (normalized.includes("60")) return 60;
  if (normalized.includes("90") || normalized.includes("3m") || normalized.includes("3 tháng")) return 90;
  if (normalized.includes("180") || normalized.includes("6m") || normalized.includes("6 tháng")) return 180;
  if (normalized.includes("365") || normalized.includes("year") || normalized.includes("năm")) return 365;

  return 30;
}

export function getExpiryDate(paidAt?: string, duration?: string) {
  const start = paidAt ? new Date(paidAt) : new Date();
  const days = getDurationDays(duration);

  const expiry = new Date(start);
  expiry.setDate(expiry.getDate() + days);

  return expiry;
}

export function formatDateVi(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;

  return value.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getPlanTier(planName: string) {
  const normalized = planName.toLowerCase();

  if (normalized.includes("trial")) return "Trial";
  if (normalized.includes("mini")) return "Mini";
  if (normalized.includes("plus")) return "Plus";
  if (normalized.includes("pro")) return "Pro";
  if (normalized.includes("max")) return "Max";
  if (normalized.includes("ultra")) return "Ultra";
  if (normalized.includes("enterprise")) return "Enterprise";

  return "Mini";
}

export function getApiKeyLimitForPlan(planName: string) {
  const tier = getPlanTier(planName);

  const limits: Record<string, number> = {
    Trial: 1,
    Mini: 2,
    Plus: 3,
    Pro: 5,
    Max: 10,
    Ultra: 20,
    Enterprise: 50,
  };

  return limits[tier] ?? 2;
}
