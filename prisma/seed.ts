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
      publicName: "codexai/gpt-5.3-codex",
      upstreamName: "gpt-5.3-codex",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.1-codex",
      upstreamName: "gpt-5.1-codex",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5-codex",
      upstreamName: "gpt-5-codex",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.4-mini",
      upstreamName: "gpt-5.4-mini",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 1.3,
      outputCreditMultiplier: 1.3,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.1",
      upstreamName: "gpt-5.1",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 1.3,
      outputCreditMultiplier: 1.3,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5-mini",
      upstreamName: "gpt-5-mini",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 1.3,
      outputCreditMultiplier: 1.3,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.5",
      upstreamName: "gpt-5.5",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.4",
      upstreamName: "gpt-5.4",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.2",
      upstreamName: "gpt-5.2",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5",
      upstreamName: "gpt-5",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 4,
      outputCreditMultiplier: 4,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.4-pro",
      upstreamName: "gpt-5.4-pro",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 8,
      outputCreditMultiplier: 8,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.2-pro",
      upstreamName: "gpt-5.2-pro",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 8,
      outputCreditMultiplier: 8,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5-pro",
      upstreamName: "gpt-5-pro",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 8,
      outputCreditMultiplier: 8,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "codexai/gpt-5.5-pro",
      upstreamName: "gpt-5.5-pro",
      apiFamily: "CODEXAI" as any,
      inputCreditMultiplier: 50,
      outputCreditMultiplier: 50,
      cacheCreditMultiplier: 0,
    },

    // Claude
    {
      publicName: "claude/claude-haiku-4.5",
      upstreamName: "claude-haiku-4.5",
      apiFamily: "CLAUDE" as any,
      inputCreditMultiplier: 0.33,
      outputCreditMultiplier: 0.33,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude/claude-sonnet-4.5",
      upstreamName: "claude-sonnet-4.5",
      apiFamily: "CLAUDE" as any,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude/claude-sonnet-4.6",
      upstreamName: "claude-sonnet-4.6",
      apiFamily: "CLAUDE" as any,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude/claude-opus-4.5",
      upstreamName: "claude-opus-4.5",
      apiFamily: "CLAUDE" as any,
      inputCreditMultiplier: 1.67,
      outputCreditMultiplier: 1.67,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude/claude-opus-4.6",
      upstreamName: "claude-opus-4.6",
      apiFamily: "CLAUDE" as any,
      inputCreditMultiplier: 1.67,
      outputCreditMultiplier: 1.67,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "claude/claude-opus-4.7",
      upstreamName: "claude-opus-4.7",
      apiFamily: "CLAUDE" as any,
      inputCreditMultiplier: 1.67,
      outputCreditMultiplier: 1.67,
      cacheCreditMultiplier: 0,
    },

    // Gemini
    {
      publicName: "gemini/gemini-3.1-flash-lite-preview",
      upstreamName: "gemini-3.1-flash-lite-preview",
      apiFamily: "GEMINI" as any,
      inputCreditMultiplier: 0.5,
      outputCreditMultiplier: 0.5,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gemini/gemini-3-flash-preview",
      upstreamName: "gemini-3-flash-preview",
      apiFamily: "GEMINI" as any,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gemini/gemini-2.5-pro",
      upstreamName: "gemini-2.5-pro",
      apiFamily: "GEMINI" as any,
      inputCreditMultiplier: 5,
      outputCreditMultiplier: 5,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "gemini/gemini-3.1-pro-preview",
      upstreamName: "gemini-3.1-pro-preview",
      apiFamily: "GEMINI" as any,
      inputCreditMultiplier: 6,
      outputCreditMultiplier: 6,
      cacheCreditMultiplier: 0,
    },

    // DeepSeek
    {
      publicName: "deepseek/deepseek-v4-flash",
      upstreamName: "deepseek-v4-flash",
      apiFamily: "DEEPSEEK" as any,
      inputCreditMultiplier: 1,
      outputCreditMultiplier: 1,
      cacheCreditMultiplier: 0,
    },
    {
      publicName: "deepseek/deepseek-v4-pro",
      upstreamName: "deepseek-v4-pro",
      apiFamily: "DEEPSEEK" as any,
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

function getTierFromSlug(slug: string) {
  if (slug.endsWith("-trial")) return "Trial";
  if (slug.endsWith("-mini")) return "Mini";
  if (slug.endsWith("-plus")) return "Plus";
  if (slug.endsWith("-pro")) return "Pro";
  if (slug.endsWith("-max")) return "Max";
  if (slug.endsWith("-ultra")) return "Ultra";
  if (slug.endsWith("-enterprise")) return "Enterprise";

  // Long-term suffixes
  if (slug.includes("-pro-")) return "Pro";
  if (slug.includes("-max-")) return "Max";
  if (slug.includes("-plus-")) return "Plus";
  if (slug.includes("-ultra-")) return "Ultra";

  return "Mini";
}

const apiKeyLimitByTier: Record<string, number> = {
  Trial: 1,
  Mini: 2,
  Plus: 3,
  Pro: 5,
  Max: 10,
  Ultra: 20,
  Enterprise: 50,
};

function getModelsForPlanTier(family: string, tier: string): string[] {
  if (family === "DEEPSEEK") {
    const mini = ["deepseek/deepseek-v4-flash"];
    const plus = ["deepseek/deepseek-v4-flash", "deepseek/deepseek-v4-pro"];
    if (tier === "Trial" || tier === "Mini") return mini;
    return plus;
  }

  if (family === "CLAUDE") {
    const trial = ["claude/claude-haiku-4.5"];
    const mini = ["claude/claude-haiku-4.5", "claude/claude-sonnet-4.5"];
    const plus = [...mini, "claude/claude-sonnet-4.6"];
    const pro = [...plus, "claude/claude-opus-4.5"];
    const max = [...pro, "claude/claude-opus-4.6"];
    const ultra = [...max, "claude/claude-opus-4.7"];

    if (tier === "Trial") return trial;
    if (tier === "Mini") return mini;
    if (tier === "Plus") return plus;
    if (tier === "Pro") return pro;
    if (tier === "Max") return max;
    return ultra;
  }

  if (family === "GEMINI") {
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

    return pro;
  }

  if (family === "CODEXAI") {
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
    return ultra;
  }

  return [];
}

async function seedProducts() {
  const products = [
    // CodexAI thường
    {
      name: "CodexAI Trial",
      slug: "codexai-trial",
      apiFamily: "CODEXAI",
      credits: BigInt(100_000),
      durationDays: 7,
      priceVnd: 19_000,
    },
    {
      name: "CodexAI Mini",
      slug: "codexai-mini",
      apiFamily: "CODEXAI",
      credits: BigInt(250_000),
      durationDays: 30,
      priceVnd: 39_000,
    },
    {
      name: "CodexAI Plus",
      slug: "codexai-plus",
      apiFamily: "CODEXAI",
      credits: BigInt(1_000_000),
      durationDays: 45,
      priceVnd: 139_000,
    },
    {
      name: "CodexAI Pro",
      slug: "codexai-pro",
      apiFamily: "CODEXAI",
      credits: BigInt(2_000_000),
      durationDays: 60,
      priceVnd: 249_000,
    },
    {
      name: "CodexAI Max",
      slug: "codexai-max",
      apiFamily: "CODEXAI",
      credits: BigInt(5_000_000),
      durationDays: 90,
      priceVnd: 699_000,
    },
    {
      name: "CodexAI Ultra",
      slug: "codexai-ultra",
      apiFamily: "CODEXAI",
      credits: BigInt(15_000_000),
      durationDays: 180,
      priceVnd: 2_199_000,
    },

    // CodexAI long-term
    {
      name: "CodexAI Pro 3M",
      slug: "codexai-pro-3m",
      apiFamily: "CODEXAI",
      tier: "Pro",
      priceVnd: 710000,
      credits: BigInt(6_000_000),
      durationDays: 90,
    },
    {
      name: "CodexAI Pro 6M",
      slug: "codexai-pro-6m",
      apiFamily: "CODEXAI",
      tier: "Pro",
      priceVnd: 1345000,
      credits: BigInt(12_000_000),
      durationDays: 180,
    },
    {
      name: "CodexAI Pro Year",
      slug: "codexai-pro-year",
      apiFamily: "CODEXAI",
      tier: "Pro",
      priceVnd: 2540000,
      credits: BigInt(24_000_000),
      durationDays: 365,
    },
    {
      name: "CodexAI Max 3M",
      slug: "codexai-max-3m",
      apiFamily: "CODEXAI",
      tier: "Max",
      priceVnd: 1992000,
      credits: BigInt(15_000_000),
      durationDays: 90,
    },
    {
      name: "CodexAI Max 6M",
      slug: "codexai-max-6m",
      apiFamily: "CODEXAI",
      tier: "Max",
      priceVnd: 3775000,
      credits: BigInt(30_000_000),
      durationDays: 180,
    },
    {
      name: "CodexAI Max Year",
      slug: "codexai-max-year",
      apiFamily: "CODEXAI",
      tier: "Max",
      priceVnd: 7130000,
      credits: BigInt(60_000_000),
      durationDays: 365,
    },
    {
      name: "CodexAI Ultra 3M",
      slug: "codexai-ultra-3m",
      apiFamily: "CODEXAI",
      tier: "Ultra",
      priceVnd: 8990000,
      credits: BigInt(75_000_000),
      durationDays: 90,
    },
    {
      name: "CodexAI Ultra 6M",
      slug: "codexai-ultra-6m",
      apiFamily: "CODEXAI",
      tier: "Ultra",
      priceVnd: 13990000,
      credits: BigInt(120_000_000),
      durationDays: 180,
    },
    {
      name: "CodexAI Ultra Year",
      slug: "codexai-ultra-year",
      apiFamily: "CODEXAI",
      tier: "Ultra",
      priceVnd: 19990000,
      credits: BigInt(180_000_000),
      durationDays: 365,
    },
    {
      name: "CodexAI Enterprise",
      slug: "codexai-enterprise",
      apiFamily: "CODEXAI",
      tier: "Enterprise",
      priceVnd: 0,
      credits: BigInt(300_000_000),
      durationDays: 365,
    },

    // Claude thường
    {
      name: "Claude Trial",
      slug: "claude-trial",
      apiFamily: "CLAUDE",
      credits: BigInt(300_000),
      durationDays: 7,
      priceVnd: 19_000,
    },
    {
      name: "Claude Mini",
      slug: "claude-mini",
      apiFamily: "CLAUDE",
      credits: BigInt(1_000_000),
      durationDays: 30,
      priceVnd: 69_000,
    },
    {
      name: "Claude Plus",
      slug: "claude-plus",
      apiFamily: "CLAUDE",
      credits: BigInt(2_500_000),
      durationDays: 45,
      priceVnd: 149_000,
    },
    {
      name: "Claude Pro",
      slug: "claude-pro",
      apiFamily: "CLAUDE",
      credits: BigInt(6_000_000),
      durationDays: 90,
      priceVnd: 399_000,
    },
    {
      name: "Claude Max",
      slug: "claude-max",
      apiFamily: "CLAUDE",
      credits: BigInt(18_000_000),
      durationDays: 180,
      priceVnd: 1_199_000,
    },
    {
      name: "Claude Ultra",
      slug: "claude-ultra",
      apiFamily: "CLAUDE",
      credits: BigInt(45_000_000),
      durationDays: 365,
      priceVnd: 3_299_000,
    },

    // Claude long-term
    {
      name: "Claude Plus 3M",
      slug: "claude-plus-3m",
      apiFamily: "CLAUDE",
      tier: "Plus",
      priceVnd: 425000,
      credits: BigInt(7_500_000),
      durationDays: 90,
    },
    {
      name: "Claude Plus 6M",
      slug: "claude-plus-6m",
      apiFamily: "CLAUDE",
      tier: "Plus",
      priceVnd: 805000,
      credits: BigInt(15_000_000),
      durationDays: 180,
    },
    {
      name: "Claude Plus Year",
      slug: "claude-plus-year",
      apiFamily: "CLAUDE",
      tier: "Plus",
      priceVnd: 1520000,
      credits: BigInt(30_000_000),
      durationDays: 365,
    },
    {
      name: "Claude Pro 3M",
      slug: "claude-pro-3m",
      apiFamily: "CLAUDE",
      tier: "Pro",
      priceVnd: 1137000,
      credits: BigInt(18_000_000),
      durationDays: 90,
    },
    {
      name: "Claude Pro 6M",
      slug: "claude-pro-6m",
      apiFamily: "CLAUDE",
      tier: "Pro",
      priceVnd: 2154000,
      credits: BigInt(36_000_000),
      durationDays: 180,
    },
    {
      name: "Claude Pro Year",
      slug: "claude-pro-year",
      apiFamily: "CLAUDE",
      tier: "Pro",
      priceVnd: 4070000,
      credits: BigInt(72_000_000),
      durationDays: 365,
    },
    {
      name: "Claude Max 3M",
      slug: "claude-max-3m",
      apiFamily: "CLAUDE",
      tier: "Max",
      priceVnd: 3990000,
      credits: BigInt(54_000_000),
      durationDays: 90,
    },
    {
      name: "Claude Max 6M",
      slug: "claude-max-6m",
      apiFamily: "CLAUDE",
      tier: "Max",
      priceVnd: 7990000,
      credits: BigInt(108_000_000),
      durationDays: 180,
    },
    {
      name: "Claude Max Year",
      slug: "claude-max-year",
      apiFamily: "CLAUDE",
      tier: "Max",
      priceVnd: 0,
      credits: BigInt(108_000_000),
      durationDays: 365,
    },
    {
      name: "Claude Ultra Year",
      slug: "claude-ultra-year",
      apiFamily: "CLAUDE",
      tier: "Ultra",
      priceVnd: 0,
      credits: BigInt(150_000_000),
      durationDays: 365,
    },

    // Gemini thường
    {
      name: "Gemini Trial",
      slug: "gemini-trial",
      apiFamily: "GEMINI",
      credits: BigInt(500_000),
      durationDays: 7,
      priceVnd: 9_000,
    },
    {
      name: "Gemini Mini",
      slug: "gemini-mini",
      apiFamily: "GEMINI",
      credits: BigInt(1_000_000),
      durationDays: 30,
      priceVnd: 29_000,
    },
    {
      name: "Gemini Plus",
      slug: "gemini-plus",
      apiFamily: "GEMINI",
      credits: BigInt(5_000_000),
      durationDays: 60,
      priceVnd: 99_000,
    },
    {
      name: "Gemini Pro",
      slug: "gemini-pro",
      apiFamily: "GEMINI",
      credits: BigInt(10_000_000),
      durationDays: 90,
      priceVnd: 179_000,
    },
    {
      name: "Gemini Max",
      slug: "gemini-max",
      apiFamily: "GEMINI",
      credits: BigInt(30_000_000),
      durationDays: 180,
      priceVnd: 499_000,
    },
    {
      name: "Gemini Ultra",
      slug: "gemini-ultra",
      apiFamily: "GEMINI",
      credits: BigInt(100_000_000),
      durationDays: 365,
      priceVnd: 1_499_000,
    },

    // Gemini long-term
    {
      name: "Gemini Plus 3M",
      slug: "gemini-plus-3m",
      apiFamily: "GEMINI",
      tier: "Plus",
      priceVnd: 282000,
      credits: BigInt(15_000_000),
      durationDays: 90,
    },
    {
      name: "Gemini Plus 6M",
      slug: "gemini-plus-6m",
      apiFamily: "GEMINI",
      tier: "Plus",
      priceVnd: 535000,
      credits: BigInt(30_000_000),
      durationDays: 180,
    },
    {
      name: "Gemini Plus Year",
      slug: "gemini-plus-year",
      apiFamily: "GEMINI",
      tier: "Plus",
      priceVnd: 1010000,
      credits: BigInt(60_000_000),
      durationDays: 365,
    },
    {
      name: "Gemini Pro 3M",
      slug: "gemini-pro-3m",
      apiFamily: "GEMINI",
      tier: "Pro",
      priceVnd: 579000,
      credits: BigInt(30_000_000),
      durationDays: 90,
    },
    {
      name: "Gemini Pro 6M",
      slug: "gemini-pro-6m",
      apiFamily: "GEMINI",
      tier: "Pro",
      priceVnd: 1099000,
      credits: BigInt(60_000_000),
      durationDays: 180,
    },
    {
      name: "Gemini Pro Year",
      slug: "gemini-pro-year",
      apiFamily: "GEMINI",
      tier: "Pro",
      priceVnd: 2099000,
      credits: BigInt(120_000_000),
      durationDays: 365,
    },
    {
      name: "Gemini Max 6M",
      slug: "gemini-max-6m",
      apiFamily: "GEMINI",
      tier: "Max",
      priceVnd: 1399000,
      credits: BigInt(90_000_000),
      durationDays: 180,
    },
    {
      name: "Gemini Max Year",
      slug: "gemini-max-year",
      apiFamily: "GEMINI",
      tier: "Max",
      priceVnd: 2599000,
      credits: BigInt(180_000_000),
      durationDays: 365,
    },
    {
      name: "Gemini Ultra Year",
      slug: "gemini-ultra-year",
      apiFamily: "GEMINI",
      tier: "Ultra",
      priceVnd: 3499000,
      credits: BigInt(250_000_000),
      durationDays: 365,
    },

    // DeepSeek thường
    {
      name: "DeepSeek Trial",
      slug: "deepseek-trial",
      apiFamily: "DEEPSEEK",
      credits: BigInt(1_000_000),
      durationDays: 7,
      priceVnd: 19_000,
    },
    {
      name: "DeepSeek Mini",
      slug: "deepseek-mini",
      apiFamily: "DEEPSEEK",
      credits: BigInt(5_000_000),
      durationDays: 30,
      priceVnd: 79_000,
      isPopular: true,
    },
    {
      name: "DeepSeek Plus",
      slug: "deepseek-plus",
      apiFamily: "DEEPSEEK",
      credits: BigInt(10_000_000),
      durationDays: 60,
      priceVnd: 139_000,
    },
    {
      name: "DeepSeek Pro",
      slug: "deepseek-pro",
      apiFamily: "DEEPSEEK",
      credits: BigInt(30_000_000),
      durationDays: 90,
      priceVnd: 399_000,
    },
    {
      name: "DeepSeek Max",
      slug: "deepseek-max",
      apiFamily: "DEEPSEEK",
      credits: BigInt(100_000_000),
      durationDays: 180,
      priceVnd: 1_299_000,
    },
    {
      name: "DeepSeek Ultra",
      slug: "deepseek-ultra",
      apiFamily: "DEEPSEEK",
      credits: BigInt(300_000_000),
      durationDays: 365,
      priceVnd: 3_699_000,
    },

    // DeepSeek long-term
    {
      name: "DeepSeek Plus 3M",
      slug: "deepseek-plus-3m",
      apiFamily: "DEEPSEEK",
      tier: "Plus",
      priceVnd: 396000,
      credits: BigInt(30_000_000),
      durationDays: 90,
    },
    {
      name: "DeepSeek Plus 6M",
      slug: "deepseek-plus-6m",
      apiFamily: "DEEPSEEK",
      tier: "Plus",
      priceVnd: 751000,
      credits: BigInt(60_000_000),
      durationDays: 180,
    },
    {
      name: "DeepSeek Plus Year",
      slug: "deepseek-plus-year",
      apiFamily: "DEEPSEEK",
      tier: "Plus",
      priceVnd: 1418000,
      credits: BigInt(120_000_000),
      durationDays: 365,
    },
    {
      name: "DeepSeek Pro 3M",
      slug: "deepseek-pro-3m",
      apiFamily: "DEEPSEEK",
      tier: "Pro",
      priceVnd: 568000,
      credits: BigInt(45_000_000),
      durationDays: 90,
    },
    {
      name: "DeepSeek Pro 6M",
      slug: "deepseek-pro-6m",
      apiFamily: "DEEPSEEK",
      tier: "Pro",
      priceVnd: 1077000,
      credits: BigInt(90_000_000),
      durationDays: 180,
    },
    {
      name: "DeepSeek Pro Year",
      slug: "deepseek-pro-year",
      apiFamily: "DEEPSEEK",
      tier: "Pro",
      priceVnd: 2035000,
      credits: BigInt(180_000_000),
      durationDays: 365,
    },
    {
      name: "DeepSeek Max 6M",
      slug: "deepseek-max-6m",
      apiFamily: "DEEPSEEK",
      tier: "Max",
      priceVnd: 2468000,
      credits: BigInt(200_000_000),
      durationDays: 180,
    },
    {
      name: "DeepSeek Max Year",
      slug: "deepseek-max-year",
      apiFamily: "DEEPSEEK",
      tier: "Max",
      priceVnd: 4676000,
      credits: BigInt(400_000_000),
      durationDays: 365,
    },
    {
      name: "DeepSeek Ultra Year",
      slug: "deepseek-ultra-year",
      apiFamily: "DEEPSEEK",
      tier: "Ultra",
      priceVnd: 7028000,
      credits: BigInt(600_000_000),
      durationDays: 365,
    },
  ];

  for (const product of products) {
    const tier = (product as any).tier ?? getTierFromSlug(product.slug);
    const apiKeyLimit = apiKeyLimitByTier[tier] ?? 1;

    const allowedModels = getModelsForPlanTier(product.apiFamily, tier);

    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        name: product.name,
        apiFamily: product.apiFamily as any,
        tier,
        priceVnd: product.priceVnd,
        credits: product.credits,
        durationDays: product.durationDays,
        apiKeyLimit,
        allowedModels,
        allowedReasoning: [],
        isPopular: product.isPopular ?? false,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        apiFamily: product.apiFamily as any,
        tier,
        priceVnd: product.priceVnd,
        credits: product.credits,
        durationDays: product.durationDays,
        apiKeyLimit,
        allowedModels,
        allowedReasoning: [],
        isPopular: product.isPopular ?? false,
        isActive: true,
      },
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