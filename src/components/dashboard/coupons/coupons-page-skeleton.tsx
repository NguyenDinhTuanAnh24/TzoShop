import {
  FilterBarSkeleton,
  FormSkeleton,
  PageHeaderSkeleton,
  PlanGridSkeleton,
  SummaryCardsSkeleton,
} from "@/components/skeletons/dashboard-skeletons";

export function CouponsPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <FormSkeleton />
      <SummaryCardsSkeleton count={4} />
      <FilterBarSkeleton />
      <PlanGridSkeleton count={6} />
    </div>
  );
}
