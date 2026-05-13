import { BillingPageSkeleton } from "@/components/dashboard/billing/billing-page-skeleton";

export default function Loading() {
  return (
    <main className="px-5 py-6 lg:px-8 lg:py-8" aria-busy="true">
      <BillingPageSkeleton />
    </main>
  );
}
