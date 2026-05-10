import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export const runtime = "nodejs";

/**
 * GET /api/settings/link-google-callback
 *
 * NextAuth redirect user đến đây sau khi Google OAuth thành công trong flow liên kết.
 * Tại đây:
 * 1. Đọc thông tin Google từ token (account được lưu trong NextAuth session ngắn hạn)
 * 2. Kiểm tra email Google trùng với user đang đăng nhập
 * 3. Nếu trùng → tạo OAuthAccount
 * 4. Redirect về /settings với query params phản hồi
 *
 * Lưu ý: Do NextAuth không truyền providerAccountId qua session,
 * ta dùng cách lấy thông tin từ cookies/token JWT đặc biệt của NextAuth.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Lấy JWT token để đọc thông tin Google từ OAuth flow gần nhất
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/settings?googleLinked=email_mismatch", request.url));
  }

  const tokenEmail = String(token.email ?? "").toLowerCase().trim();
  const sessionEmail = session.user.email.toLowerCase().trim();

  // Bảo mật: token phải khớp với session hiện tại
  if (tokenEmail !== sessionEmail) {
    return NextResponse.redirect(new URL("/settings?googleLinked=email_mismatch", request.url));
  }

  // Tìm OAuthAccount đã được tạo bởi signIn callback (flow new user sẽ tạo tự động)
  // Đối với user cũ có email/password, signIn callback đã từ chối và redirect về login.
  // Vậy nếu đến được đây, có thể user mới hoặc đã link rồi.
  const existing = await prisma.oAuthAccount.findUnique({
    where: { userId_provider: { userId: session.user.id, provider: "google" } },
  });

  if (existing) {
    return NextResponse.redirect(new URL("/settings?googleLinked=success", request.url));
  }

  // Trường hợp user có email/password muốn link: signIn đã từ chối ở callback
  // Không đến được đây. Redirect về settings với lỗi.
  return NextResponse.redirect(new URL("/settings?googleLinked=email_mismatch", request.url));
}
