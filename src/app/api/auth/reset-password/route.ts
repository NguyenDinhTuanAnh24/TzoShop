import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };

    // Validate input
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 8 ký tự." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Mật khẩu xác nhận không khớp." },
        { status: 400 }
      );
    }

    // Hash token để tìm trong DB (không lưu raw token)
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Tìm reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    // Kiểm tra: tồn tại, chưa dùng, chưa hết hạn
    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." },
        { status: 400 }
      );
    }

    // Tìm user theo email trong token
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." },
        { status: 400 }
      );
    }

    // Hash mật khẩu mới
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    // Transaction: cập nhật password + đánh usedAt cho tất cả token của email
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          email: resetToken.email,
          usedAt: null,
        },
        data: { usedAt: now },
      }),
    ]);

    return NextResponse.json({ message: "Mật khẩu đã được cập nhật." });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: { message: "Vui lòng đăng nhập để tiếp tục." } }, { status: 401 });
      }
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: { message: "Không có quyền truy cập." } }, { status: 403 });
      }
    }
    console.error("[reset-password]", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
