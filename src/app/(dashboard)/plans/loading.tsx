import { PlansPageSkeleton } from "@/components/dashboard/plans/plans-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8" aria-busy="true">
      <PlansPageSkeleton />
    </main>
  );
}

