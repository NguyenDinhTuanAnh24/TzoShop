import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message } },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: { message: "Email này đã được đăng ký sử dụng." } },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
      },
    });

    // Tạo thông báo cho admin
    const { createAdminNotification } = await import("@/lib/server/notifications");
    await createAdminNotification({
      type: "USER_REGISTERED",
      title: "Người dùng mới",
      message: `${user.email} vừa tạo tài khoản.`,
      href: "/admin/users"
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
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
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: { message: "Đã có lỗi xảy ra trong quá trình đăng ký." } },
      { status: 500 }
    );
  }
}
