/**
 * In-memory rate limit helper for TzoShop Gateway.
 * 
 * CHÚ Ý: In-memory rate limit chỉ phù hợp cho development hoặc môi trường single instance.
 * Trong môi trường production (multiple instances/serverless), nên chuyển sang dùng Redis 
 * (ví dụ: Upstash Redis) để đảm bảo tính nhất quán trên toàn hệ thống.
 */

type RateLimitRecord = {
  count: number;
  windowStart: number;
};

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Kiểm tra rate limit cho một thực thể (ví dụ: apiKeyId)
 * Mặc định: 60 requests / 60 seconds (1 phút)
 */
export async function checkRateLimit(
  key: string, 
  limit: number = 60, 
  windowMs: number = 60000
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Nếu chưa có bản ghi hoặc đã qua cửa sổ thời gian cũ
  if (!record || now - record.windowStart > windowMs) {
    const newRecord = { count: 1, windowStart: now };
    rateLimitMap.set(key, newRecord);
    return {
      success: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    };
  }

  // Nếu trong cùng cửa sổ thời gian
  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.windowStart + windowMs,
    };
  }

  // Tăng count
  record.count += 1;
  rateLimitMap.set(key, record);

  return {
    success: true,
    remaining: limit - record.count,
    resetAt: record.windowStart + windowMs,
  };
}

/**
 * Tự động dọn dẹp Map để tránh memory leak (nếu cần thiết cho long-running)
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now - record.windowStart > 300000) { // Xóa nếu đã quá 5 phút
        rateLimitMap.delete(key);
      }
    }
  }, 60000); // Chạy mỗi phút
}
