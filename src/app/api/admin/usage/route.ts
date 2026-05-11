import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdminUser();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || undefined;
    const apiFamily = searchParams.get("apiFamily") || undefined;

    const usageLogs = await prisma.usageLog.findMany({
      where: {
        userId: userId,
        apiFamily: apiFamily as any,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Lấy 100 log gần nhất
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        apiKey: {
          select: {
            name: true,
            keyPrefix: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: usageLogs
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
    console.error("GET /api/admin/usage failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải lịch sử sử dụng." },
      { status: 500 }
    );
  }
}
