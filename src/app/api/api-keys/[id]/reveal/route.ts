import { NextRequest, NextResponse } from "next/server";

import { decryptText } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
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
      return NextResponse.json(
        {
          error: {
            message: "API key đã bị thu hồi.",
          },
        },
        {
          status: 400,
        },
      );
    }

    if (!apiKey.encryptedKey) {
      return NextResponse.json(
        {
          error: {
            message: "API key này không có dữ liệu mã hóa để hiển thị lại.",
          },
        },
        {
          status: 400,
        },
      );
    }

    const fullKey = decryptText(apiKey.encryptedKey);

    return NextResponse.json({
      data: {
        id: apiKey.id,
        fullKey,
      },
    });
  } catch (error) {
    console.error("GET /api/api-keys/[id]/reveal failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể hiển thị API key.",
        },
      },
      {
        status: 500,
      },
    );
  }
}
