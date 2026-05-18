export const TOKENS_PER_CREDIT = 100_000;
export const NEWAPI_QUOTA_MULTIPLIER = 8;

export function tokensToCredits(tokens: number) {
  if (!Number.isFinite(tokens) || tokens <= 0) return 0;
  return tokens / TOKENS_PER_CREDIT;
}

export function creditsToNewApiQuota(credits: number) {
  if (!Number.isFinite(credits) || credits <= 0) return 0;
  return Math.ceil(credits * NEWAPI_QUOTA_MULTIPLIER);
}

export function formatCredits(value: number) {
  return value.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
}
