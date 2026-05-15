import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.18)] sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-9 w-52 rounded-xl" />
          <Skeleton className="h-5 w-[520px] max-w-full rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-28 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SummaryCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-5 h-4 w-24 rounded-full" />
          <Skeleton className="mt-3 h-8 w-28 rounded-xl" />
          <Skeleton className="mt-3 h-4 w-32 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function PlanCardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-7 w-40 rounded-xl" />
          <Skeleton className="h-4 w-52 rounded-full max-w-full" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
      <div className="mt-5">
        <Skeleton className="h-3 w-5/6 rounded-full" />
        <div className="mt-3 flex justify-between">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-11 min-w-0 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  );
}

export function PlanGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PlanCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-20 rounded-full" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 w-4/5 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4 lg:hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-44 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-5 space-y-3">
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-4 w-3/5 rounded-full" />
            <Skeleton className="h-4 w-2/5 rounded-full" />
          </div>
          <div className="mt-5 flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Skeleton className="h-7 w-48 rounded-xl" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full rounded-full" />
      <div className="mt-6 space-y-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="mt-2 h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    </div>
  );
}

export function CodeBlockSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3">
        <Skeleton className="h-4 w-24 rounded-full bg-slate-700" />
        <Skeleton className="h-9 w-28 rounded-xl bg-slate-700" />
      </div>
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-11/12 rounded-full bg-slate-700" />
        <Skeleton className="h-4 w-4/5 rounded-full bg-slate-700" />
        <Skeleton className="h-4 w-3/5 rounded-full bg-slate-700" />
        <Skeleton className="h-4 w-2/3 rounded-full bg-slate-700" />
        <Skeleton className="h-4 w-1/2 rounded-full bg-slate-700" />
      </div>
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-20 rounded-xl" />
      </div>
    </div>
  );
}

export function AccordionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-2/3 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
