import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Start seeding...");

  await seedModels();
  await seedProducts();

  console.log("Seeding completed.");
}

async function seedModels() {
  const models = [
    // CodexAI
    {
      publicName: "gpt-5.3-codex",
      upstreamName: "gpt-5.3-codex",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.1-codex",
      upstreamName: "gpt-5.1-codex",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5-codex",
      upstreamName: "gpt-5-codex",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.4-mini",
      upstreamName: "gpt-5.4-mini",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 1.3,
      outputCreditMultiplier: 1.3,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.1",
      upstreamName: "gpt-5.1",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 1.3,
      outputCreditMultiplier: 1.3,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5-mini",
      upstreamName: "gpt-5-mini",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 1.3,
      outputCreditMultiplier: 1.3,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.5",
      upstreamName: "gpt-5.5",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.4",
      upstreamName: "gpt-5.4",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.2",
      upstreamName: "gpt-5.2",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5",
      upstreamName: "gpt-5",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.4-pro",
      upstreamName: "gpt-5.4-pro",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 8,
      outputCreditMultiplier: 8,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.2-pro",
      upstreamName: "gpt-5.2-pro",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 8,
      outputCreditMultiplier: 8,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5-pro",
      upstreamName: "gpt-5-pro",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 8,
      outputCreditMultiplier: 8,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gpt-5.5-pro",
      upstreamName: "gpt-5.5-pro",
      apiFamily: "CODEXAI" as const,
      inputCreditMultiplier: 50,
      outputCreditMultiplier: 50,
      cacheCreditMultiplier: 0,
    },

    // Claude
    {
      publicName: "claude-haiku-4.5",
      upstreamName: "claude-haiku-4.5",
      apiFamily: "CLAUDE" as const,
      inputCreditMultiplier: 0.33,
      outputCreditMultiplier: 0.33,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude-sonnet-4.5",
      upstreamName: "claude-sonnet-4.5",
      apiFamily: "CLAUDE" as const,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude-sonnet-4.6",
      upstreamName: "claude-sonnet-4.6",
      apiFamily: "CLAUDE" as const,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude-opus-4.5",
      upstreamName: "claude-opus-4.5",
      apiFamily: "CLAUDE" as const,
      inputCreditMultiplier: 1.67,
      outputCreditMultiplier: 1.67,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude-opus-4.6",
      upstreamName: "claude-opus-4.6",
      apiFamily: "CLAUDE" as const,
      inputCreditMultiplier: 1.67,
      outputCreditMultiplier: 1.67,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude-opus-4.7",
      upstreamName: "claude-opus-4.7",
      apiFamily: "CLAUDE" as const,
      inputCreditMultiplier: 1.67,
      outputCreditMultiplier: 1.67,
      cacheCreditMultiplier: 0,
    },

    // Gemini
    {
      publicName: "gemini-3.1-flash-lite-preview",
      upstreamName: "gemini-3.1-flash-lite-preview",
      apiFamily: "GEMINI" as const,
      inputCreditMultiplier: 0.5,
      outputCreditMultiplier: 0.5,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gemini-3-flash-preview",
      upstreamName: "gemini-3-flash-preview",
      apiFamily: "GEMINI" as const,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gemini-2.5-pro",
      upstreamName: "gemini-2.5-pro",
      apiFamily: "GEMINI" as const,
      inputCreditMultiplier: 5,
      outputCreditMultiplier: 5,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gemini-3.1-pro-preview",
      upstreamName: "gemini-3.1-pro-preview",
      apiFamily: "GEMINI" as const,
      inputCreditMultiplier: 6,
      outputCreditMultiplier: 6,
      cacheCreditMultiplier: 0,
    },

    // DeepSeek
    {
      publicName: "deepseek-v4-flash",
      upstreamName: "deepseek-v4-flash",
      apiFamily: "DEEPSEEK" as const,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "deepseek-v4-pro",
      upstreamName: "deepseek-v4-pro",
      apiFamily: "DEEPSEEK" as const,
      inputCreditMultiplier: 3,
      outputCreditMultiplier: 3,
      cacheCreditMultiplier: 0,
    },
  ];

  for (const model of models) {
    await prisma.aiModel.upsert({
      where: { publicName: model.publicName },
      update: model,
      create: model,
    });
  }

  console.log(`Seeded ${models.length} models.`);
}

