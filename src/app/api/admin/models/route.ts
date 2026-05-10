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

    const models = await prisma.aiModel.findMany({
      orderBy: {
        publicName: "asc",
      }
    });

    return NextResponse.json({
      success: true,
      data: models
    });

  } catch (error) {
    console.error("GET /api/admin/models failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải danh sách models." },
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
    const { publicName, upstreamName, apiFamily, inputCreditMultiplier, outputCreditMultiplier, isActive } = body;

    const newModel = await prisma.aiModel.create({
      data: {
        publicName,
        upstreamName,
        apiFamily,
        inputCreditMultiplier: parseFloat(inputCreditMultiplier),
        outputCreditMultiplier: parseFloat(outputCreditMultiplier),
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json({
      success: true,
      data: newModel
    });

  } catch (error) {
    console.error("POST /api/admin/models failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tạo model." },
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

    if (data.inputCreditMultiplier) data.inputCreditMultiplier = parseFloat(data.inputCreditMultiplier);
    if (data.outputCreditMultiplier) data.outputCreditMultiplier = parseFloat(data.outputCreditMultiplier);

    const updatedModel = await prisma.aiModel.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      data: updatedModel
    });

  } catch (error) {
    console.error("PATCH /api/admin/models failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật model." },
      { status: 500 }
    );
  }
}
