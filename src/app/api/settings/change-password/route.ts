import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireCurrentUser } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const userSession = await requireCurrentUser();
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: { message: "Mật khẩu mới tối thiểu 8 ký tự." } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userSession.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: "Không tìm thấy người dùng." } },
        { status: 404 }
      );
    }

    // Nếu user đã có passwordHash (đã từng đặt mật khẩu), bắt buộc kiểm tra currentPassword
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: { message: "Vui lòng nhập mật khẩu hiện tại." } },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: { message: "Mật khẩu hiện tại không đúng." } },
          { status: 400 }
        );
      }
    }

    // Hash mật khẩu mới và cập nhật
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công.",
    });

  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: { message: "Vui lòng đăng nhập để tiếp tục." } }, { status: 401 });
      }
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: { message: "Không có quyền truy cập." } }, { status: 403 });
      }
    }
    console.error("PATCH /api/settings/change-password failed:", error);
    return NextResponse.json(
      { error: { message: "Không thể đổi mật khẩu, vui lòng thử lại sau." } },
      { status: 500 }
    );
  }
}
