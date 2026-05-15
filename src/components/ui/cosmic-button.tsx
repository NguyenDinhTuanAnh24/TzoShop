"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CosmicButtonProps = {
  children: ReactNode;
  href?: string;
  as?: "button" | "link";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

const sizeClasses = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export function CosmicButton({
  children,
  href,
  size = "md",
  variant = "primary",
  className,
  disabled,
  type = "button",
  ...props
}: CosmicButtonProps) {
  const outerClass = cn(
    "group inline-flex transition-all duration-200",
    variant === "primary" && "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    disabled && "pointer-events-none opacity-60",
    className
  );

  const innerClass = cn(
    "inline-flex w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
    sizeClasses[size],
    variant === "primary" &&
      "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.30)] hover:shadow-[0_10px_24px_-12px_rgba(79,70,229,0.45)]",
    variant === "secondary" &&
      "border border-slate-200 bg-white text-slate-900 hover:border-indigo-200 hover:bg-indigo-50/50",
    variant === "ghost" &&
      "bg-transparent text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
  );

  const content = <span className={innerClass}>{children}</span>;

  if (href) {
    const { onClick, ...linkProps } = props;
    return (
      <Link href={href} className={outerClass} onClick={onClick} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={outerClass} {...props}>
      {content}
    </button>
  );
}
