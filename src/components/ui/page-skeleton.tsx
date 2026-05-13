import { Skeleton } from "@/components/ui/skeleton";

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="min-h-[120px] border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="mt-5 h-9 w-24" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex flex-col gap-6 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000] lg:flex-row lg:items-center">
          <div className="w-full shrink-0 lg:w-[220px]">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
          <div className="w-full shrink-0 space-y-2 lg:w-[150px]">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-16" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-6 border-t-2 border-black/20 pt-6 lg:border-none lg:pt-0">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000]" aria-hidden="true">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-4 border-black bg-[#FFFDF5]">
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-6 py-4 text-left">
                  <Skeleton className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10">
            {[...Array(rows)].map((_, i) => (
              <tr key={i}>
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <Skeleton className={j === 0 ? "h-4 w-40" : "h-4 w-24"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="ml-1 h-3 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Skeleton className="h-12 w-36" />
      </div>
    </div>
  );
}
