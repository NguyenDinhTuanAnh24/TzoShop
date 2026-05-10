type BaseEmailProps = {
  title: string;
  previewText?: string;
  children: string;
};

export function createBaseEmailTemplate({
  title,
  previewText,
  children,
}: BaseEmailProps) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>

<body style="margin:0; padding:0; background:#f6f8f7; font-family:Arial, Helvetica, sans-serif; color:#0f172a;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    ${previewText ?? title}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f8f7; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
          
          <tr>
            <td style="padding-bottom:20px; text-align:center;">
              <div style="display:inline-flex; align-items:center; gap:10px;">
                <div style="display:inline-block; width:44px; height:44px; line-height:44px; border-radius:16px; background:#059669; color:white; font-weight:800; font-size:20px; text-align:center;">
                  T
                </div>
                <span style="font-size:22px; font-weight:800; color:#0f172a;">
                  TzoShop
                </span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff; border:1px solid #e2e8f0; border-radius:28px; padding:32px; box-shadow:0 12px 35px rgba(15,23,42,0.06);">
              ${children}
            </td>
          </tr>

          <tr>
            <td style="padding:22px 8px 0; text-align:center;">
              <p style="margin:0; font-size:13px; line-height:22px; color:#64748b;">
                Email này được gửi tự động từ TzoShop. Vui lòng không trả lời trực tiếp email này.
              </p>

              <p style="margin:8px 0 0; font-size:13px; color:#94a3b8;">
                © ${new Date().getFullYear()} TzoShop. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
