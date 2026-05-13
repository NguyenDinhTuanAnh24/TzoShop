import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function BrutalSkeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-[6px] bg-[#E9E1D0]", className)} />;
}

export function BrutalSkeletonCard({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div aria-hidden="true" className={cn("border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000] md:p-6", className)}>
      {children}
    </div>
  );
}

