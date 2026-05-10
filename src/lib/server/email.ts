import { Resend } from "resend";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESET_PASSWORD_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[DEV EMAIL] Missing RESEND_API_KEY or RESET_PASSWORD_FROM_EMAIL");
      console.log("[DEV EMAIL] To:", to);
      console.log("[DEV EMAIL] Subject:", subject);
      console.log("[DEV EMAIL] HTML:", html);
    }

    return {
      success: false,
      skipped: true,
    };
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("[sendEmail] Resend error:", JSON.stringify(error, null, 2));
    throw new Error("Không thể gửi email.");
  }

  console.log("[sendEmail] Email sent:", data?.id);

  return {
    success: true,
    id: data?.id,
  };
}
