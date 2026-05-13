import { UsagePageSkeleton } from "@/components/dashboard/usage/usage-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8 lg:space-y-10" aria-busy="true">
      <UsagePageSkeleton />
    </main>
  );
}
