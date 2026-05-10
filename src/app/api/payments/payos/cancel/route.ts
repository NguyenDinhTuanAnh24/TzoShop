import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayOSClient } from "@/lib/server/payos";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Thiếu mã đơn hàng." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng." },
        { status: 404 }
      );
    }

    if (order.status === "PAID") {
      return NextResponse.json(
        { error: "Đơn hàng đã thanh toán, không thể hủy." },
        { status: 400 }
      );
    }

    if (order.status === "CANCELLED") {
      return NextResponse.json({
        success: true,
        status: "CANCELLED",
      });
    }

    // Nếu chưa có mã thanh toán PayOS thì chỉ cần hủy đơn trong DB
    if (!order.payosOrderCode) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          payosStatus: "CANCELLED",
        },
      });

      return NextResponse.json({
        success: true,
        status: "CANCELLED",
      });
    }

    const payos = getPayOSClient();

    // Hủy link thanh toán trên PayOS
    const cancelledPayment = await (payos as any).paymentRequests.cancel(
      Number(order.payosOrderCode),
      "User cancelled payment"
    );

    // Cập nhật trạng thái đơn hàng thành CANCELLED
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        payosStatus: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      status: cancelledPayment.status ?? "CANCELLED",
    });
  } catch (error) {
    console.error("PayOS Cancel Error:", error);

    return NextResponse.json(
      { error: "Không thể hủy thanh toán." },
      { status: 500 }
    );
  }
}
