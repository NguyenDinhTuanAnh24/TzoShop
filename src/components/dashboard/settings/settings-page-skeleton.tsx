import { Skeleton } from "@/components/ui/skeleton";

function SettingsHeaderSkeleton() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.18)] sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-9 w-48 rounded-xl" />
          <Skeleton className="h-5 w-[520px] max-w-full rounded-full" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-28 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>
    </section>
  );
}

function SettingsProfileSkeleton() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-52 rounded-xl" />
          <Skeleton className="h-4 w-80 max-w-full rounded-full" />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
        <Skeleton className="h-24 w-24 rounded-3xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-4 w-64 max-w-full rounded-full" />
          <Skeleton className="h-7 w-56 rounded-lg" />
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-4 w-72 max-w-full rounded-full" />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    </section>
  );
}

function SettingsLoginMethodsSkeleton() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-60 rounded-xl" />
          <Skeleton className="h-4 w-80 max-w-full rounded-full" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-40 rounded-full" />
                <Skeleton className="h-4 w-64 max-w-full rounded-full" />
              </div>
            </div>
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

function SettingsNotificationsSkeleton() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-36 rounded-xl" />
          <Skeleton className="h-4 w-80 max-w-full rounded-full" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-5"
          >
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-5 w-48 rounded-full" />
              <Skeleton className="h-4 w-72 max-w-full rounded-full" />
            </div>
            <Skeleton className="h-8 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="w-full space-y-6" aria-hidden="true">
      <SettingsHeaderSkeleton />
      <SettingsProfileSkeleton />
      <SettingsLoginMethodsSkeleton />
      <SettingsNotificationsSkeleton />
    </div>
  );
}

