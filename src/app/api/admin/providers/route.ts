import { NextRequest, NextResponse } from "next/server";
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

    const providers = await prisma.providerKey.findMany({
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json({
      success: true,
      data: providers
    });

  } catch (error) {
    console.error("GET /api/admin/providers failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải danh sách providers." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: { message: "Không có quyền truy cập." } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, apiFamily, encryptedKey, baseUrl, status, priority } = body;

    const newProvider = await prisma.providerKey.create({
      data: {
        name,
        apiFamily,
        encryptedKey,
        baseUrl,
        status: status || "ACTIVE",
        priority: parseInt(priority) || 1,
      }
    });

    return NextResponse.json({
      success: true,
      data: newProvider
    });

  } catch (error) {
    console.error("POST /api/admin/providers failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tạo provider." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: { message: "Không có quyền truy cập." } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (data.priority) data.priority = parseInt(data.priority);

    const updatedProvider = await prisma.providerKey.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      data: updatedProvider
    });

  } catch (error) {
    console.error("PATCH /api/admin/providers failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật provider." },
      { status: 500 }
    );
  }
}
