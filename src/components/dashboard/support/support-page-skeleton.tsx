import { Skeleton } from "@/components/ui/skeleton";

export function SupportPageSkeleton({ minimal = false }: { minimal?: boolean }) {
  if (minimal) {
    return (
      <div className="space-y-4" aria-hidden="true">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14" />
          <div className="space-y-3">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-96 max-w-[70vw]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-36" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <div className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
            <Skeleton className="h-6 w-52" />
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="mt-4 h-12 w-full" />
            <Skeleton className="mt-4 h-40 w-full" />
            <Skeleton className="mt-4 h-12 w-full" />
            <Skeleton className="mt-5 h-14 w-full" />
          </div>

          <div>
            <Skeleton className="h-6 w-44" />
            <div className="mt-4 space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-5 w-40" />
            <div className="mt-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
          <div className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-5 w-48" />
            <div className="mt-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <Skeleton className="mt-4 h-11 w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}
