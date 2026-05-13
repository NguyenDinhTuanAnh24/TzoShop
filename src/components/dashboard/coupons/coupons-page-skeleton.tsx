import { BrutalSkeleton, BrutalSkeletonCard } from "@/components/ui/brutal-skeleton";

export function CouponsPageSkeleton() {
  return (
    <div className="space-y-8 pb-20" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex items-start gap-4">
          <BrutalSkeleton className="h-14 w-14" />
          <div className="space-y-3">
            <BrutalSkeleton className="h-9 w-64 max-w-full" />
            <BrutalSkeleton className="h-4 w-96 max-w-full" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <div className="flex gap-2">
            <BrutalSkeleton className="h-11 w-40" />
            <BrutalSkeleton className="h-11 w-32" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <BrutalSkeletonCard key={i} className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <BrutalSkeleton className="h-11 w-11" />
                    <div>
                      <BrutalSkeleton className="h-5 w-36" />
                      <BrutalSkeleton className="mt-2 h-4 w-28" />
                    </div>
                  </div>
                  <BrutalSkeleton className="h-8 w-16" />
                </div>
                <BrutalSkeleton className="h-4 w-40" />
                <BrutalSkeleton className="mt-2 h-4 w-36" />
                <BrutalSkeleton className="mt-2 h-4 w-44" />
                <BrutalSkeleton className="mt-4 h-11 w-full" />
              </BrutalSkeletonCard>
            ))}
          </div>
        </section>

        <aside>
          <BrutalSkeletonCard className="p-6">
            <BrutalSkeleton className="h-5 w-40" />
            <div className="mt-3 space-y-2">
              <BrutalSkeleton className="h-4 w-full" />
              <BrutalSkeleton className="h-4 w-full" />
              <BrutalSkeleton className="h-4 w-full" />
              <BrutalSkeleton className="h-4 w-2/3" />
              <BrutalSkeleton className="h-4 w-4/5" />
            </div>
          </BrutalSkeletonCard>
        </aside>
      </div>
    </div>
  );
}

