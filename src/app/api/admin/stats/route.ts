import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireAdminUser();

    const [
      userCount,
      paidOrdersData,
      pendingOrders,
      paidOrdersCount,
      apiKeysCount,
      creditLedgers,
      openTicketsCount,
      activeModelsCount,
      activeProvidersCount
    ] = await Promise.all([
      prisma.user.count({
        where: { role: "USER" }
      }),
      prisma.order.findMany({
        where: { status: "PAID" },
        select: { amountVnd: true }
      }),
      prisma.order.count({
        where: { status: "PENDING" }
      }),
      prisma.order.count({
        where: { status: "PAID" }
      }),
      prisma.apiKey.count(),
      prisma.creditLedger.findMany({
        where: { type: "PURCHASE" },
        select: { amount: true }
      }),
      prisma.supportTicket.count({
        where: { status: { not: "CLOSED" } }
      }),
      prisma.aiModel.count({
        where: { isActive: true }
      }),
      // @ts-ignore - Bỏ qua lỗi cache IDE
      prisma.aiProvider.count({
        where: { isActive: true }
      })
    ]);

    const totalRevenue = paidOrdersData.reduce((sum: number, order: { amountVnd: number }) => sum + order.amountVnd, 0);
    const totalCreditsSold = creditLedgers.reduce((sum: bigint, ledger: { amount: bigint }) => sum + ledger.amount, BigInt(0));

    return NextResponse.json({
      success: true,
      data: {
        users: userCount,
        revenue: totalRevenue,
        pendingOrders: pendingOrders,
        paidOrdersCount: paidOrdersCount,
        creditsSold: totalCreditsSold.toString(),
        apiKeysCount: apiKeysCount,
        openTickets: openTicketsCount,
        activeModels: activeModelsCount,
        activeProviders: activeProvidersCount,
      }
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
    console.error("GET /api/admin/stats failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải thống kê." },
      { status: 500 }
    );
  }
}

