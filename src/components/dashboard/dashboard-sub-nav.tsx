"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubNavItem {
  href: string;
  label: string;
}

interface DashboardSubNavProps {
  items: SubNavItem[];
}

export default function DashboardSubNav({ items }: DashboardSubNavProps) {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex items-center gap-1 border-b border-slate-200">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-4 py-3 text-sm font-bold transition-all ${
              isActive
                ? "text-emerald-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {item.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-600" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
