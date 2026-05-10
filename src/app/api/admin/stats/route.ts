import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getServerUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: { message: "Không có quyền truy cập." } },
        { status: 403 }
      );
    }

    const [
      userCount,
      paidOrders,
      pendingOrders,
      usageLogs,
      supportTickets,
      creditLedgers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.findMany({
        where: { status: "PAID" },
        select: { amountVnd: true }
      }),
      prisma.order.count({
        where: { status: "PENDING" }
      }),
      prisma.usageLog.count(),
      prisma.supportTicket.count({
        where: { status: "OPEN" }
      }),
      prisma.creditLedger.findMany({
        where: { type: "PURCHASE" },
        select: { amount: true }
      })
    ]);

    const totalRevenue = paidOrders.reduce((sum: number, order: { amountVnd: number }) => sum + order.amountVnd, 0);
    const totalCreditsSold = creditLedgers.reduce((sum: bigint, ledger: { amount: bigint }) => sum + ledger.amount, BigInt(0));

    return NextResponse.json({
      success: true,
      data: {
        users: userCount,
        revenue: totalRevenue,
        pendingOrders: pendingOrders,
        totalUsage: usageLogs,
        creditsSold: totalCreditsSold.toString(),
        openTickets: supportTickets,
      }
    });

  } catch (error) {
    console.error("GET /api/admin/stats failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải thống kê." },
      { status: 500 }
    );
  }
}
