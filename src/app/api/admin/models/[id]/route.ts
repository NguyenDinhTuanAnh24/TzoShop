import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: { message: "Thiếu ID." } }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.publicName !== undefined) updateData.publicName = body.publicName;
    if (body.upstreamModel !== undefined) updateData.upstreamModel = body.upstreamModel;
    if (body.apiFamily !== undefined) updateData.apiFamily = body.apiFamily;
    if (body.providerId !== undefined) updateData.providerId = body.providerId;
    if (body.inputCreditRate !== undefined) updateData.inputCreditRate = Number(body.inputCreditRate);
    if (body.outputCreditRate !== undefined) updateData.outputCreditRate = Number(body.outputCreditRate);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    if (updateData.publicName) {
      const existing = await prisma.aiModel.findFirst({
        where: {
          publicName: updateData.publicName,
          id: { not: id }
        }
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "Tên publicName đã tồn tại." },
          { status: 400 }
        );
      }
    }

    const updatedModel = await prisma.aiModel.update({
      where: { id },
      data: updateData,
      include: {
        provider: { select: { name: true } }
      }
    });

    const { createAuditLog } = await import("@/lib/server/audit-log");
    await createAuditLog({
      action: "ADMIN_UPDATE_MODEL",
      entityType: "MODEL",
      entityId: updatedModel.id,
      metadata: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedModel
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: { message: "Vui lòng đăng nhập để tiếp tục." } }, { status: 401 });
      }
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: { message: "Không có quyền truy cập." } }, { status: 403 });
      }
    }
    console.error("PATCH /api/admin/models/[id] failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật model." },
      { status: 500 }
    );
  }
}
