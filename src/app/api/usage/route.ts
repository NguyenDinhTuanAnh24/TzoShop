import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getServerUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: "Vui lòng đăng nhập để tiếp tục." } },
        { status: 401 }
      );
    }

    const usageLogs = await prisma.usageLog.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        apiKey: {
          select: {
            id: true,
            name: true,
            keyPrefix: true,
            apiFamily: true,
          },
        },
        creditBucket: {
          select: {
            id: true,
            creditsTotal: true,
            creditsRemaining: true,
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                tier: true,
              },
            },
          },
        },
      },
    });

    type UsageItem = (typeof usageLogs)[number];

    const data = usageLogs.map((log: UsageItem) => ({
      id: log.id,
      apiFamily: log.apiFamily,
      model: log.model,
      endpoint: log.endpoint,
      inputTokens: log.inputTokens,
      outputTokens: log.outputTokens,
      cachedTokens: log.cachedTokens,
      totalTokens: log.totalTokens,
      creditsCharged: log.creditsCharged.toString(),
      status: log.status,
      errorMessage: log.errorMessage,
      createdAt: log.createdAt,
      apiKey: log.apiKey,
      creditBucket: log.creditBucket
        ? {
            ...log.creditBucket,
            creditsTotal: log.creditBucket.creditsTotal.toString(),
            creditsRemaining: log.creditBucket.creditsRemaining.toString(),
          }
        : null,
    }));

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("GET /api/usage failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể tải lịch sử sử dụng.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
