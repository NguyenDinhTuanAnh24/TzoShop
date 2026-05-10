import { createBaseEmailTemplate } from "./base-email";

type ResetPasswordEmailProps = {
  name?: string | null;
  resetUrl: string;
};

export function createResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  const displayName = name?.trim() || "bạn";

  return createBaseEmailTemplate({
    title: "Đặt lại mật khẩu TzoShop",
    previewText: "Yêu cầu đặt lại mật khẩu tài khoản TzoShop của bạn.",
    children: `
      <div style="text-align:center;">
        <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:20px; background:#ecfdf5; color:#059669; font-size:26px; font-weight:800;">
          🔐
        </div>
      </div>

      <h1 style="margin:24px 0 0; font-size:26px; line-height:34px; font-weight:800; color:#0f172a; text-align:center;">
        Đặt lại mật khẩu
      </h1>

      <p style="margin:14px 0 0; font-size:15px; line-height:26px; color:#475569; text-align:center;">
        Xin chào <strong>${displayName}</strong>, chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản TzoShop của bạn.
      </p>

      <div style="margin:28px 0; text-align:center;">
        <a href="${resetUrl}"
          style="display:inline-block; background:#059669; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:14px 26px; border-radius:999px;">
          Đặt lại mật khẩu
        </a>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:18px;">
        <p style="margin:0; font-size:14px; line-height:24px; color:#475569;">
          Link này chỉ có hiệu lực trong <strong>30 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
        </p>
      </div>

      <p style="margin:22px 0 0; font-size:13px; line-height:22px; color:#64748b;">
        Nếu nút phía trên không hoạt động, hãy copy đường dẫn sau và mở trong trình duyệt:
      </p>

      <p style="margin:8px 0 0; word-break:break-all; font-size:13px; line-height:22px; color:#059669;">
        ${resetUrl}
      </p>
    `,
  });
}
