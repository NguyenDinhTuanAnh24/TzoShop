import Link from "next/link";
import Image from "next/image";

const navItems = [
  {
    label: "Trang chủ",
    href: "/",
  },
  {
    label: "Bảng giá",
    href: "/pricing",
  },
  {
    label: "Hướng dẫn",
    href: "/docs",
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#edf1ee] bg-white/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="TzoShop"
              width={160}
              height={42}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-[#47524d] transition hover:text-[#0b0f0d]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-[#47524d] transition hover:text-[#0b0f0d] sm:inline-flex"
          >
            Đăng nhập
          </Link>

          <Link href="/pricing" className="btn-primary">
            Bắt đầu
          </Link>
        </div>
      </div>
    </header>
  );
}
