import { BrutalSkeleton, BrutalSkeletonCard } from "@/components/ui/brutal-skeleton";

export function PlansPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <BrutalSkeleton className="h-14 w-14" />
              <BrutalSkeleton className="h-5 w-36" />
            </div>
            <BrutalSkeleton className="h-9 w-64 max-w-full" />
            <BrutalSkeleton className="h-4 w-96 max-w-full" />
          </div>
          <BrutalSkeleton className="h-11 w-40" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <BrutalSkeletonCard key={i} className="p-5 shadow-[5px_5px_0px_0px_#000]">
              <BrutalSkeleton className="h-2 w-14" />
              <BrutalSkeleton className="mt-5 h-6 w-24" />
              <BrutalSkeleton className="mt-2 h-4 w-20" />
            </BrutalSkeletonCard>
          ))}
        </div>
      </section>

      <BrutalSkeletonCard>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3">
              <BrutalSkeleton className="h-7 w-28" />
              {[...Array(5)].map((__, j) => (
                <BrutalSkeleton key={j} className="h-9 w-20" />
              ))}
            </div>
          ))}
        </div>
      </BrutalSkeletonCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <BrutalSkeletonCard key={i}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <BrutalSkeleton className="h-6 w-44" />
                  <BrutalSkeleton className="mt-2 h-6 w-20" />
                </div>
                <BrutalSkeleton className="h-16 w-36" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((__, j) => (
                    <BrutalSkeleton key={j} className="h-9 w-24" />
                  ))}
                </div>
                <div>
                  <BrutalSkeleton className="h-7 w-28" />
                  <BrutalSkeleton className="mt-3 h-12 w-32" />
                </div>
              </div>
            </BrutalSkeletonCard>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <BrutalSkeletonCard key={i}>
              <BrutalSkeleton className="h-6 w-40" />
              <BrutalSkeleton className="mt-4 h-4 w-full" />
              <BrutalSkeleton className="mt-2 h-4 w-full" />
              <BrutalSkeleton className="mt-2 h-4 w-2/3" />
            </BrutalSkeletonCard>
          ))}
        </div>
      </div>
    </div>
  );
}

