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

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            apiKeys: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error("GET /api/admin/users failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải danh sách người dùng." },
      { status: 500 }
    );
  }
}
