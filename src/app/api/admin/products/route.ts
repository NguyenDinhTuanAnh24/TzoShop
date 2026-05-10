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

    const products = await prisma.product.findMany({
      orderBy: {
        priceVnd: "asc",
      }
    });

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error("GET /api/admin/products failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tải danh sách gói." },
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
    const { 
      name, slug, apiFamily, tier, credits, 
      durationDays, priceVnd, apiKeyLimit, 
      allowedModels, allowedReasoning, isActive 
    } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        apiFamily,
        tier,
        credits: BigInt(credits),
        durationDays: parseInt(durationDays),
        priceVnd: parseInt(priceVnd),
        apiKeyLimit: parseInt(apiKeyLimit),
        allowedModels: allowedModels || [],
        allowedReasoning: allowedReasoning ?? false,
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...newProduct,
        credits: newProduct.credits.toString(),
      }
    });

  } catch (error) {
    console.error("POST /api/admin/products failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tạo gói." },
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

    if (data.credits) data.credits = BigInt(data.credits);
    if (data.durationDays) data.durationDays = parseInt(data.durationDays);
    if (data.priceVnd) data.priceVnd = parseInt(data.priceVnd);
    if (data.apiKeyLimit) data.apiKeyLimit = parseInt(data.apiKeyLimit);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedProduct,
        credits: updatedProduct.credits.toString(),
      }
    });

  } catch (error) {
    console.error("PATCH /api/admin/products failed:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật gói." },
      { status: 500 }
    );
  }
}
