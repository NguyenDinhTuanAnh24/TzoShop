import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAdminUser();

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
            apiKeys: true,
            creditBuckets: true,
            usageLogs: true,
            supportTickets: true,
          }
        },
        creditBuckets: {
          include: {
            product: {
              select: {
                name: true,
                tier: true,
              }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        apiKeys: {
          orderBy: { createdAt: "desc" }
        },
        orders: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: "Không tìm thấy người dùng." } },
        { status: 404 }
      );
    }

    // Mask API Keys for security
    const data = {
      ...user,
      apiKeys: user.apiKeys.map(key => ({
        ...key,
        // Chỉ hiển thị prefix, che phần còn lại
        displayKey: `${key.keyPrefix}********************`,
        encryptedKey: undefined, // Không bao giờ gửi về client
        keyHash: undefined
      })),
      // Convert BigInt to String
      creditBuckets: user.creditBuckets.map(bucket => ({
        ...bucket,
        creditsTotal: bucket.creditsTotal.toString(),
        creditsRemaining: bucket.creditsRemaining.toString(),
      }))
    };

    const { createAuditLog } = await import("@/lib/server/audit-log");
    await createAuditLog({
      action: "ADMIN_VIEW_USER_DETAIL",
      entityType: "USER",
      entityId: user.id,
      metadata: { email: user.email }
    });

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error(`GET /api/admin/users/${id} failed:`, error);
    return NextResponse.json(
      { error: { message: "Lỗi hệ thống." } },
      { status: 500 }
    );
  }
}
