import { prisma } from "@/lib/prisma";

export async function calculateChargedCredits(params: {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cachedTokens?: number;
}) {
  const model = await prisma.aiModel.findFirst({
    where: {
      publicName: params.model,
      isActive: true,
    },
  });

  if (!model) {
    throw new Error("Model không tồn tại hoặc chưa được hỗ trợ.");
  }

  const cachedTokens = params.cachedTokens ?? 0;

  const inputCredits =
    (params.inputTokens / 1000) * model.inputCreditMultiplier;

  const outputCredits =
    (params.outputTokens / 1000) * model.outputCreditMultiplier;

  const cachedCredits =
    (cachedTokens / 1000) * model.cacheCreditMultiplier;

  const chargedCredits = Math.ceil(inputCredits + outputCredits + cachedCredits);

  return {
    model,
    chargedCredits: Math.max(chargedCredits, 1),
  };
}
