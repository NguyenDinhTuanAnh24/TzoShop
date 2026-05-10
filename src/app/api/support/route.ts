import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TicketPriority } from "@prisma/client";
import { getServerUser } from "@/lib/auth-helper";
import { sendEmail } from "@/lib/server/email";
import { createSupportTicketEmail } from "@/lib/server/email-templates/support-ticket-email";

export const runtime = "nodejs";

const PRIORITY_MAP: Record<string, TicketPriority> = {
  "Bình thường": "NORMAL",
  "Cao": "HIGH",
  "Khẩn cấp": "URGENT",
};

export async function GET() {
  try {
    const user = await getServerUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Vui lòng đăng nhập để xem yêu cầu hỗ trợ." },
        { status: 401 }
      );
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error("GET /api/support failed:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách hỗ trợ." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    const body = await request.json();

    const {
      name,
      email,
      category,
      priority,
      subject,
      message,
      orderCode,
      apiKeyPrefix,
    } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Vui lòng điền đầy đủ các thông tin bắt buộc." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { success: false, message: "Nội dung hỗ trợ quá ngắn (tối thiểu 10 ký tự)." },
        { status: 400 }
      );
    }

    const ticketPriority = PRIORITY_MAP[priority] || "NORMAL";

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user?.id || null,
        name,
        email,
        category: category || "Khác",
        priority: ticketPriority,
        subject,
        message,
        orderCode: orderCode || null,
        apiKeyPrefix: apiKeyPrefix || null,
        status: "OPEN",
      },
    });

    // Send confirmation email
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3004";
      await sendEmail({
        to: email,
        subject: `[TzoShop] Xác nhận yêu cầu hỗ trợ #${ticket.id.slice(-6).toUpperCase()}`,
        html: createSupportTicketEmail({
          name,
          ticketCode: ticket.id.slice(-6).toUpperCase(),
          subject,
          category: category || "Khác",
          supportUrl: `${appUrl}/support`,
        }),
      });
    } catch (emailError) {
      console.error("[POST /api/support] Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/support failed:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra khi gửi yêu cầu hỗ trợ." },
      { status: 500 }
    );
  }
}
