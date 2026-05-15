import { ApiFamily, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/server/current-user";
import { buildPagination, getPagination } from "@/lib/pagination";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip, take } = getPagination(searchParams);
    const search = searchParams.get("search")?.trim() || "";
    const where = search
      ? {
          OR: [
            { publicName: { contains: search, mode: "insensitive" as const } },
            { upstreamModel: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};
    const [total, models] = await Promise.all([
      prisma.aiModel.count({ where }),
      prisma.aiModel.findMany({
        where,
        include: {
          provider: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          publicName: "asc",
        },
        skip,
        take,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: models,
      items: models,
      pagination: buildPagination({ page, pageSize, total }),
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
    console.error("GET /api/admin/models failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải danh sách models." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();

    const body = await request.json();
    const { publicName, upstreamModel, apiFamily, providerId, inputCreditRate, outputCreditRate, isActive } = body;

    const existingModel = await prisma.aiModel.findUnique({
      where: { publicName }
    });

    if (existingModel) {
      return NextResponse.json(
        { success: false, message: "Tên publicName đã tồn tại." },
        { status: 400 }
      );
    }

    const createData: Prisma.AiModelCreateInput = {
      publicName,
      upstreamModel,
      apiFamily: apiFamily as ApiFamily,
      provider: {
        connect: { id: providerId }
      },
      inputCreditRate: Number(inputCreditRate) || 1,
      outputCreditRate: Number(outputCreditRate) || 1,
      isActive: isActive ?? true,
    };

    const type = (body.upstreamEndpointType === "RESPONSES" || body.upstreamEndpointType === "responses")
      ? "RESPONSES"
      : "CHAT_COMPLETIONS";
    
    (createData as Record<string, unknown>).upstreamEndpointType = type;

    const newModel = await prisma.aiModel.create({
      data: createData,
      include: {
        provider: { select: { name: true } }
      }
    });

    const { createAuditLog } = await import("@/lib/server/audit-log");
    await createAuditLog({
      action: "ADMIN_CREATE_MODEL",
      entityType: "MODEL",
      entityId: newModel.id,
      metadata: { publicName: newModel.publicName, apiFamily: newModel.apiFamily }
    });

    return NextResponse.json({
      success: true,
      data: newModel
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
    console.error("POST /api/admin/models failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tạo model." },
      { status: 500 }
    );
  }
}
