import Skeleton from "react-loading-skeleton";

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Skeleton width={80} height={12} />
            <Skeleton circle width={16} height={16} />
          </div>
          <Skeleton width={120} height={32} />
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center"
        >
          <div className="w-full shrink-0 lg:w-[220px]">
            <Skeleton width={150} height={24} />
            <Skeleton width={100} height={12} className="mt-2" />
          </div>
          <div className="flex flex-col gap-1 w-full shrink-0 lg:w-[150px]">
            <Skeleton width={80} height={20} />
            <Skeleton width={120} height={12} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} width={60} height={24} borderRadius="0.5rem" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-6 border-t border-slate-50 pt-6 lg:border-none lg:pt-0">
            <Skeleton width={100} height={28} />
            <Skeleton width={80} height={40} borderRadius="2rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-6 py-4 text-left">
                  <Skeleton width={80} height={12} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...Array(rows)].map((_, i) => (
              <tr key={i}>
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <Skeleton width={j === 0 ? 150 : 100} height={16} />
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
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton width={100} height={14} className="ml-1" />
            <Skeleton height={48} borderRadius="1rem" />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Skeleton width={140} height={48} borderRadius="2rem" />
      </div>
    </div>
  );
}
