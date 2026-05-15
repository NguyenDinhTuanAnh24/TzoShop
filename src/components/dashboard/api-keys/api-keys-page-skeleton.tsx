import {
  FilterBarSkeleton,
  FormSkeleton,
  PageHeaderSkeleton,
  SummaryCardsSkeleton,
  PlanGridSkeleton,
} from "@/components/skeletons/dashboard-skeletons";

export function ApiKeysPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <SummaryCardsSkeleton count={4} />
      <FormSkeleton />
      <FilterBarSkeleton />
      <PlanGridSkeleton count={4} />
    </div>
  );
}
