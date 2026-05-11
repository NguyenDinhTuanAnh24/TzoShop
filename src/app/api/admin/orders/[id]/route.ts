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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        product: true,
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: { message: "Không tìm thấy đơn hàng." } },
        { status: 404 }
      );
    }

    // Convert BigInt to String
    const data = {
      ...order,
      payosOrderCode: order.payosOrderCode?.toString(),
    };

    const { createAuditLog } = await import("@/lib/server/audit-log");
    await createAuditLog({
      action: "ADMIN_VIEW_ORDER_DETAIL",
      entityType: "ORDER",
      entityId: order.id,
      metadata: { orderCode: order.orderCode }
    });

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error(`GET /api/admin/orders/${id} failed:`, error);
    return NextResponse.json(
      { error: { message: "Lỗi hệ thống." } },
      { status: 500 }
    );
  }
}
