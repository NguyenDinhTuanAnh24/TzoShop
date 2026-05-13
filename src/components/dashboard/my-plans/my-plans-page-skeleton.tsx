import { BrutalSkeleton, BrutalSkeletonCard } from "@/components/ui/brutal-skeleton";

export function MyPlansPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <BrutalSkeleton className="h-14 w-14" />
              <BrutalSkeleton className="h-9 w-52" />
            </div>
            <BrutalSkeleton className="h-4 w-96 max-w-full" />
          </div>
          <BrutalSkeleton className="h-12 w-44" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <BrutalSkeletonCard key={i} className="min-h-[120px]">
            <div className="flex items-start justify-between gap-4">
              <BrutalSkeleton className="h-4 w-32" />
              <BrutalSkeleton className="h-9 w-9" />
            </div>
            <BrutalSkeleton className="mt-5 h-8 w-16" />
            <BrutalSkeleton className="mt-2 h-4 w-28" />
          </BrutalSkeletonCard>
        ))}
      </div>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrutalSkeleton className="h-9 w-9" />
            <BrutalSkeleton className="h-6 w-56" />
          </div>
          <BrutalSkeleton className="h-11 w-44" />
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <BrutalSkeletonCard key={i}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <BrutalSkeleton className="h-6 w-48" />
                <BrutalSkeleton className="h-6 w-24" />
                <BrutalSkeleton className="h-6 w-28" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((__, j) => (
                  <BrutalSkeleton key={j} className="h-20 w-full" />
                ))}
              </div>
              <BrutalSkeleton className="mt-5 h-5 w-full" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <BrutalSkeleton className="h-11 w-full" />
                <BrutalSkeleton className="h-11 w-full" />
              </div>
            </BrutalSkeletonCard>
          ))}
        </div>
      </section>
    </div>
  );
}

