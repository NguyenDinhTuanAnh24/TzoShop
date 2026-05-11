import { createBaseEmailTemplate } from "./base-email";

type LowCreditsEmailProps = {
  name?: string | null;
  productName: string;
  creditsRemaining: string;
  rechargeUrl: string;
};

export function createLowCreditsEmail({
  name,
  productName,
  creditsRemaining,
  rechargeUrl,
}: LowCreditsEmailProps) {
  const displayName = name?.trim() || "bạn";

  return createBaseEmailTemplate({
    title: "Số dư credits thấp - TzoShop",
    previewText: `Số dư credits của gói ${productName} sắp hết.`,
    children: `
      <div style="text-align:center;">
        <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:20px; background:#fff7ed; color:#ea580c; font-size:26px; font-weight:800;">
          ⚡
        </div>
      </div>

      <h1 style="margin:24px 0 0; font-size:26px; line-height:34px; font-weight:800; color:#0f172a; text-align:center;">
        Credits sắp hết
      </h1>

      <p style="margin:14px 0 0; font-size:15px; line-height:26px; color:#475569; text-align:center;">
        Xin chào <strong>${displayName}</strong>, gói <strong>${productName}</strong> của bạn đang sắp hết số dư.
      </p>

      <div style="margin-top:28px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:24px; text-align:center;">
        <p style="margin:0; font-size:14px; color:#64748b;">Số dư hiện tại:</p>
        <p style="margin:8px 0 0; font-size:32px; font-weight:800; color:#ea580c;">${creditsRemaining}</p>
        <p style="margin:4px 0 0; font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em;">Credits</p>
      </div>

      <p style="margin:22px 0 0; font-size:14px; line-height:24px; color:#64748b; text-align:center;">
        Để tránh gián đoạn các yêu cầu API, vui lòng nạp thêm credits hoặc gia hạn gói dịch vụ.
      </p>

      <div style="margin:28px 0 0; text-align:center;">
        <a href="${rechargeUrl}"
          style="display:inline-block; background:#0f172a; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:14px 26px; border-radius:999px;">
          Nạp thêm credits ngay
        </a>
      </div>
    `,
  });
}
