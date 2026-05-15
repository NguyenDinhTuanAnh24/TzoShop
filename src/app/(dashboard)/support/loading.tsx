import { SupportPageSkeleton } from "@/components/dashboard/support/support-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8 lg:space-y-10" aria-busy="true">
      <SupportPageSkeleton />
    </main>
  );
}
