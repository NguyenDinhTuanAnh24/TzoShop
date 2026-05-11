import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const CLAUDE_TRIAL_MODELS = [
  "claude/claude-haiku-4.5",
];

const CLAUDE_MINI_MODELS = [
  ...CLAUDE_TRIAL_MODELS,
  "claude/claude-sonnet-4.5",
];

const CLAUDE_PLUS_MODELS = [
  ...CLAUDE_MINI_MODELS,
  "claude/claude-sonnet-4.6",
];

const CLAUDE_PRO_MODELS = [
  ...CLAUDE_PLUS_MODELS,
  "claude/claude-opus-4.5",
];

const CLAUDE_MAX_MODELS = [
  ...CLAUDE_PRO_MODELS,
  "claude/claude-opus-4.6",
];

const CLAUDE_ULTRA_MODELS = [
  ...CLAUDE_MAX_MODELS,
  "claude/claude-opus-4.7",
];

const GEMINI_TRIAL_MODELS = [
  "gemini/gemini-3.1-flash-lite-preview",
];

const GEMINI_MINI_MODELS = [
  ...GEMINI_TRIAL_MODELS,
  "gemini/gemini-3-flash-preview",
];

const GEMINI_PLUS_MODELS = [
  ...GEMINI_MINI_MODELS,
  "gemini/gemini-2.5-pro",
];

const GEMINI_PRO_MODELS = [
  ...GEMINI_PLUS_MODELS,
  "gemini/gemini-3.1-pro-preview",
];

const DEEPSEEK_TRIAL_MINI_MODELS = [
  "deepseek/deepseek-v4-flash",
];

const DEEPSEEK_PLUS_AND_UP_MODELS = [
  "deepseek/deepseek-v4-flash",
  "deepseek/deepseek-v4-pro",
];

type ApiFamily = "CLAUDE" | "GEMINI" | "DEEPSEEK";

function normalize(value?: string | null) {
  return (value ?? "").toLowerCase().trim();
}

function detectTier(product: {
  name: string;
  slug?: string | null;
  tier?: string | null;
}) {
  const text = [
    normalize(product.name),
    normalize(product.slug),
    normalize(product.tier),
  ].join(" ");

  if (text.includes("enterprise")) return "enterprise";
  if (text.includes("ultra")) return "ultra";
  if (text.includes("max")) return "max";
  if (text.includes("pro")) return "pro";
  if (text.includes("plus")) return "plus";
  if (text.includes("mini")) return "mini";
  if (text.includes("trial")) return "trial";

  return null;
}

function getAllowedModels(apiFamily: ApiFamily, tier: string) {
  if (apiFamily === "CLAUDE") {
    switch (tier) {
      case "trial":
        return CLAUDE_TRIAL_MODELS;
      case "mini":
        return CLAUDE_MINI_MODELS;
      case "plus":
        return CLAUDE_PLUS_MODELS;
      case "pro":
        return CLAUDE_PRO_MODELS;
      case "max":
        return CLAUDE_MAX_MODELS;
      case "ultra":
      case "enterprise":
        return CLAUDE_ULTRA_MODELS;
      default:
        return [];
    }
  }

  if (apiFamily === "GEMINI") {
    switch (tier) {
      case "trial":
        return GEMINI_TRIAL_MODELS;
      case "mini":
        return GEMINI_MINI_MODELS;
      case "plus":
        return GEMINI_PLUS_MODELS;
      case "pro":
      case "max":
      case "ultra":
      case "enterprise":
        return GEMINI_PRO_MODELS;
      default:
        return [];
    }
  }

  if (apiFamily === "DEEPSEEK") {
    switch (tier) {
      case "trial":
      case "mini":
        return DEEPSEEK_TRIAL_MINI_MODELS;
      case "plus":
      case "pro":
      case "max":
      case "ultra":
      case "enterprise":
        return DEEPSEEK_PLUS_AND_UP_MODELS;
      default:
        return [];
    }
  }

  return [];
}

async function updateFamily(apiFamily: ApiFamily) {
  const products = await prisma.product.findMany({
    where: {
      apiFamily,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      tier: true,
      allowedModels: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (products.length === 0) {
    console.log(`Không tìm thấy gói ${apiFamily}.`);
    return;
  }

  let updatedCount = 0;
  const skipped: string[] = [];

  for (const product of products) {
    const tier = detectTier(product);

    if (!tier) {
      skipped.push(product.name);
      continue;
    }

    const allowedModels = getAllowedModels(apiFamily, tier);

    if (allowedModels.length === 0) {
      skipped.push(product.name);
      continue;
    }

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        allowedModels,
      },
    });

    updatedCount++;

    console.log(
      `Đã cập nhật ${product.name} (${apiFamily}/${tier}) → ${allowedModels.length} models`
    );
  }

  console.log("");
  console.log(`Hoàn tất ${apiFamily}: ${updatedCount}/${products.length} gói.`);

  if (skipped.length > 0) {
    console.log(`Các gói ${apiFamily} bị bỏ qua:`);
    for (const name of skipped) {
      console.log(`- ${name}`);
    }
    console.log("");
  }
}

async function main() {
  await updateFamily("CLAUDE");
  await updateFamily("GEMINI");
  await updateFamily("DEEPSEEK");

  console.log("Đã cập nhật xong allowedModels cho Claude, Gemini, DeepSeek.");
}

main()
  .catch((error) => {
    console.error("Lỗi khi cập nhật allowedModels:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
  });
