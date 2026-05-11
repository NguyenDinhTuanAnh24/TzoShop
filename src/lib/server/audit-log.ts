import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/current-user";

type AuditLogParams = {
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
};

export async function createAuditLog({ action, entityType, entityId, metadata }: AuditLogParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    await prisma.auditLog.create({
      data: {
        adminUserId: user.id,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      }
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}
