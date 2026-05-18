export type ModelAiLine = "CODEXAI" | "CLAUDE" | "GEMINI" | "DEEPSEEK" | "UNKNOWN";

export function getAiLineFromModel(model: string): ModelAiLine {
  const m = String(model || "").toLowerCase().trim();

  if (m.startsWith("deepseek")) return "DEEPSEEK";
  if (m.startsWith("gpt")) return "CODEXAI";
  if (m.startsWith("claude")) return "CLAUDE";
  if (m.startsWith("gemini")) return "GEMINI";

  // Legacy prefixes
  if (m.startsWith("deepseek/")) return "DEEPSEEK";
  if (m.startsWith("codexai/")) return "CODEXAI";
  if (m.startsWith("claude/")) return "CLAUDE";
  if (m.startsWith("gemini/")) return "GEMINI";

  return "UNKNOWN";
}

export function getAiLineLabel(line: ModelAiLine): string {
  if (line === "DEEPSEEK") return "DeepSeek";
  if (line === "CODEXAI") return "CodexAI";
  if (line === "CLAUDE") return "Claude";
  if (line === "GEMINI") return "Gemini";
  return "Khác";
}
