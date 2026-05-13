import { Skeleton } from "@/components/ui/skeleton";

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-8 lg:space-y-10" aria-hidden="true">
      <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14" />
          <div className="space-y-3">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-4 w-96 max-w-[70vw]" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
            <Skeleton className="h-6 w-52" />
            <div className="mt-6 flex items-center gap-4">
              <Skeleton className="h-20 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="mt-6 h-12 w-40" />
          </section>

          <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
            <Skeleton className="h-6 w-60" />
            <div className="mt-5 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </section>

          <section className="border-4 border-black bg-[#FFFDF5] p-6 shadow-[8px_8px_0px_0px_#000] md:p-7">
            <Skeleton className="h-6 w-44" />
            <div className="mt-5 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-44" />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border-4 border-black bg-[#FFFDF5] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-5 w-24" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </section>

          <section className="border-4 border-black bg-[#111827] p-5 shadow-[6px_6px_0px_0px_#000]">
            <Skeleton className="h-5 w-32 bg-white/20" />
            <Skeleton className="mt-3 h-4 w-full bg-white/20" />
            <Skeleton className="mt-5 h-12 w-full bg-white/20" />
          </section>
        </aside>
      </div>
    </div>
  );
}
