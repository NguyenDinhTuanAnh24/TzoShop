import {
  FilterBarSkeleton,
  PageHeaderSkeleton,
  SummaryCardsSkeleton,
  TableSkeleton,
  MobileListSkeleton,
} from "@/components/skeletons/dashboard-skeletons";

export function BillingPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <SummaryCardsSkeleton count={4} />
      <FilterBarSkeleton />
      <div className="hidden lg:block">
        <TableSkeleton rows={6} columns={6} />
      </div>
      <MobileListSkeleton count={4} />
    </div>
  );
}