async function seedProducts() {
  const codexTrialModels = ["gpt-5.3-codex", "gpt-5.1-codex", "gpt-5-codex"];

  const codexPlusModels = [
    ...codexTrialModels,
    "gpt-5.4-mini",
    "gpt-5.1",
    "gpt-5-mini",
  ];

  const codexProModels = [
    ...codexPlusModels,
    "gpt-5.5",
    "gpt-5.4",
    "gpt-5.2",
    "gpt-5",
  ];

  const codexMaxModels = [
    ...codexProModels,
    "gpt-5.4-pro",
    "gpt-5.2-pro",
    "gpt-5-pro",
  ];

  const codexUltraModels = [...codexMaxModels, "gpt-5.5-pro"];

  const claudeTrialModels = ["claude-haiku-4.5"];
  const claudeMiniModels = [...claudeTrialModels, "claude-sonnet-4.5"];
  const claudePlusModels = [...claudeMiniModels, "claude-sonnet-4.6"];
  const claudeProModels = [...claudePlusModels, "claude-opus-4.5"];
  const claudeMaxModels = [...claudeProModels, "claude-opus-4.6"];
  const claudeUltraModels = [...claudeMaxModels, "claude-opus-4.7"];

  const geminiAllModels = [
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-pro",
  ];

  const deepseekAllModels = ["deepseek-v4-flash", "deepseek-v4-pro"];

  const products = [
    // CodexAI thường
    {
      name: "CodexAI Trial",
      slug: "codexai-trial",
      apiFamily: "CODEXAI" as const,
      credits: BigInt(100_000),
      durationDays: 7,
      priceVnd: 19_000,
      allowedModels: codexTrialModels,
      allowedReasoning: [],
    },
    {
      name: "CodexAI Mini",
      slug: "codexai-mini",
      apiFamily: "CODEXAI" as const,
      credits: BigInt(250_000),
      durationDays: 30,
      priceVnd: 39_000,
      allowedModels: codexTrialModels,
      allowedReasoning: [],
    },
    {
      name: "CodexAI Plus",
      slug: "codexai-plus",
      apiFamily: "CODEXAI" as const,
      credits: BigInt(1_000_000),
      durationDays: 45,
      priceVnd: 139_000,
      allowedModels: codexPlusModels,
      allowedReasoning: [],
    },
    {
      name: "CodexAI Pro",
      slug: "codexai-pro",
      apiFamily: "CODEXAI" as const,
      credits: BigInt(2_000_000),
      durationDays: 60,
      priceVnd: 249_000,
      allowedModels: codexProModels,
      allowedReasoning: [],
    },
    {
      name: "CodexAI Max",
      slug: "codexai-max",
      apiFamily: "CODEXAI" as const,
      credits: BigInt(5_000_000),
      durationDays: 90,
      priceVnd: 699_000,
      allowedModels: codexMaxModels,
      allowedReasoning: [],
    },
    {
      name: "CodexAI Ultra",
      slug: "codexai-ultra",
      apiFamily: "CODEXAI" as const,
      credits: BigInt(15_000_000),
      durationDays: 180,
      priceVnd: 2_199_000,
      allowedModels: codexUltraModels,
      allowedReasoning: [],
    },

    // Claude thường
    {
      name: "Claude Trial",
      slug: "claude-trial",
      apiFamily: "CLAUDE" as const,
      credits: BigInt(300_000),
      durationDays: 7,
      priceVnd: 19_000,
      allowedModels: claudeTrialModels,
      allowedReasoning: [],
    },
    {
      name: "Claude Mini",
      slug: "claude-mini",
      apiFamily: "CLAUDE" as const,
      credits: BigInt(1_000_000),
      durationDays: 30,
      priceVnd: 69_000,
      allowedModels: claudeMiniModels,
      allowedReasoning: [],
    },
    {
      name: "Claude Plus",
      slug: "claude-plus",
      apiFamily: "CLAUDE" as const,
      credits: BigInt(2_500_000),
      durationDays: 45,
      priceVnd: 149_000,
      allowedModels: claudePlusModels,
      allowedReasoning: [],
    },
    {
      name: "Claude Pro",
      slug: "claude-pro",
      apiFamily: "CLAUDE" as const,
      credits: BigInt(6_000_000),
      durationDays: 90,
      priceVnd: 399_000,
      allowedModels: claudeProModels,
      allowedReasoning: [],
    },
    {
      name: "Claude Max",
      slug: "claude-max",
      apiFamily: "CLAUDE" as const,
      credits: BigInt(18_000_000),
      durationDays: 180,
      priceVnd: 1_199_000,
      allowedModels: claudeMaxModels,
      allowedReasoning: [],
    },
    {
      name: "Claude Ultra",
      slug: "claude-ultra",
      apiFamily: "CLAUDE" as const,
      credits: BigInt(45_000_000),
      durationDays: 365,
      priceVnd: 3_299_000,
      allowedModels: claudeUltraModels,
      allowedReasoning: [],
    },

    // Gemini thường
    {
      name: "Gemini Trial",
      slug: "gemini-trial",
      apiFamily: "GEMINI" as const,
      credits: BigInt(500_000),
      durationDays: 7,
      priceVnd: 9_000,
      allowedModels: geminiAllModels,
      allowedReasoning: [],
    },
    {
      name: "Gemini Mini",
      slug: "gemini-mini",
      apiFamily: "GEMINI" as const,
      credits: BigInt(1_000_000),
      durationDays: 30,
      priceVnd: 29_000,
      allowedModels: geminiAllModels,
      allowedReasoning: [],
    },
    {
      name: "Gemini Plus",
      slug: "gemini-plus",
      apiFamily: "GEMINI" as const,
      credits: BigInt(5_000_000),
      durationDays: 60,
      priceVnd: 99_000,
      allowedModels: geminiAllModels,
      allowedReasoning: [],
    },
    {
      name: "Gemini Pro",
      slug: "gemini-pro",
      apiFamily: "GEMINI" as const,
      credits: BigInt(10_000_000),
      durationDays: 90,
      priceVnd: 179_000,
      allowedModels: geminiAllModels,
      allowedReasoning: [],
    },
    {
      name: "Gemini Max",
      slug: "gemini-max",
      apiFamily: "GEMINI" as const,
      credits: BigInt(30_000_000),
      durationDays: 180,
      priceVnd: 499_000,
      allowedModels: geminiAllModels,
      allowedReasoning: [],
    },
    {
      name: "Gemini Ultra",
      slug: "gemini-ultra",
      apiFamily: "GEMINI" as const,
      credits: BigInt(100_000_000),
      durationDays: 365,
      priceVnd: 1_499_000,
      allowedModels: geminiAllModels,
      allowedReasoning: [],
    },

    // DeepSeek thường
    {
      name: "DeepSeek Trial",
      slug: "deepseek-trial",
      apiFamily: "DEEPSEEK" as const,
      credits: BigInt(1_000_000),
      durationDays: 7,
      priceVnd: 19_000,
      allowedModels: deepseekAllModels,
      allowedReasoning: [],
    },
    {
      name: "DeepSeek Mini",
      slug: "deepseek-mini",
      apiFamily: "DEEPSEEK" as const,
      credits: BigInt(5_000_000),
      durationDays: 30,
      priceVnd: 79_000,
      allowedModels: deepseekAllModels,
      allowedReasoning: [],
    },
    {
      name: "DeepSeek Plus",
      slug: "deepseek-plus",
      apiFamily: "DEEPSEEK" as const,
      credits: BigInt(10_000_000),
      durationDays: 60,
      priceVnd: 139_000,
      allowedModels: deepseekAllModels,
      allowedReasoning: [],
    },
    {
      name: "DeepSeek Pro",
      slug: "deepseek-pro",
      apiFamily: "DEEPSEEK" as const,
      credits: BigInt(30_000_000),
      durationDays: 90,
      priceVnd: 399_000,
      allowedModels: deepseekAllModels,
      allowedReasoning: [],
    },
    {
      name: "DeepSeek Max",
      slug: "deepseek-max",
      apiFamily: "DEEPSEEK" as const,
      credits: BigInt(100_000_000),
      durationDays: 180,
      priceVnd: 1_299_000,
      allowedModels: deepseekAllModels,
      allowedReasoning: [],
    },
    {
      name: "DeepSeek Ultra",
      slug: "deepseek-ultra",
      apiFamily: "DEEPSEEK" as const,
      credits: BigInt(300_000_000),
      durationDays: 365,
      priceVnd: 3_699_000,
      allowedModels: deepseekAllModels,
      allowedReasoning: [],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });