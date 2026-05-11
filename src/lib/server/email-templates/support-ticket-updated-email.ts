import { createBaseEmailTemplate } from "./base-email";

type SupportTicketUpdatedEmailProps = {
  name?: string | null;
  ticketId: string;
  subject: string;
  status: string;
  adminNote?: string | null;
  supportUrl: string;
};

export function createSupportTicketUpdatedEmail({
  name,
  ticketId,
  subject,
  status,
  adminNote,
  supportUrl,
}: SupportTicketUpdatedEmailProps) {
  const displayName = name?.trim() || "bạn";

  const statusMap: Record<string, { label: string, color: string }> = {
    OPEN: { label: "Mở", color: "#64748b" },
    IN_PROGRESS: { label: "Đang xử lý", color: "#0ea5e9" },
    RESOLVED: { label: "Đã giải quyết", color: "#059669" },
    CLOSED: { label: "Đã đóng", color: "#94a3b8" },
  };

  const currentStatus = statusMap[status] || { label: status, color: "#64748b" };

  return createBaseEmailTemplate({
    title: "Cập nhật yêu cầu hỗ trợ - TzoShop",
    previewText: `Yêu cầu hỗ trợ ${ticketId} đã được cập nhật trạng thái mới.`,
    children: `
      <div style="text-align:center;">
        <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:20px; background:#f0f9ff; color:#0ea5e9; font-size:26px; font-weight:800;">
          🔔
        </div>
      </div>

      <h1 style="margin:24px 0 0; font-size:26px; line-height:34px; font-weight:800; color:#0f172a; text-align:center;">
        Yêu cầu hỗ trợ đã được cập nhật
      </h1>

      <p style="margin:14px 0 0; font-size:15px; line-height:26px; color:#475569; text-align:center;">
        Xin chào <strong>${displayName}</strong>, yêu cầu hỗ trợ của bạn đã có cập nhật mới từ đội ngũ kỹ thuật.
      </p>

      <div style="margin-top:28px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:20px;">
        <p style="margin:0 0 12px; font-size:13px; font-weight:800; color:#0ea5e9; text-transform:uppercase; letter-spacing:0.12em;">
          Thông tin chi tiết
        </p>

        <p style="margin:0; font-size:14px; line-height:24px; color:#475569;">
          <strong>Mã ticket:</strong> ${ticketId}
        </p>

        <p style="margin:8px 0 0; font-size:14px; line-height:24px; color:#475569;">
          <strong>Tiêu đề:</strong> ${subject}
        </p>

        <p style="margin:8px 0 0; font-size:14px; line-height:24px; color:#475569;">
          <strong>Trạng thái:</strong> 
          <span style="display:inline-block; padding:2px 10px; border-radius:10px; background:${currentStatus.color}10; color:${currentStatus.color}; font-weight:700; font-size:12px;">
            ${currentStatus.label}
          </span>
        </p>

        ${adminNote ? `
          <div style="margin-top:16px; padding-top:16px; border-top:1px dashed #cbd5e1;">
            <p style="margin:0 0 8px; font-size:13px; font-weight:700; color:#0f172a;">Ghi chú từ quản trị viên:</p>
            <p style="margin:0; font-size:14px; line-height:24px; color:#475569; font-style:italic;">
              "${adminNote}"
            </p>
          </div>
        ` : ""}
      </div>

      <div style="margin:28px 0 0; text-align:center;">
        <a href="${supportUrl}"
          style="display:inline-block; background:#0ea5e9; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:14px 26px; border-radius:999px;">
          Xem phản hồi chi tiết
        </a>
      </div>
    `,
  });
}
