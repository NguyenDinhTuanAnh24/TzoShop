import {
  AccordionSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeletons/dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

function SupportCardsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="h-6 w-40 rounded-xl" />
            <Skeleton className="h-4 w-56 max-w-full rounded-full" />
            <Skeleton className="h-4 w-40 rounded-full" />
          </div>
          <div className="mt-6">
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportFormSkeleton() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-52 rounded-xl" />
        <Skeleton className="h-4 w-96 max-w-full rounded-full" />
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    </section>
  );
}

export function SupportPageSkeleton({ minimal = false }: { minimal?: boolean }) {
  if (minimal) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <SupportCardsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <SupportCardsSkeleton />
      <SupportFormSkeleton />
      <AccordionSkeleton count={4} />
    </div>
  );
}
