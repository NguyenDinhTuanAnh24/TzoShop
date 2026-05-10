import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";

export const runtime = "nodejs";

// Lấy danh sách support ticket
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
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;

    const tickets = await prisma.supportTicket.findMany({
      where: {
        status: status as any,
        priority: priority as any,
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
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error("GET /api/admin/support failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải ticket." },
      { status: 500 }
    );
  }
}

// Cập nhật trạng thái ticket
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
    const { ticketId, status, adminNotes } = body;

    if (!ticketId) {
      return NextResponse.json(
        { error: { message: "Thiếu mã ticket." } },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedTicket
    });

  } catch (error) {
    console.error("PATCH /api/admin/support failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật ticket." },
      { status: 500 }
    );
  }
}
