import { Skeleton } from "@/components/ui/skeleton";

export function UsagePageSkeleton() {
  return (
    <div className="space-y-8 lg:space-y-10" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-4 w-96 max-w-[70vw]" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <section key={i} className="min-h-[120px] border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-9" />
            </div>
            <Skeleton className="mt-5 h-8 w-20" />
            <Skeleton className="mt-2 h-4 w-28" />
          </section>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_300px]">
        <section className="space-y-5">
          <div className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
            <Skeleton className="h-6 w-44" />
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-4 lg:hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3 border-4 border-black bg-[#FFFDF5] p-5 shadow-[5px_5px_0px_0px_#000]">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden border-4 border-black bg-[#FFFDF5] shadow-[8px_8px_0px_0px_#000] lg:block">
            <div className="grid grid-cols-7 gap-3 border-b-4 border-black bg-[#FFD93D] px-4 py-3">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-3 border-b-2 border-black px-4 py-4">
                {[...Array(7)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-20" />
                ))}
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <Skeleton className="mt-4 h-11 w-full" />
            <Skeleton className="mt-3 h-11 w-full" />
          </div>
          <div className="border-4 border-black bg-[#111827] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-5 w-36 bg-white/20" />
            <Skeleton className="mt-3 h-4 w-full bg-white/20" />
            <Skeleton className="mt-2 h-4 w-4/5 bg-white/20" />
            <Skeleton className="mt-4 h-12 w-full bg-white/20" />
          </div>
        </aside>
      </div>
    </div>
  );
}
