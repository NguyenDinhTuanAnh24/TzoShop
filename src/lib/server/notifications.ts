import { prisma } from "@/lib/prisma";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}) {
  try {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        href: data.href,
        metadata: data.metadata,
      },
    });
  } catch (error) {
    console.error(`[Notification] Failed to create for user ${data.userId}:`, error instanceof Error ? error.message : error);
  }
}

export async function createAdminNotification(data: {
  type: string;
  title: string;
  message: string;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}) {
  try {
    return await prisma.notification.create({
      data: {
        roleTarget: "ADMIN",
        type: data.type,
        title: data.title,
        message: data.message,
        href: data.href,
        metadata: data.metadata,
      },
    });
  } catch (error) {
    console.error(`[Notification] Failed to create admin notification:`, error instanceof Error ? error.message : error);
  }
}

export async function markNotificationAsRead(id: string, userId: string, isAdmin: boolean) {
  try {
    const where: Record<string, unknown> = { id };
    
    // Nếu không phải admin, chỉ được mark read notification của chính mình
    if (!isAdmin) {
      where.userId = userId;
    } else {
      // Nếu là admin, được mark read notification của mình HOẶC roleTarget là ADMIN
      where.OR = [
        { userId: userId },
        { roleTarget: "ADMIN" }
      ];
    }

    return await prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`[Notification] Failed to mark read ${id}:`, error);
  }
}

export async function markAllNotificationsAsRead(userId: string, isAdmin: boolean) {
  try {
    const where: Record<string, unknown> = {};
    
    if (isAdmin) {
      where.OR = [
        { userId: userId },
        { roleTarget: "ADMIN" }
      ];
    } else {
      where.userId = userId;
    }
    
    where.isRead = false;

    return await prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`[Notification] Failed to mark all read for user ${userId}:`, error);
  }
}
