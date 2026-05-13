import { MyPlansPageSkeleton } from "@/components/dashboard/my-plans/my-plans-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8" aria-busy="true">
      <MyPlansPageSkeleton />
    </main>
  );
}

