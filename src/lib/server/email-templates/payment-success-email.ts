import { createBaseEmailTemplate } from "./base-email";

type PaymentSuccessEmailProps = {
  name?: string | null;
  orderCode: string;
  productName: string;
  amount: string;
  credits: string;
  duration: string;
  dashboardUrl: string;
};

export function createPaymentSuccessEmail({
  name,
  orderCode,
  productName,
  amount,
  credits,
  duration,
  dashboardUrl,
}: PaymentSuccessEmailProps) {
  const displayName = name?.trim() || "bạn";

  return createBaseEmailTemplate({
    title: "Thanh toán thành công - TzoShop",
    previewText: `Đơn hàng ${orderCode} đã được thanh toán thành công.`,
    children: `
      <div style="text-align:center;">
        <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:20px; background:#ecfdf5; color:#059669; font-size:28px; font-weight:800;">
          ✓
        </div>
      </div>

      <h1 style="margin:24px 0 0; font-size:26px; line-height:34px; font-weight:800; color:#0f172a; text-align:center;">
        Thanh toán thành công
      </h1>

      <p style="margin:14px 0 0; font-size:15px; line-height:26px; color:#475569; text-align:center;">
        Xin chào <strong>${displayName}</strong>, gói credits của bạn đã được kích hoạt.
      </p>

      <div style="margin-top:28px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:8px 0; font-size:14px; color:#64748b;">Mã đơn</td>
            <td align="right" style="padding:8px 0; font-size:14px; font-weight:700; color:#0f172a;">${orderCode}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-size:14px; color:#64748b;">Gói</td>
            <td align="right" style="padding:8px 0; font-size:14px; font-weight:700; color:#0f172a;">${productName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-size:14px; color:#64748b;">Credits</td>
            <td align="right" style="padding:8px 0; font-size:14px; font-weight:700; color:#059669;">${credits}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-size:14px; color:#64748b;">Thời hạn</td>
            <td align="right" style="padding:8px 0; font-size:14px; font-weight:700; color:#0f172a;">${duration}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-size:14px; color:#64748b;">Số tiền</td>
            <td align="right" style="padding:8px 0; font-size:14px; font-weight:700; color:#0f172a;">${amount}</td>
          </tr>
        </table>
      </div>

      <div style="margin:28px 0 0; text-align:center;">
        <a href="${dashboardUrl}"
          style="display:inline-block; background:#059669; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:14px 26px; border-radius:999px;">
          Xem gói của tôi
        </a>
      </div>
    `,
  });
}
