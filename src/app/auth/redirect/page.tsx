"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (session?.user) {
      const role = session.user.role;
      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [session, status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="text-sm font-bold text-slate-600 animate-pulse">
          Đang chuyển hướng...
        </p>
      </div>
    </div>
  );
}
