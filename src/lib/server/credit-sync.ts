import { decryptText } from "@/lib/crypto";
import { getNewApiTokenByKey } from "@/lib/newapi";

type ActiveKeyInput = {
  encryptedKey: string | null;
  isActive: boolean;
};

export type SyncedCredits = {
  creditsRemainingSynced: number;
  creditsUsedSynced: number;
  creditsTotalSynced: number;
  creditsSource: "NEWAPI" | "DB";
  syncedTokenCount: number;
};

export async function syncCreditsFromNewApi(params: {
  activeKeys: ActiveKeyInput[];
  dbCreditsTotal: number;
  dbCreditsRemaining: number;
}): Promise<SyncedCredits> {
  const { activeKeys, dbCreditsRemaining, dbCreditsTotal } = params;
  const keys = activeKeys.filter((k) => k.isActive && !!k.encryptedKey);
  if (keys.length === 0) {
    return {
      creditsRemainingSynced: dbCreditsRemaining,
      creditsUsedSynced: Math.max(dbCreditsTotal - dbCreditsRemaining, 0),
      creditsTotalSynced: dbCreditsTotal,
      creditsSource: "DB",
      syncedTokenCount: 0,
    };
  }

  let totalRemain = 0;
  let totalUsed = 0;
  let syncedTokenCount = 0;

  for (const k of keys) {
    try {
      const fullKey = decryptText(k.encryptedKey as string);
      const token = await getNewApiTokenByKey(fullKey);
      if (!token) continue;
      totalRemain += Number(token.remainQuota || 0);
      totalUsed += Number(token.usedQuota || 0);
      syncedTokenCount++;
    } catch {
      // Ignore token-level sync error and continue with other active keys.
    }
  }

  if (syncedTokenCount === 0) {
    return {
      creditsRemainingSynced: dbCreditsRemaining,
      creditsUsedSynced: Math.max(dbCreditsTotal - dbCreditsRemaining, 0),
      creditsTotalSynced: dbCreditsTotal,
      creditsSource: "DB",
      syncedTokenCount: 0,
    };
  }

  const total = totalRemain + totalUsed;
  return {
    creditsRemainingSynced: totalRemain,
    creditsUsedSynced: totalUsed,
    creditsTotalSynced: total > 0 ? total : dbCreditsTotal,
    creditsSource: "NEWAPI",
    syncedTokenCount,
  };
}
