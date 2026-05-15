import {
  FilterBarSkeleton,
  MobileListSkeleton,
  PageHeaderSkeleton,
  SummaryCardsSkeleton,
  TableSkeleton,
} from "@/components/skeletons/dashboard-skeletons";

export function UsagePageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <SummaryCardsSkeleton count={4} />
      <FilterBarSkeleton />
      <div className="hidden lg:block">
        <TableSkeleton rows={8} columns={8} />
      </div>
      <MobileListSkeleton count={5} />
    </div>
  );
}
