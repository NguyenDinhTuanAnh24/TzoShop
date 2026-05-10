import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth-helper";
import { encryptText, decryptText } from "@/lib/crypto";

export const runtime = "nodejs";

function maskKey(key: string | null | undefined) {
  if (!key) return "";
  if (key.length <= 4) return "••••";
  return "••••••••••" + key.slice(-4);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: { message: "Không có quyền truy cập." } }, { status: 403 });
    }

    const setting = await prisma.paymentProviderSetting.findUnique({
      where: { provider: "PAYOS" },
    });

    if (!setting) {
      return NextResponse.json({
        success: true,
        data: {
          provider: "PAYOS",
          clientId: "",
          apiKeyMasked: "",
          checksumKeyMasked: "",
          environment: "production",
          isActive: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        provider: "PAYOS",
        clientId: setting.clientId || "",
        apiKeyMasked: setting.encryptedApiKey ? maskKey(decryptText(setting.encryptedApiKey)) : "",
        checksumKeyMasked: setting.encryptedChecksumKey ? maskKey(decryptText(setting.encryptedChecksumKey)) : "",
        environment: setting.environment,
        isActive: setting.isActive,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/payment-settings/payos failed:", error);
    return NextResponse.json({ error: { message: "Lỗi hệ thống." } }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: { message: "Không có quyền truy cập." } }, { status: 403 });
    }

    const body = await request.json();
    const { clientId, apiKey, checksumKey, environment, isActive } = body;

    // Validate
    if (isActive) {
      if (!clientId) {
        return NextResponse.json({ error: { message: "Client ID là bắt buộc khi kích hoạt." } }, { status: 400 });
      }
    }

    const existing = await prisma.paymentProviderSetting.findUnique({
      where: { provider: "PAYOS" },
    });

    if (isActive) {
      if (!existing?.encryptedApiKey && !apiKey) {
        return NextResponse.json({ error: { message: "API Key là bắt buộc khi kích hoạt lần đầu." } }, { status: 400 });
      }
      if (!existing?.encryptedChecksumKey && !checksumKey) {
        return NextResponse.json({ error: { message: "Checksum Key là bắt buộc khi kích hoạt lần đầu." } }, { status: 400 });
      }
    }

    const updateData: any = {
      clientId,
      environment,
      isActive,
    };

    if (apiKey) {
      updateData.encryptedApiKey = encryptText(apiKey);
    }

    if (checksumKey) {
      updateData.encryptedChecksumKey = encryptText(checksumKey);
    }

    const setting = await prisma.paymentProviderSetting.upsert({
      where: { provider: "PAYOS" },
      update: updateData,
      create: {
        provider: "PAYOS",
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        provider: "PAYOS",
        clientId: setting.clientId,
        isActive: setting.isActive,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/payment-settings/payos failed:", error);
    return NextResponse.json({ error: { message: "Lỗi hệ thống." } }, { status: 500 });
  }
}
