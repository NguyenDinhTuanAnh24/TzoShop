import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";

export const runtime = "nodejs";

function createOrderCode() {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function GET() {
  try {
    const user = await getServerUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: "Vui lòng đăng nhập để tiếp tục." } },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
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
      },
    });

    type OrderItem = (typeof orders)[number];

    const data = orders.map((order: OrderItem) => ({
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
    }));

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("GET /api/orders failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể tải danh sách đơn hàng.",
        },
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: "Vui lòng đăng nhập để tiếp tục." } },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId = body?.productId;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        {
          error: {
            message: "Thiếu productId.",
          },
        },
        {
          status: 400,
        },
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: {
            message: "Gói credits không tồn tại hoặc đã bị tắt.",
          },
        },
        {
          status: 404,
        },
      );
    }

    if (product.priceVnd === 0) {
      return NextResponse.json(
        {
          error: {
            message: "Gói này cần liên hệ tư vấn, chưa thể tạo đơn tự động.",
          },
        },
        {
          status: 400,
        },
      );
    }

    const order = await prisma.order.create({
      data: {
        orderCode: createOrderCode(),
        userId: user.id,
        productId: product.id,
        amountVnd: product.priceVnd,
        status: "PENDING",
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

    return NextResponse.json(
      {
        data: {
          id: order.id,
          orderCode: order.orderCode,
          status: order.status,
          amountVnd: order.amountVnd,
          paidAt: order.paidAt,
          createdAt: order.createdAt,
          product: {
            ...order.product,
            credits: order.product.credits.toString(),
          },
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/orders failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể tạo đơn hàng.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
