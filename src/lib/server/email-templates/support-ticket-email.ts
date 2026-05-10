import { createBaseEmailTemplate } from "./base-email";

type SupportTicketEmailProps = {
  name?: string | null;
  ticketCode?: string;
  subject: string;
  category: string;
  supportUrl: string;
};

export function createSupportTicketEmail({
  name,
  ticketCode,
  subject,
  category,
  supportUrl,
}: SupportTicketEmailProps) {
  const displayName = name?.trim() || "bạn";

  return createBaseEmailTemplate({
    title: "TzoShop đã nhận yêu cầu hỗ trợ",
    previewText: "Yêu cầu hỗ trợ của bạn đã được ghi nhận.",
    children: `
      <div style="text-align:center;">
        <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:20px; background:#ecfdf5; color:#059669; font-size:26px; font-weight:800;">
          💬
        </div>
      </div>

      <h1 style="margin:24px 0 0; font-size:26px; line-height:34px; font-weight:800; color:#0f172a; text-align:center;">
        Đã nhận yêu cầu hỗ trợ
      </h1>

      <p style="margin:14px 0 0; font-size:15px; line-height:26px; color:#475569; text-align:center;">
        Xin chào <strong>${displayName}</strong>, đội ngũ TzoShop đã nhận được yêu cầu hỗ trợ của bạn.
      </p>

      <div style="margin-top:28px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:20px;">
        <p style="margin:0 0 12px; font-size:13px; font-weight:800; color:#059669; text-transform:uppercase; letter-spacing:0.12em;">
          Thông tin yêu cầu
        </p>

        <p style="margin:0; font-size:14px; line-height:24px; color:#475569;">
          <strong>Mã ticket:</strong> ${ticketCode ?? "Đang xử lý"}
        </p>

        <p style="margin:8px 0 0; font-size:14px; line-height:24px; color:#475569;">
          <strong>Loại yêu cầu:</strong> ${category}
        </p>

        <p style="margin:8px 0 0; font-size:14px; line-height:24px; color:#475569;">
          <strong>Tiêu đề:</strong> ${subject}
        </p>
      </div>

      <p style="margin:22px 0 0; font-size:14px; line-height:24px; color:#64748b;">
        Chúng tôi sẽ phản hồi trong thời gian sớm nhất. Bạn có thể theo dõi yêu cầu tại trang hỗ trợ.
      </p>

      <div style="margin:28px 0 0; text-align:center;">
        <a href="${supportUrl}"
          style="display:inline-block; background:#059669; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:14px 26px; border-radius:999px;">
          Xem hỗ trợ
        </a>
      </div>
    `,
  });
}
