import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";
import { completePaidOrder } from "@/lib/payment-helper";

export const runtime = "nodejs";



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getServerUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: "Vui lòng đăng nhập để tiếp tục." } },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        product: true,
        user: true,
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

    if (order.status === "PAID") {
      return NextResponse.json({
        data: {
          message: "Đơn hàng đã được thanh toán trước đó.",
          order: {
            id: order.id,
            orderCode: order.orderCode,
            status: order.status,
            paidAt: order.paidAt,
          },
        },
      });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        {
          error: {
            message: "Đơn hàng không ở trạng thái chờ thanh toán.",
          },
        },
        {
          status: 400,
        },
      );
    }

    const result = await completePaidOrder(order.id);

    return NextResponse.json({
      data: {
        order: {
          id: result.order.id,
          orderCode: result.order.orderCode,
          status: result.order.status,
          paidAt: result.order.paidAt,
        },
      },
    });
  } catch (error) {
    console.error("POST /api/orders/[id]/mock-pay failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể xử lý thanh toán giả lập.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
