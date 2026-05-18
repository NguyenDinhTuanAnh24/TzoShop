import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const CODEX_TRIAL_MINI_MODELS = [
  "GPT-5.3-Codex",
  "GPT-5.1-Codex",
  "GPT-5-Codex",
];

const CODEX_PLUS_MODELS = [
  ...CODEX_TRIAL_MINI_MODELS,
  "GPT-5.4-Mini",
  "GPT-5.1",
  "GPT-5-Mini",
];

const CODEX_PRO_MODELS = [
  ...CODEX_PLUS_MODELS,
  "GPT-5.5",
  "GPT-5.4",
  "GPT-5.2",
  "GPT-5",
];

const CODEX_MAX_MODELS = [
  ...CODEX_PRO_MODELS,
  "GPT-5.4-Pro",
  "GPT-5-Pro",
];

const CODEX_ULTRA_MODELS = [
  ...CODEX_MAX_MODELS,
  "GPT-5-Pro",
];

function normalize(value?: string | null) {
  return (value ?? "").toLowerCase().trim();
}

function detectCodexTier(product: {
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

function getAllowedModelsByTier(tier: string) {
  switch (tier) {
    case "trial":
    case "mini":
      return CODEX_TRIAL_MINI_MODELS;

    case "plus":
      return CODEX_PLUS_MODELS;

    case "pro":
      return CODEX_PRO_MODELS;

    case "max":
      return CODEX_MAX_MODELS;

    case "ultra":
    case "enterprise":
      return CODEX_ULTRA_MODELS;

    default:
      return [];
  }
}

async function main() {
  const products = await prisma.product.findMany({
    where: {
      apiFamily: "CODEXAI",
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
    console.log("KhĂ´ng tĂ¬m tháº¥y gĂ³i CodexAI nĂ o.");
    return;
  }

  let updatedCount = 0;
  const skipped: string[] = [];

  for (const product of products) {
    const tier = detectCodexTier(product);

    if (!tier) {
      skipped.push(product.name);
      continue;
    }

    const allowedModels = getAllowedModelsByTier(tier);

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
      `ÄĂ£ cáº­p nháº­t ${product.name} (${tier}) â†’ ${allowedModels.length} models`
    );
  }

  console.log("");
  console.log(`HoĂ n táº¥t. ÄĂ£ cáº­p nháº­t ${updatedCount}/${products.length} gĂ³i CodexAI.`);

  if (skipped.length > 0) {
    console.log("");
    console.log("CĂ¡c gĂ³i bá»‹ bá» qua vĂ¬ khĂ´ng nháº­n diá»‡n Ä‘Æ°á»£c tier:");
    for (const name of skipped) {
      console.log(`- ${name}`);
    }
  }
}

main()
  .catch((error) => {
    console.error("Lá»—i khi cáº­p nháº­t allowedModels:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
  });

