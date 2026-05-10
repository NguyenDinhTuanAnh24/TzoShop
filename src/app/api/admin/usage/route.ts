import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: { message: "Không có quyền truy cập." } },
        { status: 403 }
      );
    }

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
    console.error("GET /api/admin/usage failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải lịch sử sử dụng." },
      { status: 500 }
    );
  }
}
