import { Skeleton } from "@/components/ui/skeleton";

export function ApiDocsPageSkeleton() {
  return (
    <div className="space-y-8 lg:space-y-10" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-4 w-96 max-w-[70vw]" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </section>

      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-3 h-4 w-96 max-w-[70vw]" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="mt-4 h-5 w-28" />
              <Skeleton className="mt-2 h-4 w-full" />
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-11 w-36" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-11 w-11" />
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>

      <section className="border-4 border-black bg-[#111827] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <Skeleton className="h-7 w-64 bg-white/20" />
        <Skeleton className="mt-3 h-4 w-96 max-w-[70vw] bg-white/20" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-12 w-36 bg-white/20" />
          <Skeleton className="h-12 w-36 bg-white/20" />
        </div>
      </section>
    </div>
  );
}
