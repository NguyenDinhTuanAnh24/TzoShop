import { CouponsPageSkeleton } from "@/components/dashboard/coupons/coupons-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8" aria-busy="true">
      <CouponsPageSkeleton />
    </main>
  );
}

