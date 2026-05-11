import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdminUser();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;

    const orders = await prisma.order.findMany({
      where: {
        status: status as any,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        product: {
          select: {
            name: true,
            apiFamily: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: orders
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
    console.error("GET /api/admin/orders failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải danh sách đơn hàng." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdminUser();

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: { message: "Thiếu thông tin cập nhật." } },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    const { createAuditLog } = await import("@/lib/server/audit-log");
    await createAuditLog({
      action: "UPDATE",
      entityType: "ORDER",
      entityId: updatedOrder.id,
      metadata: { status }
    });

    return NextResponse.json({
      success: true,
      data: updatedOrder
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
    console.error("PATCH /api/admin/orders failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật đơn hàng." },
      { status: 500 }
    );
  }
}
