import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function findActiveApiKeyByPlainTextKey(plainTextKey: string) {
  const sha256Hash = crypto.createHash("sha256").update(plainTextKey).digest("hex");
  
  // High performance SHA-256 lookup
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: sha256Hash },
    include: { creditBucket: true, user: true },
  });

  if (apiKey && apiKey.isActive) {
    return apiKey;
  }

  // Legacy bcrypt fallback lookup
  const legacyApiKeys = await prisma.apiKey.findMany({
    where: { isActive: true },
    include: { creditBucket: true, user: true },
  });

  for (const key of legacyApiKeys) {
    if (key.keyHash.startsWith("$2")) {
      const matched = await bcrypt.compare(plainTextKey, key.keyHash);
      if (matched) return key;
    }
  }

  return null;
}
