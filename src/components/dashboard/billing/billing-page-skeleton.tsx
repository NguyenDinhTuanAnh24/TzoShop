import { Skeleton } from "@/components/ui/skeleton";

export function BillingPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-52" />
              <Skeleton className="h-4 w-[320px] max-w-[70vw]" />
            </div>
          </div>
          <Skeleton className="h-12 w-44" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <section key={i} className="min-h-[120px] border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000] md:p-6">
            <div className="flex items-center justify-between gap-4">
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-6 w-52" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          <div className="space-y-4 lg:hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3 border-4 border-black bg-[#FFFDF5] p-5 shadow-[5px_5px_0px_0px_#000]">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-28" />
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden border-4 border-black bg-[#FFFDF5] shadow-[8px_8px_0px_0px_#000] lg:block">
            <div className="space-y-0">
              <div className="grid grid-cols-6 gap-3 border-b-4 border-black bg-[#FFD93D] px-4 py-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-16" />
                ))}
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-3 border-b-2 border-black px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-28" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
          <Skeleton className="h-5 w-28" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </aside>
      </div>
    </div>
  );
}
