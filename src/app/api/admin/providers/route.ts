import { ApiFamily } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/server/current-user";
import { buildPagination, getPagination } from "@/lib/pagination";
import { encryptText, decryptText } from "@/lib/crypto";

export const runtime = "nodejs";

function maskApiKey(key: string) {
  if (!key) return "";
  if (key.length <= 4) return "••••" + key;
  return "••••••••" + key.slice(-4);
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip, take } = getPagination(searchParams);
    const search = searchParams.get("search")?.trim() || "";
    const where = search
      ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { baseUrl: { contains: search, mode: "insensitive" as const } },
        ],
      }
      : {};
    const [total, providers] = await Promise.all([
      prisma.aiProvider.count({ where }),
      prisma.aiProvider.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      }),
    ]);

    const maskedProviders = providers.map(p => {
      let plainKey = "";
      try {
        plainKey = decryptText(p.encryptedApiKey);
      } catch {
        // Ignored
      }
      return {
        ...p,
        encryptedApiKey: maskApiKey(plainKey)
      };
    });

    return NextResponse.json({
      success: true,
      data: maskedProviders,
      items: maskedProviders,
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
    console.error("GET /api/admin/providers failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải danh sách providers." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();

    const body = await request.json();
    const { name, apiFamily, apiKey, baseUrl, isActive } = body;

    if (!name || !apiFamily || !apiKey || !baseUrl) {
      return NextResponse.json(
        { success: false, message: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 }
      );
    }

    const encryptedApiKey = encryptText(apiKey);

    const newProvider = await prisma.aiProvider.create({
      data: {
        name,
        apiFamily: apiFamily as ApiFamily,
        encryptedApiKey,
        baseUrl,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    const { createAuditLog } = await import("@/lib/server/audit-log");
    await createAuditLog({
      action: "ADMIN_CREATE_PROVIDER",
      entityType: "PROVIDER",
      entityId: newProvider.id,
      metadata: { name: newProvider.name, apiFamily: newProvider.apiFamily }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...newProvider,
        encryptedApiKey: maskApiKey(apiKey)
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
    console.error("POST /api/admin/providers failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tạo provider." },
      { status: 500 }
    );
  }
}



