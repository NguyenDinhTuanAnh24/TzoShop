import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await requireCurrentUser();

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
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
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: {
            message: "Không tìm thấy đơn hàng.",
          },
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      data: {
        id: order.id,
        orderCode: order.orderCode,
        status: order.status,
        amountVnd: order.amountVnd,
        paidAt: order.paidAt,
        cancelledAt: order.cancelledAt,
        expiredAt: order.expiredAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        product: {
          ...order.product,
          credits: order.product.credits.toString(),
        },
      },
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
    console.error("GET /api/orders/[id] failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể tải chi tiết đơn hàng.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
