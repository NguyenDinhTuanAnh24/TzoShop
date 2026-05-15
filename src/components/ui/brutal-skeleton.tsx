import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export function BrutalSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className} />;
}

export function BrutalSkeletonCard({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div aria-hidden="true" className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6", className)}>
      {children}
    </div>
  );
}
