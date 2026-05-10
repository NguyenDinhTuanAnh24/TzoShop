import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getServerUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: "Vui lòng đăng nhập để tiếp tục." } },
        { status: 401 }
      );
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            message: "Không tìm thấy API key.",
          },
        },
        {
          status: 404,
        },
      );
    }

    if (!apiKey.isActive) {
      return NextResponse.json({
        data: {
          id: apiKey.id,
          name: apiKey.name,
          apiFamily: apiKey.apiFamily,
          keyPrefix: apiKey.keyPrefix,
          isActive: apiKey.isActive,
          revokedAt: apiKey.revokedAt,
          message: "API key đã được thu hồi trước đó.",
        },
      });
    }

    const revokedKey = await prisma.apiKey.update({
      where: {
        id: apiKey.id,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    return NextResponse.json({
      data: {
        id: revokedKey.id,
        name: revokedKey.name,
        apiFamily: revokedKey.apiFamily,
        keyPrefix: revokedKey.keyPrefix,
        isActive: revokedKey.isActive,
        revokedAt: revokedKey.revokedAt,
      },
    });
  } catch (error) {
    console.error("PATCH /api/api-keys/[id]/revoke failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể thu hồi API key.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
