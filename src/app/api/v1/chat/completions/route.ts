import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiFamily } from "@prisma/client";
import { findActiveApiKeyByPlainTextKey } from "@/lib/api-key-auth";
import { decryptText } from "@/lib/crypto";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { calculateCreditsUsed, consumeCredits } from "@/lib/server/credits";
import { checkCreditAlertsForUser } from "@/lib/server/notifications";

export const runtime = "nodejs";

/**
 * Lấy Bearer token từ header Authorization
 */
function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.replace("Bearer ", "").trim();
}

/**
 * Ghi nhật ký sử dụng thất bại (UsageLog FAILED)
 */
async function logFailedUsage(params: {
  userId: string;
  apiKeyId: string;
  creditBucketId?: string | null;
  apiFamily: ApiFamily;
  model: string;
  errorMessage: string;
  errorCode?: string;
  httpStatus?: number;
  status?: string;
}) {
  try {
    await (prisma as any).usageLog.create({
      data: {
        userId: params.userId,
        apiKeyId: params.apiKeyId,
        creditBucketId: params.creditBucketId,
        apiFamily: params.apiFamily,
        model: params.model,
        endpoint: "/api/v1/chat/completions",
        status: params.status || "FAILED",
        errorCode: params.errorCode,
        errorMessage: params.errorMessage,
        httpStatus: params.httpStatus,
        creditsCharged: BigInt(0),
        creditsUsed: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      } as any,
    });
  } catch (error) {
    console.error("[UsageLog] Failed to log failed usage:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Lấy và kiểm tra API Key
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: { message: "Vui lòng cung cấp API key trong header Authorization.", type: "invalid_request_error", code: "missing_api_key" } }, { status: 401 });
    }

    const apiKey = await findActiveApiKeyByPlainTextKey(token);
    if (!apiKey) {
      return NextResponse.json({ error: { message: "API key không hợp lệ hoặc đã bị thu hồi.", type: "invalid_request_error", code: "invalid_api_key" } }, { status: 401 });
    }

    if (apiKey.revokedAt) {
      return NextResponse.json({ error: { message: "API key đã bị thu hồi.", type: "invalid_request_error", code: "api_key_revoked" } }, { status: 401 });
    }

    // 1.1 Kiểm tra Rate Limit (60 req/min)
    const rateLimit = await checkRateLimit(apiKey.id, 60);
    if (!rateLimit.success) {
        await logFailedUsage({
          userId: apiKey.userId,
          apiKeyId: apiKey.id,
          creditBucketId: apiKey.creditBucketId,
          apiFamily: apiKey.apiFamily,
          model: "unknown",
          errorMessage: "Rate limit exceeded (429)",
          errorCode: "rate_limit_exceeded",
          httpStatus: 429,
        });
       return NextResponse.json({ 
         error: { 
           message: "Bạn đã vượt giới hạn request. Vui lòng thử lại sau.", 
           type: "rate_limit_exceeded" 
         } 
       }, { 
         status: 429,
         headers: {
           "X-RateLimit-Limit": "60",
           "X-RateLimit-Remaining": "0",
           "X-RateLimit-Reset": rateLimit.resetAt.toString()
         }
       });
    }

    // 2. Kiểm tra Credit Bucket liên kết
    const bucket = apiKey.creditBucket;
    const isExpired = bucket?.expiresAt && new Date(bucket.expiresAt) < new Date();

    if (!bucket || !bucket.isActive || isExpired) {
      const errorMsg = isExpired 
        ? "Gói credits liên kết đã hết hạn." 
        : "Gói credits liên kết không khả dụng hoặc không còn hoạt động.";

      await logFailedUsage({
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        apiFamily: apiKey.apiFamily,
        model: "unknown",
        errorMessage: errorMsg,
        errorCode: "quota_exceeded",
        httpStatus: 401,
      });
      return NextResponse.json({ 
        error: { 
          message: errorMsg, 
          type: "insufficient_quota", 
          code: "quota_exceeded" 
        } 
      }, { status: 401 });
    }

    if (bucket.creditsRemaining <= BigInt(0)) {
      await logFailedUsage({
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        creditBucketId: bucket.id,
        apiFamily: apiKey.apiFamily,
        model: "unknown",
        errorMessage: "Tài khoản đã hết credits.",
        errorCode: "insufficient_credits",
        httpStatus: 402,
      });
      return NextResponse.json({ error: { message: "Tài khoản của bạn đã hết credits.", type: "insufficient_quota", code: "quota_exceeded" } }, { status: 402 });
    }

    // 3. Phân tích Request Body
    const body = await request.json().catch(() => ({}));
    const { model: modelName, messages, temperature = 0.7, max_tokens = 1000, stream } = body;

    if (stream === true) {
      return NextResponse.json({ error: { message: "Streaming chưa được hỗ trợ.", type: "invalid_request_error", code: "streaming_not_supported" } }, { status: 400 });
    }

    if (!modelName) {
      return NextResponse.json({ error: { message: "Vui lòng chỉ định model.", type: "invalid_request_error", code: "missing_model" } }, { status: 400 });
    }

    // 4. Kiểm tra quyền truy cập Model trong gói
    if (!bucket.allowedModels.includes(modelName)) {
      await logFailedUsage({
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        creditBucketId: bucket.id,
        apiFamily: apiKey.apiFamily,
        model: modelName,
        errorMessage: "Model không nằm trong gói đã mua.",
        errorCode: "model_not_allowed",
        httpStatus: 403,
      });
      return NextResponse.json({ error: { message: "Model không nằm trong gói đã mua.", type: "invalid_request_error", code: "model_not_allowed" } }, { status: 403 });
    }

    // 5. Tìm cấu hình AiModel & Provider
    const aiModel: any = await (prisma as any).aiModel.findFirst({
      where: { publicName: modelName, isActive: true },
      include: { provider: true }
    });

    if (!aiModel) {
      return NextResponse.json({ error: { message: "Model hiện không khả dụng trên hệ thống.", type: "invalid_request_error", code: "model_not_found" } }, { status: 404 });
    }

    const provider = aiModel.provider;

    if (!provider || !provider.isActive) {
      return NextResponse.json({ error: { message: "Nhà cung cấp dịch vụ hiện không khả dụng.", type: "server_error", code: "provider_unavailable" } }, { status: 503 });
    }

    // 6. Giải mã API Key và gọi Upstream
    let providerApiKey;
    try {
      providerApiKey = decryptText(provider.encryptedApiKey);
    } catch (err) {
      console.error("[Crypto] Decrypt provider key error:", err);
      return NextResponse.json({ error: { message: "Lỗi cấu hình nhà cung cấp.", type: "server_error", code: "internal_error" } }, { status: 500 });
    }

    const upstreamUrl = `${provider.baseUrl}/chat/completions`;
    const upstreamBody = {
      model: aiModel.upstreamModel,
      messages,
      temperature,
      max_tokens,
      stream: false,
    };

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${providerApiKey}`,
      },
      body: JSON.stringify(upstreamBody),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      let errorMsg = `Upstream error: ${upstreamResponse.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error?.message || errorMsg;
      } catch { }

      await logFailedUsage({
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        creditBucketId: bucket.id,
        apiFamily: apiKey.apiFamily,
        model: modelName,
        errorMessage: errorMsg,
        errorCode: "upstream_failed",
        httpStatus: upstreamResponse.status,
      });

      return NextResponse.json({ error: { message: "Lỗi từ nhà cung cấp dịch vụ AI.", type: "upstream_error", code: "upstream_failed" } }, { status: upstreamResponse.status });
    }

    const responseData = await upstreamResponse.json();

    // 7. Tính toán Token và Credits tiêu thụ
    let promptTokens = responseData.usage?.prompt_tokens;
    let completionTokens = responseData.usage?.completion_tokens;

    // Ước lượng nếu upstream không trả về usage
    if (typeof promptTokens !== "number") {
      const inputContent = messages?.map((m: { content: string }) => m.content).join(" ") || "";
      promptTokens = Math.ceil(inputContent.length / 4);
    }
    if (typeof completionTokens !== "number") {
      const outputContent = responseData.choices?.[0]?.message?.content || "";
      completionTokens = Math.ceil(outputContent.length / 4);
    }

    const creditsUsed = calculateCreditsUsed({
      promptTokens,
      completionTokens,
      inputRate: Number(aiModel.inputCreditRate),
      outputRate: Number(aiModel.outputCreditRate),
    });

    // 8. Trừ Credits và Ghi Log (Transaction via Helper)
    try {
      const result = await consumeCredits({
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        creditBucketId: bucket.id,
        creditsUsed,
        usageData: {
          model: modelName,
          apiFamily: apiKey.apiFamily,
          endpoint: "/api/v1/chat/completions",
          inputTokens: promptTokens,
          outputTokens: completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
      });

      // Kiểm tra và tạo notification nếu hết/sắp hết credits (không block response)
      checkCreditAlertsForUser(apiKey.userId).catch(err => {
        console.error("[Notification] Background credit check failed:", err);
      });

      // 9. Trả kết quả cho Client (OpenAI-compatible)
      return NextResponse.json({
        ...responseData,
        model: modelName,
        usage: {
          ...responseData.usage,
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
          credits_charged: creditsUsed,
          credits_remaining: result.remaining.toString(),
        }
      });

    } catch (error: unknown) {
      if (error instanceof Error && error.message === "INSUFFICIENT_CREDITS") {
        await logFailedUsage({
          userId: apiKey.userId,
          apiKeyId: apiKey.id,
          creditBucketId: bucket.id,
          apiFamily: apiKey.apiFamily,
          model: modelName,
          errorMessage: "Không đủ credits.",
          errorCode: "insufficient_credits",
          httpStatus: 402,
          status: "FAILED"
        });
        return NextResponse.json({ error: { message: "Tài khoản của bạn đã hết credits.", type: "insufficient_quota", code: "quota_exceeded" } }, { status: 402 });
      }
      throw error;
    }

  } catch (error) {
    console.error("[Gateway] /api/v1/chat/completions failed:", error);
    return NextResponse.json({ error: { message: "Đã có lỗi xảy ra trên hệ thống Gateway.", type: "server_error", code: "internal_error" } }, { status: 500 });
  }
}
