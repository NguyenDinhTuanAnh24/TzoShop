import { NextRequest, NextResponse } from "next/server";
import { findActiveApiKeyByPlainTextKey } from "@/lib/api-key-auth";
import { calculateChargedCredits } from "@/lib/credit-charge";
import { prisma } from "@/lib/prisma";
import { decryptText } from "@/lib/crypto";

const CreditLedgerType = {
  PURCHASE: "PURCHASE",
  USAGE: "USAGE",
  REFUND: "REFUND",
  ADJUSTMENT: "ADJUSTMENT",
  EXPIRE: "EXPIRE",
} as const;

export const runtime = "nodejs";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.replace("Bearer ", "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: { message: "Thiếu Authorization Bearer token." } }, { status: 401 });
    }

    // 1. Auth & ApiKey check
    const apiKey = await findActiveApiKeyByPlainTextKey(token);
    if (!apiKey || !apiKey.creditBucket) {
      return NextResponse.json({ error: { message: "API key không hợp lệ hoặc đã bị thu hồi." } }, { status: 401 });
    }

    const body = await request.json();
    const modelName = body?.model;

    if (!modelName || typeof modelName !== "string") {
      return NextResponse.json({ error: { message: "Thiếu model." } }, { status: 400 });
    }

    // 2. Authorization (Allowed Models & Expiry)
    const creditBucket = apiKey.creditBucket;
    if (!creditBucket.allowedModels.includes(modelName)) {
      return NextResponse.json({ error: { message: "Model không nằm trong gói credits này." } }, { status: 403 });
    }

    if (creditBucket.expiresAt <= new Date() || !creditBucket.isActive) {
      return NextResponse.json({ error: { message: "Gói credits đã hết hạn hoặc không còn hoạt động." } }, { status: 403 });
    }

    if (body.stream) {
      return NextResponse.json({ error: { message: "Streaming hiện chưa được hỗ trợ tại endpoint này. Vui lòng đặt stream: false." } }, { status: 400 });
    }

    // 3. Resolve Model & Provider
    const aiModel = await prisma.aiModel.findFirst({
      where: { publicName: modelName, isActive: true },
    });

    if (!aiModel) {
      return NextResponse.json({ error: { message: "Model không tồn tại hoặc đã bị vô hiệu hóa." } }, { status: 404 });
    }

    const providerKey = await prisma.providerKey.findFirst({
      where: { 
        apiFamily: aiModel.apiFamily, 
        status: "ACTIVE",
        // Có thể filter thêm provider nếu cần
      },
    });

    if (!providerKey) {
      return NextResponse.json({ error: { message: "Không tìm thấy Provider phù hợp." } }, { status: 503 });
    }

    // 4. Decrypt Upstream Key & Forward Request
    const decryptedKey = decryptText(providerKey.encryptedKey);
    const upstreamUrl = `${providerKey.baseUrl}/chat/completions`;

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${decryptedKey}`,
      },
      body: JSON.stringify({
        ...body,
        model: aiModel.upstreamName, // Dùng tên model của provider
      }),
    });

    if (!upstreamResponse.ok) {
      const errorData = await upstreamResponse.json().catch(() => ({}));
      return NextResponse.json({
        error: {
          message: "Lỗi từ Upstream AI Provider",
          upstream_error: errorData,
        }
      }, { status: upstreamResponse.status });
    }

    const responseData = await upstreamResponse.json();
    const usage = responseData.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    
    const inputTokens = usage.prompt_tokens;
    const outputTokens = usage.completion_tokens;
    const totalTokens = usage.total_tokens;

    // 5. Credit Charging
    const { chargedCredits } = await calculateChargedCredits({
      model: modelName,
      inputTokens,
      outputTokens,
    });

    if (creditBucket.creditsRemaining < BigInt(chargedCredits)) {
      return NextResponse.json({ error: { message: "Tài khoản của bạn không đủ credits để thực hiện request này." } }, { status: 402 });
    }

    // 6. Persistence (Transaction)
    const result = await prisma.$transaction(async (tx: any) => {
      const updatedBucket = await tx.creditBucket.update({
        where: { id: creditBucket.id },
        data: { creditsRemaining: { decrement: BigInt(chargedCredits) } },
      });

      const usageLog = await tx.usageLog.create({
        data: {
          userId: apiKey.userId,
          apiKeyId: apiKey.id,
          creditBucketId: creditBucket.id,
          apiFamily: apiKey.apiFamily,
          model: modelName,
          endpoint: "/api/v1/chat/completions",
          inputTokens,
          outputTokens,
          totalTokens,
          creditsCharged: BigInt(chargedCredits),
          status: "SUCCESS",
        },
      });

      await tx.creditLedger.create({
        data: {
          userId: apiKey.userId,
          creditBucketId: creditBucket.id,
          apiFamily: apiKey.apiFamily,
          type: CreditLedgerType.USAGE,
          amount: BigInt(-chargedCredits),
          balanceAfter: updatedBucket.creditsRemaining,
          reason: `Sử dụng model ${modelName}`,
          referenceId: usageLog.id,
        },
      });

      await tx.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });

      return { updatedBucket };
    });

    // 7. Final Response (OpenAI compatible + TzoShop metadata)
    return NextResponse.json({
      ...responseData,
      usage: {
        ...usage,
        charged_credits: chargedCredits,
        remaining_credits: result.updatedBucket.creditsRemaining.toString(),
      },
    });

  } catch (error) {
    console.error("POST /api/v1/chat/completions failed:", error);
    return NextResponse.json({ error: { message: "Internal Server Error" } }, { status: 500 });
  }
}
