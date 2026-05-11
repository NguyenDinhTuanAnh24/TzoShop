import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const CODEX_TRIAL_MINI_MODELS = [
  "codexai/gpt-5.3-codex",
  "codexai/gpt-5.1-codex",
  "codexai/gpt-5-codex",
];

const CODEX_PLUS_MODELS = [
  ...CODEX_TRIAL_MINI_MODELS,
  "codexai/gpt-5.4-mini",
  "codexai/gpt-5.1",
  "codexai/gpt-5-mini",
];

const CODEX_PRO_MODELS = [
  ...CODEX_PLUS_MODELS,
  "codexai/gpt-5.5",
  "codexai/gpt-5.4",
  "codexai/gpt-5.2",
  "codexai/gpt-5",
];

const CODEX_MAX_MODELS = [
  ...CODEX_PRO_MODELS,
  "codexai/gpt-5.4-pro",
  "codexai/gpt-5.2-pro",
  "codexai/gpt-5-pro",
];

const CODEX_ULTRA_MODELS = [
  ...CODEX_MAX_MODELS,
  "codexai/gpt-5.5-pro",
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
    console.log("Không tìm thấy gói CodexAI nào.");
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
      `Đã cập nhật ${product.name} (${tier}) → ${allowedModels.length} models`
    );
  }

  console.log("");
  console.log(`Hoàn tất. Đã cập nhật ${updatedCount}/${products.length} gói CodexAI.`);

  if (skipped.length > 0) {
    console.log("");
    console.log("Các gói bị bỏ qua vì không nhận diện được tier:");
    for (const name of skipped) {
      console.log(`- ${name}`);
    }
  }
}

main()
  .catch((error) => {
    console.error("Lỗi khi cập nhật allowedModels:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
  });
