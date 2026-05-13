import Link from "next/link";
import Image from "next/image";
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";

const footerColumns = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Bảng giá", href: "/pricing" },
      { label: "Hướng dẫn sử dụng", href: "/docs" },
      { label: "Câu hỏi thường gặp", href: "/docs/faq" },
      { label: "API trực tiếp", href: "/docs/api" },
    ],
  },
  {
    title: "Dòng AI",
    links: [
      { label: "CodexAI", href: "/pricing" },
      { label: "Claude", href: "/pricing" },
      { label: "Gemini", href: "/pricing" },
      { label: "DeepSeek", href: "/pricing" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Câu hỏi thường gặp", href: "/faq" },
      { label: "Hướng dẫn sử dụng", href: "/docs" },
      { label: "Chính sách", href: "/policies" },
    ],
  },
];

const contactLinks = [
  {
    label: `SĐT: ${CONTACT_INFO.zalo}`,
    href: CONTACT_LINKS.zaloTel,
    type: "normal",
  },
  {
    label: `Email: ${CONTACT_INFO.email}`,
    href: CONTACT_LINKS.email,
    type: "normal",
  },
  {
    label: `Zalo: ${CONTACT_INFO.zalo}`,
    href: CONTACT_LINKS.zalo,
    type: "zalo",
  },
  {
    label: `Telegram: ${CONTACT_INFO.telegram}`,
    href: CONTACT_LINKS.telegram,
    type: "telegram",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#edf1ee] bg-white">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.png" alt="TzoShop" width={160} height={42} className="h-10 w-auto" />
            </Link>

            <p className="mt-4 text-sm leading-6 text-[#47524d]">
              Nền tảng cung cấp API Credits cho nhiều dòng AI phổ biến, hỗ trợ người dùng sử dụng linh hoạt cùng các extension và công cụ làm việc.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-[#0b0f0d]">{column.title}</h3>

              <div className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <Link key={link.label} href={link.href} className="block text-sm text-[#66736d] transition hover:text-[#0b0f0d]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-[#0b0f0d]">Thông tin liên hệ</h3>

            <div className="mt-4 space-y-3">
              {contactLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={
                    link.type === "zalo"
                      ? "block text-sm font-semibold text-[#0068ff] underline underline-offset-4 transition hover:text-[#0052cc]"
                      : link.type === "telegram"
                        ? "block text-sm font-semibold text-[#229ed9] underline underline-offset-4 transition hover:text-[#168ac0]"
                        : "block text-sm text-[#66736d] transition hover:text-[#0b0f0d]"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#edf1ee] pt-6 text-sm text-[#66736d]">© 2026 TzoShop. All rights reserved.</div>
      </div>
    </footer>
  );
}
