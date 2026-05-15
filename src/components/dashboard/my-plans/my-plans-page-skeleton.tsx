import {
  FilterBarSkeleton,
  PageHeaderSkeleton,
  PlanGridSkeleton,
  SummaryCardsSkeleton,
} from "@/components/skeletons/dashboard-skeletons";

export function MyPlansPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <SummaryCardsSkeleton count={4} />
      <FilterBarSkeleton />
      <PlanGridSkeleton count={4} />
    </div>
  );
}
