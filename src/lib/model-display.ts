import { getModelById } from "@/lib/model-registry";
import { normalizeModelId } from "@/lib/model-id";

/**
 * Format model id for display.
 * Input can be new id (e.g. GPT-5.1-Codex) or legacy id (e.g. codexai/gpt-5.1-codex).
 */
export function formatModelName(modelId: string): string {
  if (!modelId) return "Model";
  const normalized = normalizeModelId(modelId);
  const fromRegistry = getModelById(normalized);
  if (fromRegistry) return fromRegistry.label;
  return normalized.replace(/-/g, " ");
}
