import { createBaseEmailTemplate } from "./base-email";

type ExpiringSoonEmailProps = {
  name?: string | null;
  productName: string;
  expiresAt: string;
  daysRemaining: number;
  rechargeUrl: string;
};

export function createExpiringSoonEmail({
  name,
  productName,
  expiresAt,
  daysRemaining,
  rechargeUrl,
}: ExpiringSoonEmailProps) {
  const displayName = name?.trim() || "bạn";

  return createBaseEmailTemplate({
    title: "Gói dịch vụ sắp hết hạn - TzoShop",
    previewText: `Gói ${productName} của bạn sẽ hết hạn vào ngày ${expiresAt}.`,
    children: `
      <div style="text-align:center;">
        <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:20px; background:#fefce8; color:#ca8a04; font-size:26px; font-weight:800;">
          ⏳
        </div>
      </div>

      <h1 style="margin:24px 0 0; font-size:26px; line-height:34px; font-weight:800; color:#0f172a; text-align:center;">
        Gói dịch vụ sắp hết hạn
      </h1>

      <p style="margin:14px 0 0; font-size:15px; line-height:26px; color:#475569; text-align:center;">
        Xin chào <strong>${displayName}</strong>, gói <strong>${productName}</strong> của bạn sẽ hết hạn trong <strong>${daysRemaining} ngày</strong> tới.
      </p>

      <div style="margin-top:28px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:24px; text-align:center;">
        <p style="margin:0; font-size:14px; color:#64748b;">Ngày hết hạn:</p>
        <p style="margin:8px 0 0; font-size:24px; font-weight:800; color:#0f172a;">${expiresAt}</p>
      </div>

      <p style="margin:22px 0 0; font-size:14px; line-height:24px; color:#64748b; text-align:center;">
        Hãy gia hạn ngay để tiếp tục sử dụng các dịch vụ AI cao cấp của TzoShop mà không bị gián đoạn.
      </p>

      <div style="margin:28px 0 0; text-align:center;">
        <a href="${rechargeUrl}"
          style="display:inline-block; background:#0f172a; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:14px 26px; border-radius:999px;">
          Gia hạn gói ngay
        </a>
      </div>
    `,
  });
}
