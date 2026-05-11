import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireCurrentUser();

    const buckets = await prisma.creditBucket.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            apiFamily: true,
            tier: true,
            credits: true,
            durationDays: true,
            priceVnd: true,
            apiKeyLimit: true,
            allowedModels: true,
          },
        },
        apiKeys: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
          },
        },
      },
    });

    type BucketItem = (typeof buckets)[number];

    const data = buckets.map((bucket: BucketItem) => {
      const usedCredits = bucket.creditsTotal - bucket.creditsRemaining;

      return {
        id: bucket.id,
        apiFamily: bucket.apiFamily,
        creditsTotal: bucket.creditsTotal.toString(),
        creditsRemaining: bucket.creditsRemaining.toString(),
        usedCredits: usedCredits.toString(),
        apiKeyLimit: bucket.apiKeyLimit,
        activeApiKeys: bucket.apiKeys.length,
        allowedModels: bucket.allowedModels,
        allowedReasoning: bucket.allowedReasoning,
        startsAt: bucket.startsAt,
        expiresAt: bucket.expiresAt,
        isActive: bucket.isActive,
        createdAt: bucket.createdAt,
        product: bucket.product
          ? {
              ...bucket.product,
              credits: bucket.product.credits.toString(),
            }
          : null,
      };
    });

    return NextResponse.json({
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: { message: "Vui lòng đăng nhập để tiếp tục." } }, { status: 401 });
      }
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: { message: "Không có quyền truy cập." } }, { status: 403 });
      }
    }
    console.error("GET /api/my-plans failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể tải gói credits của bạn.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
