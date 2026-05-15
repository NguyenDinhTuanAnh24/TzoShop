"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { label: "SẢN PHẨM", href: "/plans" },
  { label: "THÔNG TIN", href: "/#providers" },
  { label: "CHÍNH SÁCH", href: "/terms" },
  { label: "ĐÁNH GIÁ", href: "/#testimonials" },
];

const footerActionLinks = [
  { label: "Zalo", href: "https://zalo.me/0866555468", external: true },
  { label: "Telegram", href: "https://t.me/tzora24", external: true },
];

type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterLinkColumn = {
  title: string;
  links: FooterLinkItem[];
};

const footerLinkColumns: FooterLinkColumn[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "CodexAI Credits", href: "/products/codexai-credits" },
      { label: "Claude Credits", href: "/products/claude-credits" },
      { label: "Gemini Credits", href: "/products/gemini-credits" },
      { label: "DeepSeek Credits", href: "/products/deepseek-credits" },
    ],
  },
  {
    title: "Thông tin",
    links: [
      { label: "Dòng AI hỗ trợ", href: "/#providers" },
      { label: "Quy trình sử dụng", href: "/#how-it-works" },
      { label: "Đánh giá người dùng", href: "/#testimonials" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm hỗ trợ", href: "/support" },
      { label: "FAQ", href: "/faq" },
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
    ],
  },
];

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold !text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_0_rgba(79,70,229,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

export function LandingPublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const userName = session?.user?.name?.trim() || "Tài khoản";
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Image src="/logo.png" alt="TzoShop logo" width={28} height={28} className="h-7 w-7 object-contain" priority />
          <span className="text-lg font-bold text-slate-900">TzoShop</span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-2 py-1 text-sm font-medium tracking-normal text-slate-600 transition-colors duration-200 hover:!text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
                title={userName}
              >
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                  {userImage ? (
                    <Image src={userImage} alt={`${userName} avatar`} width={28} height={28} className="h-7 w-7 object-cover" />
                  ) : (
                    userInitial
                  )}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{userName}</span>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/?auth=login" className={secondaryButtonClass}>
                Đăng nhập
              </Link>
              <Link href="/?auth=register" className={primaryButtonClass}>
                Bắt đầu
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Mở menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}`}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium tracking-normal text-slate-600 transition-colors duration-200 hover:!text-indigo-600"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </>
              ) : isAuthenticated ? (
                <Link href="/dashboard" className={`${secondaryButtonClass} col-span-2`} onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/?auth=login" className={secondaryButtonClass}>
                    Đăng nhập
                  </Link>
                  <Link href="/?auth=register" className={primaryButtonClass}>
                    Bắt đầu
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-slate-950">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 py-16 md:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div className="text-slate-100">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 !text-white">
            <Image src="/logo.png" alt="TzoShop logo" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold">TzoShop</span>
          </Link>
          <p className="mt-5 max-w-sm text-base leading-8 text-slate-400">
            Nền tảng giúp bạn mua gói credits, sử dụng AI linh hoạt và kiểm soát chi phí rõ ràng hơn.
          </p>
          <p className="mt-5 text-base text-slate-300">
            <span className="text-slate-400">Hotline:</span>{" "}
            <Link href="tel:0866555468" className="text-slate-200 transition-colors hover:text-white">
              0866555468
            </Link>
          </p>
          <p className="mt-2 text-base text-slate-400">Phản hồi trong ngày làm việc</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {footerActionLinks.map((item) => (
              <Link
                key={`footer-action-${item.label}`}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base text-slate-200 transition-colors duration-200 hover:border-indigo-300/40 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {footerLinkColumns.map((group) => (
          <div key={`footer-${group.title}`} className="text-slate-300">
            <h3 className="text-base font-semibold uppercase tracking-wide text-white">{group.title}</h3>
            <ul className="mt-4 space-y-3.5">
              {group.links.map((link) => (
                <li key={`footer-link-${group.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="!text-slate-300 text-base transition-colors duration-200 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 TzoShop. All rights reserved.</p>
          <Link href="mailto:support@tzoshop.io.vn" className="inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white">
            <Mail className="h-4 w-4" />
            support@tzoshop.io.vn
          </Link>
        </div>
      </div>
    </footer>
  );
}

export { PublicFooter as LandingPublicFooter };
