import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * POST /api/settings/link-google
 * Body: { googleEmail: string, providerAccountId: string }
 *
 * Được gọi sau khi Google OAuth callback xác nhận user đang đăng nhập
 * muốn liên kết Google với tài khoản hiện tại.
 * 
 * Điều kiện:
 * - User phải đang đăng nhập (session hợp lệ)
 * - googleEmail phải trùng với session.user.email
 * - Chưa có OAuthAccount google cho user này
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { googleEmail, providerAccountId } = body as {
    googleEmail: string;
    providerAccountId: string;
  };

  if (!googleEmail || !providerAccountId) {
    return NextResponse.json({ error: "Thiếu thông tin." }, { status: 400 });
  }

  // Bảo mật: email Google phải trùng email tài khoản hiện tại
  if (googleEmail.toLowerCase().trim() !== session.user.email.toLowerCase().trim()) {
    return NextResponse.json(
      { error: "Email Google không trùng với email tài khoản hiện tại." },
      { status: 403 }
    );
  }

  // Kiểm tra đã liên kết chưa
  const existing = await prisma.oAuthAccount.findUnique({
    where: { userId_provider: { userId: session.user.id, provider: "google" } },
  });

  if (existing) {
    return NextResponse.json({ error: "Google đã được liên kết với tài khoản này." }, { status: 409 });
  }

  // Kiểm tra providerAccountId chưa bị dùng bởi user khác
  const takenByOther = await prisma.oAuthAccount.findUnique({
    where: { provider_providerAccountId: { provider: "google", providerAccountId } },
  });

  if (takenByOther && takenByOther.userId !== session.user.id) {
    return NextResponse.json({ error: "Tài khoản Google này đã được liên kết với email khác." }, { status: 409 });
  }

  // Tạo OAuthAccount
  await prisma.oAuthAccount.create({
    data: {
      userId: session.user.id,
      provider: "google",
      providerAccountId,
      email: googleEmail,
    },
  });

  return NextResponse.json({ success: true });
}
