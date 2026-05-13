import { BrutalSkeleton, BrutalSkeletonCard } from "@/components/ui/brutal-skeleton";

export function ApiKeysPageSkeleton() {
  return (
    <div className="space-y-10 pb-20" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex items-start gap-4">
          <BrutalSkeleton className="h-14 w-14" />
          <div className="space-y-3">
            <BrutalSkeleton className="h-9 w-44" />
            <BrutalSkeleton className="h-4 w-96 max-w-full" />
          </div>
        </div>
      </section>

      <BrutalSkeletonCard className="p-6 md:p-7">
        <BrutalSkeleton className="h-6 w-48" />
        <BrutalSkeleton className="mt-3 h-4 w-80 max-w-full" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <BrutalSkeleton className="h-12 w-full" />
          <BrutalSkeleton className="h-12 w-full" />
        </div>
        <BrutalSkeleton className="mt-6 h-12 w-40" />
      </BrutalSkeletonCard>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrutalSkeleton className="h-9 w-9" />
            <BrutalSkeleton className="h-6 w-52" />
          </div>
          <BrutalSkeleton className="h-11 w-28" />
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <BrutalSkeletonCard key={i}>
              <div className="flex flex-wrap items-center gap-3">
                <BrutalSkeleton className="h-6 w-48" />
                <BrutalSkeleton className="h-6 w-28" />
              </div>
              <BrutalSkeleton className="mt-4 h-12 w-full" />
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <BrutalSkeleton className="h-10 w-full" />
                <BrutalSkeleton className="h-10 w-full" />
                <BrutalSkeleton className="h-10 w-full" />
              </div>
            </BrutalSkeletonCard>
          ))}
        </div>
      </section>
    </div>
  );
}

