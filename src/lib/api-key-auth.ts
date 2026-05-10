import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function findActiveApiKeyByPlainTextKey(plainTextKey: string) {
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      isActive: true,
    },
    include: {
      creditBucket: true,
      user: true,
    },
  });

  for (const apiKey of apiKeys) {
    const matched = await bcrypt.compare(plainTextKey, apiKey.keyHash);

    if (matched) {
      return apiKey;
    }
  }

  return null;
}
