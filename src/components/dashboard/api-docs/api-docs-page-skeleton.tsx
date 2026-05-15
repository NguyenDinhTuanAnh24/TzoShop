import {
  CodeBlockSkeleton,
  PageHeaderSkeleton,
  SummaryCardsSkeleton,
} from "@/components/skeletons/dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export function ApiDocsPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <SummaryCardsSkeleton count={3} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="mt-3 h-11 w-64 max-w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="mt-3 h-11 w-64 max-w-full rounded-xl" />
        </div>
      </div>
      <CodeBlockSkeleton />
      <CodeBlockSkeleton />
    </div>
  );
}
