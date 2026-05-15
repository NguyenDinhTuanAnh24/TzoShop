import Link from "next/link";
import Image from "next/image";
import { CONTACT_INFO, CONTACT_LINKS } from "@/lib/contact";

const footerColumns = [
  {
    title: "Liên kết nhanh",
    links: [
      { label: "Trang chủ", href: "/" },
      { label: "Gói credits", href: "/plans" },
      { label: "Tài liệu", href: "/api-docs" },
      { label: "Hướng dẫn API", href: "/api-docs" },
    ],
  },
  {
    title: "Tài khoản",
    links: [
      { label: "Đăng nhập", href: "/?auth=login" },
      { label: "Đăng ký", href: "/?auth=register" },
      { label: "Gói của tôi", href: "/my-plans" },
      { label: "Thanh toán", href: "/billing" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm hỗ trợ", href: "/support" },
      { label: "Email", value: "support@tzoshop.io.vn", href: CONTACT_LINKS.email, external: true },
      { label: "Zalo", value: "0866555468", href: CONTACT_LINKS.zalo || "#", external: true },
      { label: "Telegram", value: "@tzora24", href: CONTACT_LINKS.telegram || "#", external: true },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#edf1ee] bg-white">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr_1.1fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.png" alt="TzoShop" width={160} height={42} className="h-10 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-7 text-[#47524d]">
              Nền tảng giúp bạn quản lý credits, API key và tích hợp AI vào công việc một cách rõ ràng, ổn định.
            </p>
            <p className="mt-4 text-xs text-[#66736d]">Phản hồi trong ngày làm việc.</p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-[#0b0f0d]">{column.title}</h3>
              <div className="mt-4 space-y-3">
                {column.title === "Hỗ trợ"
                  ? column.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="block text-sm transition"
                      >
                        {link.value ? (
                          <span>
                            <span className="text-slate-400">{link.label}: </span>
                            <span className="text-slate-700 hover:text-indigo-600">{link.value}</span>
                          </span>
                        ) : (
                          <span className="text-[#66736d] hover:text-[#0b0f0d]">{link.label}</span>
                        )}
                      </Link>
                    ))
                  : column.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="block text-sm text-[#66736d] transition hover:text-[#0b0f0d]"
                      >
                        {link.label}
                      </Link>
                    ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-[#0b0f0d]">Liên hệ nhanh</h3>
            <div className="mt-4 space-y-3 text-sm text-[#66736d]">
              <p>{CONTACT_INFO.email}</p>
              <div className="space-y-2">
                <Link href={CONTACT_LINKS.zalo} target="_blank" rel="noopener noreferrer" className="block transition hover:text-[#0b0f0d]">
                  Zalo
                </Link>
                <Link href={CONTACT_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="block transition hover:text-[#0b0f0d]">
                  Telegram
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#edf1ee] pt-6 text-sm text-[#66736d]">© 2026 TzoShop. All rights reserved.</div>
      </div>
    </footer>
  );
}
